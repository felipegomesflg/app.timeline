import React, { useState, useMemo } from "react";
import { assignLanes } from "../utils/laneAssigner";
import { buildMonthSegements, calculateTotalDays } from "../utils/dateUtils";
import timelineItems from "../timelineItems";
import TimelineItem from "./TimelineItem";
import "./Timeline.css";

const Timeline = () => {
  const [zoom, setZoom] = useState(1);
  const [draggedItem, setDraggedItem] = useState(null);

  const { lanes, rangeStart, rangeEnd } = useMemo(() => {
    const lanesAssigned = assignLanes(timelineItems);
    const minStart = new Date(
      Math.min(...timelineItems.map((i) => new Date(i.start).getTime()))
    );
    const maxEnd = new Date(
      Math.max(...timelineItems.map((i) => new Date(i.end).getTime()))
    );
    return { lanes: lanesAssigned, rangeStart: minStart, rangeEnd: maxEnd };
  }, []);

  const months = useMemo(() => buildMonthSegements(rangeStart, rangeEnd), [rangeStart, rangeEnd]);
  const totalDays = useMemo(() => calculateTotalDays(rangeStart, rangeEnd), [rangeStart, rangeEnd]);

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
          <div className="date-months">
            {months.map((m, idx) => (
              <div
                key={idx}
                className="month-cell"
                style={{ flex: m.days }}
              >
                {m.label}
              </div>
            ))}
          </div>
        </div>
        
        <div className="lanes-container">
          {lanes.map((lane, laneIndex) => (
            <div key={laneIndex} className="timeline-lane">
              {lane.map((item) => (
                <TimelineItem
                  key={item.id}
                  item={item}
                  rangeStart={rangeStart}
                  totalDays={totalDays}
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
