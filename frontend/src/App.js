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


// ======================================================
// CUSTOM ICONS
// ======================================================
const icons = {
  NODE_A: L.icon({
    iconUrl: process.env.PUBLIC_URL + "/icon/node1.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
  }),
  NODE_B: L.icon({
    iconUrl: process.env.PUBLIC_URL + "/icon/node2.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
  })
};


// ======================================================
// AUTOFIT MAP
// ======================================================
function AutoFitMap({ nodes }) {
  const map = useMap();

  useEffect(() => {
    const positions = Object.values(nodes).map(n => [n.lat, n.lon]);
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [50, 50] });
    }
  }, [nodes, map]);

  return null;
}


function App() {
  const [nodes, setNodes] = useState({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setNodes(prev => {
        const history = prev[data.node_id]?.history || [];
        const updatedHistory = [...history, [data.lat, data.lon]].slice(-100);

        return {
          ...prev,
          [data.node_id]: {
            ...data,
            history: updatedHistory
          }
        };
      });
    };

    return () => ws.close();
  }, []);

  return (
    <MapContainer 
      center={[12.97, 77.59]} 
      zoom={13} 
      style={{ height: "100vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <AutoFitMap nodes={nodes} />

      {Object.entries(nodes).map(([id, node]) => (
        <React.Fragment key={id}>

          {/* TRAILS */}
          {node.history && (
            <Polyline
              positions={node.history}
              pathOptions={{ color: id === "NODE_A" ? "blue" : "red" }}
            />
          )}

          {/* MARKER */}
          <Marker
            position={[node.lat, node.lon]}
            icon={icons[id] || icons.NODE_A}
          >
            <Popup>
              <strong>{node.terminal_name}</strong><br/>
              Channel: {node.channel_name}<br/><br/>

              <b>Coordinates:</b><br/>
              Lat: {node.lat.toFixed(5)}<br/>
              Lon: {node.lon.toFixed(5)}
            </Popup>
          </Marker>

        </React.Fragment>
      ))}
    </MapContainer>
  );
}

export default App;
