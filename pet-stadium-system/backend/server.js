const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'data', 'db.json');

// Utility to read DB
const readDB = () => {
    try {
        const rawData = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(rawData);
    } catch (err) {
        console.error("Error reading db.json", err);
        return { stadiumInfo: { zones: [], alerts: [] }, pets: [] };
    }
};

// Utility to write DB
const writeDB = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        console.error("Error writing db.json", err);
    }
};

// Endpoints

app.get('/api/stadium', (req, res) => {
    const db = readDB();
    res.json(db.stadiumInfo);
});

app.post('/api/pets/register', (req, res) => {
    const { ownerName, petName, breed, age, dietType } = req.body;
    const db = readDB();
    
    const newPet = {
        id: Date.now().toString(),
        ownerName,
        petName,
        breed,
        age,
        dietType,
        digitalPassQR: `PASS-${Math.floor(Math.random()*100000)}`
    };
    
    db.pets.push(newPet);
    writeDB(db);
    
    res.status(201).json({ message: "Pet registered successfully!", pet: newPet });
});

app.post('/api/chatbot', (req, res) => {
    const { message } = req.body;
    const lowerMessage = message.toLowerCase();
    
    let reply = "I'm sorry, I couldn't understand that. You can ask me about pet zones, crowded areas, or pet diets!";
    
    if (lowerMessage.includes("nearest") && lowerMessage.includes("pet zone")) {
        reply = "The nearest pet zone is Pet Relief Zone A, currently experiencing Low crowd with a wait time of 2 mins.";
    } else if (lowerMessage.includes("crowded") || lowerMessage.includes("exit")) {
        reply = "The South Exit has medium crowd. North Entry is currently very crowded. I recommend using the East Entry to exit if possible.";
    } else if (lowerMessage.includes("feed") || lowerMessage.includes("diet")) {
        reply = "If your pet prefers vegetarian, we have specialized vet-approved vegan jerky at Food Stall 1.";
    }

    res.json({ reply });
});

// Serve static React frontend files from /public directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to redirect unknown requests (like React Router refreshes) to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// IMPORTANT: Google Cloud Run dynamically passes a port and requires host to be 0.0.0.0
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Unified Pet Stadium System running on port ${PORT}`);
});
