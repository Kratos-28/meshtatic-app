# Meshtastic Live Tracking App

A real-time GPS tracking application for Meshtastic nodes, built with:

- FastAPI (WebSocket backend)
- React + Leaflet (map frontend)
- Custom phone icons
- Simulated movement
- Ready for real LILYGO / Heltec / T-Beam devices

Works without any hardware using simulation mode.

------------------------------------------------------------

## Features

- Live GPS map
- Smooth moving nodes
- Trails (movement history)
- Auto-center map
- Custom icons per node
- Terminal name / Channel name display
- Bengaluru default coordinates

------------------------------------------------------------

## Requirements

- Python 3.11+
- Node.js 18+
- Git

------------------------------------------------------------

## Quick Start Setup

### 1. Clone Repository

git clone https://github.com/YOUR_USERNAME/meshtastic-app.git
cd meshtastic-app

------------------------------------------------------------

### 2. Backend Setup (FastAPI)

#### Mac / Linux

python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn

#### Windows (PowerShell)

python -m venv venv
.\venv\Scripts\activate
pip install fastapi uvicorn

#### Run backend

uvicorn backend:app --host 0.0.0.0 --port 8000 --reload

WebSocket endpoint:
ws://localhost:8000/ws

------------------------------------------------------------

### 3. Frontend Setup (React + Leaflet)

cd frontend
npm install
npm start

Browser opens automatically:
http://localhost:3000

------------------------------------------------------------

## Project Structure

meshtastic-app/
│
├── backend.py
└── frontend/
    ├── public/
    │   └── icons/
    │       ├── node_a.png
    │       └── node_b.png
    └── src/
        ├── App.js
        └── index.js

------------------------------------------------------------

## Custom Icons

Place phone icons here:

frontend/public/icons/node_a.png  
frontend/public/icons/node_b.png

You can replace these anytime — just keep file names the same.

------------------------------------------------------------

## Simulation Mode (default)

This application works without any hardware.

- NODE_A moves around MG Road
- NODE_B moves around Koramangala
- Updates every 1 second
- Trails stored for last 100 positions

Simulation code:
backend.py → mock_node_movements()

------------------------------------------------------------

## Real Meshtastic Device Setup (optional)

1. Install library:
pip install meshtastic

2. Find serial port (Mac):
ls /dev/tty.usb*

3. In backend.py, uncomment:

import meshtastic.serial_interface
interface = meshtastic.serial_interface.SerialInterface("/dev/tty.usbmodemXXXX")

4. Comment out simulation:

asyncio.create_task(mock_node_movements())

Now backend displays real node GPS.

------------------------------------------------------------

## Commands

Start backend:
uvicorn backend:app --host 0.0.0.0 --port 8000 --reload

Start frontend:
cd frontend
npm start

------------------------------------------------------------

