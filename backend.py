import asyncio
import json
import math
from fastapi import FastAPI, WebSocket

app = FastAPI()
clients = set()

# ======================================================
# NODE METADATA (shown in popup)
# ======================================================
nodes_meta = {
    "NODE_A": {
        "terminal_name": "Tracker A",
        "channel_name": "AssamMesh"
    },
    "NODE_B": {
        "terminal_name": "Tracker B",
        "channel_name": "AssamMesh"
    }
}

# ======================================================
# TEZPUR, ASSAM START LOCATIONS
# ======================================================
nodes = {
    "NODE_A": {"lat": 26.6528, "lon": 92.7926, "angle": 0},  # Tezpur center
    "NODE_B": {"lat": 26.7006, "lon": 92.8234, "angle": 0},  # Tezpur University
}

radius_a = 0.003   # ~300m loop
radius_b = 0.004   # ~400m loop


# ======================================================
# WEBSOCKET BROADCAST
# ======================================================
async def broadcast(data):
    msg = json.dumps(data)
    for ws in list(clients):
        try:
            await ws.send_text(msg)
        except:
            clients.remove(ws)


# ======================================================
# MOCK SIMULATED MOVEMENT (TEZPUR)
# ======================================================
async def mock_node_movements():
    while True:
        # Node A
        nodes["NODE_A"]["angle"] += 0.05
        nodes["NODE_A"]["lat"] = 26.6528 + radius_a * math.sin(nodes["NODE_A"]["angle"])
        nodes["NODE_A"]["lon"] = 92.7926 + radius_a * math.cos(nodes["NODE_A"]["angle"])

        # Node B
        nodes["NODE_B"]["angle"] += 0.03
        nodes["NODE_B"]["lat"] = 26.7006 + radius_b * math.sin(nodes["NODE_B"]["angle"])
        nodes["NODE_B"]["lon"] = 92.8234 + radius_b * math.cos(nodes["NODE_B"]["angle"])

        # Broadcast updates
        for node_id in nodes:
            await broadcast({
                "node_id": node_id,
                "terminal_name": nodes_meta[node_id]["terminal_name"],
                "channel_name": nodes_meta[node_id]["channel_name"],
                "lat": nodes[node_id]["lat"],
                "lon": nodes[node_id]["lon"]
            })

        await asyncio.sleep(1)


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(mock_node_movements())


# ======================================================
# WEBSOCKET ENDPOINT
# ======================================================
@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await ws.accept()
    clients.add(ws)

    try:
        while True:
            await ws.receive_text()  # keep connection open
    except:
        clients.remove(ws)
