import asyncio
import json
import math
from fastapi import FastAPI, WebSocket

app = FastAPI()
clients = set()

# ======================================================
# INITIAL POSITIONS (Bengaluru, India)
# ======================================================
nodes = {
    "NODE_A": {"lat": 12.9716, "lon": 77.5946, "angle": 0},
    "NODE_B": {"lat": 12.9352, "lon": 77.6245, "angle": 0},
}

# Movement radius in degrees (~lat/lon offset)
radius_a = 0.003   # ~350 meters radius
radius_b = 0.004   # ~450 meters radius

async def broadcast(data):
    msg = json.dumps(data)
    for ws in list(clients):
        try:
            await ws.send_text(msg)
        except:
            clients.remove(ws)


# ======================================================
# SIMULATED MOTION LOOP
# ======================================================
async def mock_node_movements():
    while True:
        # move NODE_A in circular path
        nodes["NODE_A"]["angle"] += 0.05
        nodes["NODE_A"]["lat"] = 12.9716 + radius_a * math.sin(nodes["NODE_A"]["angle"])
        nodes["NODE_A"]["lon"] = 77.5946 + radius_a * math.cos(nodes["NODE_A"]["angle"])

        # move NODE_B in circular path
        nodes["NODE_B"]["angle"] += 0.03
        nodes["NODE_B"]["lat"] = 12.9352 + radius_b * math.sin(nodes["NODE_B"]["angle"])
        nodes["NODE_B"]["lon"] = 77.6245 + radius_b * math.cos(nodes["NODE_B"]["angle"])

        # broadcast new positions
        for node_id in nodes:
            await broadcast({
                "node_id": node_id,
                "lat": nodes[node_id]["lat"],
                "lon": nodes[node_id]["lon"]
            })

        await asyncio.sleep(1)  # movement update every second


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(mock_node_movements())


# ======================================================
# REAL MESHTASTIC SUPPORT (COMMENTED FOR NOW)
# ======================================================
"""
import meshtastic.serial_interface

interface = meshtastic.serial_interface.SerialInterface("/dev/tty.usbmodemXXXX")

def on_receive(packet, *_):
    decoded = packet.get("decoded", {})
    if "position" in decoded:
        pos = decoded["position"]
        node_id = packet.get("fromId")
        data = {
            "node_id": node_id,
            "lat": pos.get("latitude"),
            "lon": pos.get("longitude")
        }
        asyncio.get_event_loop().create_task(broadcast(data))

interface.pub.subscribe(on_receive, "meshtastic.receive")
"""


# ======================================================
# WEBSOCKET ENDPOINT
# ======================================================
@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    clients.add(ws)
    try:
        while True:
            await ws.receive_text()
    except:
        clients.remove(ws)
