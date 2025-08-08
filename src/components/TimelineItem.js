import React, { useState, useRef, useEffect } from "react";
import { calculatePosition, calculateWidth } from "../utils/dateUtils";
import "./TimelineItem.css";

const TimelineItem = ({ item, rangeStart, totalDays, onItemChange, onDrag, isDragging, onDragStart, onDragEnd }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [editStart, setEditStart] = useState(item.start);
  const [editEnd, setEditEnd] = useState(item.end);
  const itemRef = useRef(null);
  const nameInputRef = useRef(null);
  const dateEditRef = useRef(null);
  const measurerRef = useRef(null);
  const [minWidthPx, setMinWidthPx] = useState(60);
  const DATE_EDIT_MIN_WIDTH_PX = 420;
  const draggingState = useRef({ active: false, startX: 0, laneWidth: 0, origStart: null, origEnd: null });

  // simple helpers
  const addDays = (date, days) => {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + days);
    return d;
  };
  const fmt = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const left = calculatePosition(item.start, rangeStart, totalDays);
  const width = calculateWidth(item.start, item.end, totalDays);

  const handleNameEdit = () => {
    if (editName.trim()) {
      onItemChange?.(item.id, { name: editName });
      setIsEditing(false);
    }
  };

  const isValidDate = (d) => d instanceof Date && !Number.isNaN(d.getTime());

  const handleDatesSave = () => {
    const s = new Date(editStart);
    const e = new Date(editEnd);
    if (!isValidDate(s) || !isValidDate(e)) {
      alert("Data inválida. Use um formato válido (YYYY-MM-DD).");
      return;
    }
    if (e < s) {
      alert("Intervalo inválido: a data inicial deve ser anterior ou igual à final.");
      return;
    }
    onItemChange?.(item.id, { start: editStart, end: editEnd });
    setIsEditingDates(false);
  };

  const handleDateKey = (e) => {
    if (e.key === "Enter") handleDatesSave();
    if (e.key === "Escape") {
      setEditStart(item.start);
      setEditEnd(item.end);
      setIsEditingDates(false);
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
    if (!e.target.closest('.item-content')) return;
    if (isEditing || isEditingDates) return;
    onDragStart?.();

    const laneEl = itemRef.current?.parentElement;
    const rectW = laneEl ? laneEl.getBoundingClientRect().width : 0;
    draggingState.current = {
      active: true,
      startX: e.clientX,
      laneWidth: rectW,
      origStart: new Date(item.start),
      origEnd: new Date(item.end),
    };

    const onMove = (ev) => {
      if (!draggingState.current.active || !draggingState.current.laneWidth) return;
      const dx = ev.clientX - draggingState.current.startX;
      const days = Math.round((dx / draggingState.current.laneWidth) * totalDays);
      if (days === 0) return;
      const ns = addDays(draggingState.current.origStart, days);
      const ne = addDays(draggingState.current.origEnd, days);
      onItemChange?.(item.id, { start: fmt(ns), end: fmt(ne) });
    };

    const onUp = () => {
      draggingState.current.active = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      onDragEnd?.();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp, { once: true });
  };

  useEffect(() => {
    // ensures min width for edit states
    if (isEditing && measurerRef.current) {
      measurerRef.current.textContent = editName || " ";
      const w = measurerRef.current.scrollWidth;
      setMinWidthPx(Math.max(60, w + 16));
      return;
    }
    if (isEditingDates && dateEditRef.current) {
      const w = dateEditRef.current.scrollWidth;
      setMinWidthPx(Math.max(DATE_EDIT_MIN_WIDTH_PX, w + 12));
      return;
    }
    setMinWidthPx(60);
  }, [isEditing, editName, isEditingDates, editStart, editEnd]);

  return (
    <div
      ref={itemRef}
      className={`timeline-item ${isDragging ? 'dragging' : ''} ${(isEditing || isEditingDates) ? 'editing' : ''}`}
      style={{
        left: `${left}%`,
        width: `${width}%`,
        minWidth: `${minWidthPx}px`
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="item-content">
        <span ref={measurerRef} className="measure-span" />
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameEdit}
            onKeyDown={handleKeyPress}
            autoFocus
            className="edit-input"
            ref={nameInputRef}
          />
        ) : (
          <div 
            className="item-name"
            title={item.name}
            onDoubleClick={() => setIsEditing(true)}
          >
            {item.name}
          </div>
        )}
        {isEditingDates ? (
          <div className="item-dates edit" ref={dateEditRef}>
            <input
              type="date"
              value={editStart}
              onChange={(e) => setEditStart(e.target.value)}
              onKeyDown={handleDateKey}
              className="date-input"
            />
            <span className="date-sep">–</span>
            <input
              type="date"
              value={editEnd}
              onChange={(e) => setEditEnd(e.target.value)}
              onKeyDown={handleDateKey}
              className="date-input"
            />
            <button className="date-apply" onClick={handleDatesSave}>Apply</button>
          </div>
        ) : (
          <div className="item-dates" title={`${item.start} - ${item.end}`} onDoubleClick={() => setIsEditingDates(true)}>
            {item.start} - {item.end}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;
