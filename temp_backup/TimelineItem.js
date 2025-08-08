import React, { useState, useRef } from "react";
import { calculatePosition, calculateWidth } from "../utils/dateUtils";
import "./TimelineItem.css";

const TimelineItem = ({ item, onDrag, isDragging, onDragStart, onDragEnd }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const itemRef = useRef(null);

  const startDate = new Date("2021-01-01");
  const endDate = new Date("2021-05-31");
  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
  
  const left = calculatePosition(item.start, startDate, totalDays);
  const width = calculateWidth(item.start, item.end, totalDays);

  const handleNameEdit = () => {
    if (editName.trim()) {
      item.name = editName;
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleNameEdit();
    } else if (e.key === "Escape") {
      setEditName(item.name);
      setIsEditing(false);
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.item-content')) {
      onDragStart();
    }
  };

  return (
    <div
      ref={itemRef}
      className={`timeline-item ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${left}%`,
        width: `${width}%`,
        minWidth: '60px'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="item-content">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameEdit}
            onKeyDown={handleKeyPress}
            autoFocus
            className="edit-input"
          />
        ) : (
          <div 
            className="item-name"
            onDoubleClick={() => setIsEditing(true)}
          >
            {item.name}
          </div>
        )}
        <div className="item-dates">
          {item.start} - {item.end}
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
