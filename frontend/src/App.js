import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icons = {
  NODE_A: L.icon({
    iconUrl: process.env.PUBLIC_URL + "/icon/node1.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
  }),
  NODE_B: L.icon({
    iconUrl: process.env.PUBLIC_URL + "/icon/node2.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
  }),
};

// ======================================================
// Auto fit map to nodes
// ======================================================
function AutoFitMap({ nodes }) {
  const map = useMap();

  useEffect(() => {
    const positions = Object.values(nodes).map((n) => [n.lat, n.lon]);
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [80, 80] });
    }
  }, [nodes, map]);

  return null;
}

function App() {
  const [nodes, setNodes] = useState({});

  useEffect(() => {
    // 👇 Change IP to YOUR machine LAN IP
    const ws = new WebSocket("ws://192.168.1.18:8000/ws");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setNodes((prev) => {
        const history = prev[data.node_id]?.history || [];
        const newHistory = [...history, [data.lat, data.lon]].slice(-100);

        return {
          ...prev,
          [data.node_id]: {
            ...data,
            history: newHistory,
          },
        };
      });
    };

    return () => ws.close();
  }, []);

  return (
    <MapContainer
      center={[26.65, 92.79]}   // ⭐️ Tezpur Assam map center
      zoom={13}
      style={{ height: "100vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <AutoFitMap nodes={nodes} />

      {Object.entries(nodes).map(([id, node]) => (
        <React.Fragment key={id}>
          {/* Trail Line */}
          {node.history && (
            <Polyline
              positions={node.history}
              pathOptions={{ color: id === "NODE_A" ? "blue" : "red" }}
            />
          )}

          {/* Icon Marker */}
          <Marker
            position={[node.lat, node.lon]}
            icon={icons[id] || icons.NODE_A}
          >
            <Popup>
              <strong>{node.terminal_name}</strong>
              <br />
              Channel: {node.channel_name}
              <br />
              <br />
              Lat: {node.lat.toFixed(5)}
              <br />
              Lon: {node.lon.toFixed(5)}
            </Popup>
          </Marker>
        </React.Fragment>
      ))}
    </MapContainer>
  );
}

export default App;
