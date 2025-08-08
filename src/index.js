import React from "react";
import ReactDOM from "react-dom/client";
import timelineItems from "./timelineItems.js";

function App() {
  return (
    <div>
      <h2>Timeline Project</h2>
      <p>Items to render: {timelineItems.length}</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);