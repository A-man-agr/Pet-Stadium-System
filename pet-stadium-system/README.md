# Pet-Friendly Smart Stadium Management System

This is a full-stack React and Express web application designed as a Management System for venues accommodating large crowds and pets. 
It improves the physical event experience by natively tackling stadium challenges like crowd movement, waiting times, and real-time staff coordination. By bringing a unique focus to pet owners, it introduces specialized features to ensure a seamless, engaging, and highly visual stadium experience for all attendees.

## Architecture

We broke down the implementation into a modern architecture:
- **Frontend (`/frontend`)**: Developed with React and Vite. It sports a custom dark-mode Glassmorphism style, complete with animations, gradients, and a floating AI Assistant widget.
- **Backend (`/backend`)**: Developed with Node.js and Express. Hosts a REST API and handles data from a simulated JSON database layer (`data/db.json`). Everything operates using in-memory queries mimicking a complex system.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)

### 2. Running the Backend Server
The backend handles simulated heatmap and waiting line API requests.

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server on port 5000:
   ```bash
   npm start
   ```

### 3. Running the Frontend Dashboard
The frontend hosts the Admin dashboard to view crowds, maps, registers pets, etc.

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL in your browser (usually `http://localhost:5173`).

### Core Features Accessible via Dashboard:
1. **Interactive 3D Radar Map**: Visual, dynamic representation of simulated crowd locations that you can tilt and drag.
2. **Environment & Particle Simulator**: Global CSS engine that simulates raining weather and falling confetti over the stadium interface.
3. **VIP Radar Tracker**: A full-screen, sweeping military-style tracker for locating chipped pets and VIPs.
4. **Pet Matchmaker**: A live social feed of pets currently in the stadium looking for playdates.
5. **Live Decibel Analytics**: Real-time bouncing equalizer visualizing noise levels across different stadium zones.
6. **Smart Routes**: Suggests optimal low-noise routes to user's desired zones with a generated visual pipeline timeline.
7. **Wait Times**: Live feed of waiting queues at food stalls and entry gates, updatable in real-time via Admin Controls.
8. **Digital Holographic Passes**: Register your pet to receive an interactive 3D digital clearance card featuring premium foil sweep animations.
9. **Nexa AI Assistant**: Floating smart widget that features animated typing indicators to provide instant answers to crowd questions.
