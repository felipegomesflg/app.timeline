import React from "react";
import ReactDOM from "react-dom/client";
import Timeline from "./components/Timeline";
import "./app.css";

function App() {
  return (
    <div className="app">
      <h1>Airtable timeline</h1>
      <Timeline />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);