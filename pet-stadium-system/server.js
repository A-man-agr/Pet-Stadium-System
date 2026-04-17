const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { Firestore } = require('@google-cloud/firestore');
const { Logging } = require('@google-cloud/logging');
const { Storage } = require('@google-cloud/storage');
const { GoogleGenAI } = require('@google/genai');

const app = express();

// Security and Efficiency Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled to simplify frontend serving in this demo
}));
app.use(compression());
app.use(cors());
app.use(express.json());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Database Adapter Wrapper
const dbPath = path.join(__dirname, 'data', 'db.json');
let firestore, logging, storage, aiClient, gcpLogger;
let usingGCP = false;

try {
  // If deployed to Cloud Run, this will auto-authenticate via ADC
  firestore = new Firestore();
  logging = new Logging();
  storage = new Storage();
  aiClient = new GoogleGenAI({});
  gcpLogger = logging.log('pet-stadium-app-log');
  usingGCP = true;
  console.log('Firebase and GCP initialized securely via ADC.');
} catch (error) {
  console.warn('Failed to initialize GCP SDKs. Falling back to local mock data.', error);
  usingGCP = false;
}

const logToCloud = (entryData) => {
  if (usingGCP && gcpLogger) {
    const entry = gcpLogger.entry({ resource: { type: 'global' } }, entryData);
    gcpLogger.write(entry).catch(console.error);
  } else {
    console.log('[LOCAL LOG]', entryData);
  }
};

// Data seed for local/initial fallback
const fallbackData = {
  stadiumInfo: {
    zones: [
      { id: "A", name: "North Entry", crowdLevel: "high", waitTime: 25 },
      { id: "B", name: "Food Stall 1", crowdLevel: "medium", waitTime: 15 },
      { id: "C", name: "Pet Relief Zone A", crowdLevel: "low", waitTime: 2 }
    ],
    alerts: [
      { id: 1, message: "North Entry is experiencing high traffic. Please use East Entry.", type: "warning" },
      { id: 2, message: "Pet Relief Zone A has fresh water refilled.", type: "info" }
    ]
  },
  pets: []
};

const getStadiumInfo = async () => {
  if (usingGCP) {
    try {
      const doc = await firestore.collection('stadium').doc('info').get();
      if (doc.exists) return doc.data();
    } catch (e) {
      logToCloud({ severity: 'ERROR', message: 'Firestore read error', error: e.toString() });
    }
  }
  // Fallback to local
  try {
    const rawData = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(rawData).stadiumInfo;
  } catch (err) {
    return fallbackData.stadiumInfo;
  }
};

const registerPet = async (newPet) => {
  if (usingGCP) {
    try {
      await firestore.collection('pets').doc(newPet.id).set(newPet);
      return;
    } catch (e) {
      logToCloud({ severity: 'ERROR', message: 'Firestore write error', error: e.toString() });
    }
  }
  // Fallback to local
  try {
    let db = fallbackData;
    if (fs.existsSync(dbPath)) {
        const rawData = fs.readFileSync(dbPath, 'utf-8');
        db = JSON.parse(rawData);
    }
    db.pets = db.pets || [];
    db.pets.push(newPet);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing db.json", err);
  }
};

// Endpoints

app.get('/api/stadium', async (req, res, next) => {
  try {
    const info = await getStadiumInfo();
    res.json(info);
  } catch (error) {
    next(error);
  }
});

app.post('/api/pets/register', [
  body('ownerName').trim().notEmpty().escape(),
  body('petName').trim().notEmpty().escape(),
  body('age').isInt({ min: 0 }).withMessage('Age must be a positive number'),
  body('breed').trim().escape()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ownerName, petName, breed, age, dietType } = req.body;
    
    const newPet = {
      id: Date.now().toString(),
      ownerName,
      petName,
      breed,
      age: parseInt(age, 10),
      dietType: dietType || 'Standard',
      digitalPassQR: `PASS-${Math.floor(Math.random()*100000)}`
    };
    
    await registerPet(newPet);
    
    // GCS Bucket Backup for Event Logging
    if (usingGCP && storage) {
      try {
        const bucketName = 'pet-stadium-cloud-archives';
        const backupFile = storage.bucket(bucketName).file(`registrations/${newPet.id}.json`);
        // We do not await this to prevent blocking the HTTP response
        backupFile.save(JSON.stringify(newPet, null, 2), { contentType: 'application/json' })
          .then(() => logToCloud({ severity: 'INFO', message: `GCS backup complete for ${newPet.id}` }))
          .catch(err => logToCloud({ severity: 'WARNING', message: `GCS backup failed for ${newPet.id}`, error: err.toString() }));
      } catch (err) {
        logToCloud({ severity: 'WARNING', message: 'Failed to access GCS' });
      }
    }
    
    res.status(201).json({ message: "Pet registered successfully!", pet: newPet });
  } catch (error) {
    next(error);
  }
});

app.post('/api/chatbot', [
  body('message').trim().notEmpty().escape()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;
    let reply = "I'm sorry, my systems are currently offline.";
    
    if (usingGCP && aiClient) {
      try {
        const stadiumData = await getStadiumInfo();
        const promptContext = `You are the stadium assistant. Live data: ${JSON.stringify(stadiumData)}. Answer concisely in 1-2 friendly sentences. User: "${message}"`;
        
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptContext
        });
        reply = response.text || "I was unable to process the data.";
        logToCloud({ severity: 'INFO', message: 'Gemini successfully generated response', userQuery: message });
      } catch (err) {
        logToCloud({ severity: 'ERROR', message: 'Gemini request failed', error: err.toString() });
        reply = "My AI circuits are currently overloaded! Check the dashboard or Pet Relief zones.";
      }
    } else {
      const lowerMessage = message.toLowerCase();
      reply = "I'm sorry, I couldn't understand that. You can ask me about pet zones, crowded areas, or pet diets!";
      
      if (lowerMessage.includes("nearest") && lowerMessage.includes("pet zone")) {
          reply = "The nearest pet zone is Pet Relief Zone A, currently experiencing Low crowd with a wait time of 2 mins.";
      } else if (lowerMessage.includes("crowded") || lowerMessage.includes("exit")) {
          reply = "The South Exit has medium crowd. North Entry is currently very crowded. I recommend using the East Entry to exit if possible.";
      } else if (lowerMessage.includes("feed") || lowerMessage.includes("diet")) {
          reply = "If your pet prefers vegetarian, we have specialized vet-approved vegan jerky at Food Stall 1.";
      }
    }

    res.json({ reply });
  } catch (error) {
    next(error);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  logToCloud({ severity: 'ERROR', message: 'Global Express Crash', stack: err.stack });
  res.status(500).json({ error: 'Something went wrong!' });
});

// Serve static React frontend files from /public directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to redirect unknown requests (like React Router refreshes) to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// IMPORTANT: Google Cloud Run dynamically passes a port and requires host to be 0.0.0.0
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
      console.log(`Unified Pet Stadium System running on port ${PORT}`);
  });
}

module.exports = app;
