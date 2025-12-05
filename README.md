# Meshtastic Live Tracking App

A real-time GPS tracking application for Meshtastic nodes, built with:
- FastAPI (WebSocket backend)
- React + Leaflet (map frontend)
- Custom phone icons
- Simulated movement
- Ready for real LILYGO / Heltec / T-Beam devices

## Quick Start Setup

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/meshtastic-app.git
cd meshtastic-app
```

### 2. Backend Setup (FastAPI)

#### Mac / Linux
```bash
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn
```

#### Windows (PowerShell)
```bash
python -m venv venv
.env\Scriptsctivate
pip install fastapi uvicorn
```

#### Run backend
```bash
uvicorn backend:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup (React + Leaflet)
```bash
cd frontend
npm install
npm start
```

Browser opens automatically:
http://localhost:3000
