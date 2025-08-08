import React, { useState, useMemo } from "react";
import { assignLanes } from "../utils/laneAssigner";
import timelineItems from "../timelineItems";
import TimelineItem from "./TimelineItem";
import "./Timeline.css";

const Timeline = () => {
  const [zoom, setZoom] = useState(1);
  const [draggedItem, setDraggedItem] = useState(null);

  const lanes = useMemo(() => {
    return assignLanes(timelineItems);
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

  const handleItemDrag = (itemId, newStart, newEnd) => {
    console.log("Item dragged:", itemId, newStart, newEnd);
  };

  return (
    <div className="timeline-container">
      <div className="timeline-controls">
        <button onClick={handleZoomOut} className="zoom-btn">-</button>
        <span className="zoom-level">{Math.round(zoom * 100)}%</span>
        <button onClick={handleZoomIn} className="zoom-btn">+</button>
      </div>
      
      <div className="timeline-view" style={{ transform: `scale(${zoom})` }}>
        <div className="timeline-header">
          <div className="date-range">
            <span>Jan 2021</span>
            <span>May 2021</span>
          </div>
        </div>
        
        <div className="lanes-container">
          {lanes.map((lane, laneIndex) => (
            <div key={laneIndex} className="timeline-lane">
              {lane.map((item) => (
                <TimelineItem
                  key={item.id}
                  item={item}
                  onDrag={handleItemDrag}
                  isDragging={draggedItem === item.id}
                  onDragStart={() => setDraggedItem(item.id)}
                  onDragEnd={() => setDraggedItem(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
