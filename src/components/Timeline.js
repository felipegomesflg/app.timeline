import React, { useState, useMemo, useEffect } from "react";
import { assignLanes } from "../utils/laneAssigner";
import { buildMonthSegements, buildDaySegements, calculateTotalDays, buildMonthsForYear } from "../utils/dateUtils";
import timelineItems from "../timelineItems";
import TimelineItem from "./TimelineItem";
import "./Timeline.css";

const Timeline = () => {
  const [zoom, setZoom] = useState(1); // number of months visible; values < 1 mean weekly view
  const [draggedItem, setDraggedItem] = useState(null);
  const [items, setItems] = useState(() => [...timelineItems]);
  const [viewMonthOffset, setViewMonthOffset] = useState(0);
  const [visibleMonths, setVisibleMonths] = useState(1);
  const [showDayGrid, setShowDayGrid] = useState(false);
  const [viewStartDate, setViewStartDate] = useState(null); // weekly anchor when zoom < 1

  // helpers
  const addDays = (date, days) => {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + days);
    return d;
  };
  const startOfWeekMon = (date) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = d.getDay(); // 0=Sun
    const diff = (day === 0 ? -6 : 1 - day);
    d.setDate(d.getDate() + diff);
    return d;
  };

  const { lanes, rangeStart, rangeEnd } = useMemo(() => {
    const lanesAssigned = assignLanes(items);
    const minStart = new Date(
      Math.min(...items.map((i) => new Date(i.start).getTime()))
    );
    const maxEnd = new Date(
      Math.max(...items.map((i) => new Date(i.end).getTime()))
    );
    return { lanes: lanesAssigned, rangeStart: minStart, rangeEnd: maxEnd };
  }, [items]);

  const monthsUniverse = useMemo(() => {
    const year = new Date().getFullYear();
    return buildMonthsForYear(year);
  }, []);
  const monthsAll = useMemo(() => {
    const byData = buildMonthSegements(rangeStart, rangeEnd);
    // union: all months of current year + months that contain data outside current year
    const merged = [...monthsUniverse];
    byData.forEach(m => {
      const exists = merged.some(x => x.start.getFullYear() === m.start.getFullYear() && x.start.getMonth() === m.start.getMonth());
      if (!exists) merged.push(m);
    });
    // sort chronologically
    return merged.sort((a,b) => a.start - b.start);
  }, [rangeStart, rangeEnd, monthsUniverse]);
  const months = useMemo(() => {
    if (monthsAll.length === 0) return [];
    const visible = Math.max(0.25, Math.min(12, zoom));
    const wholeMonths = Math.floor(visible);
    if (visible < 1) {
      const base = viewStartDate ?? startOfWeekMon(new Date());
      const idx = monthsAll.findIndex(m => base >= m.start && base <= m.end);
      const start = Math.max(0, idx);
      return monthsAll.slice(start, start + 1);
    }
    const start = Math.max(0, Math.min(Math.max(0, monthsAll.length - Math.max(1, wholeMonths)), viewMonthOffset));
    return monthsAll.slice(start, start + Math.max(1, wholeMonths));
  }, [monthsAll, viewMonthOffset, zoom, viewStartDate]);

  const totalDays = useMemo(() => {
    if (zoom >= 1) {
      return calculateTotalDays(months[0].start, months[months.length - 1].end);
    }
    const base = (viewStartDate ?? months[0].start);
    const end = addDays(base, 6);
    return calculateTotalDays(base, end);
  }, [months, zoom, viewStartDate]);

  const days = useMemo(() => {
    if (zoom >= 1) {
      return buildDaySegements(months[0].start, months[months.length - 1].end);
    }
    const base = (viewStartDate ?? months[0].start);
    const end = addDays(base, 6);
    return buildDaySegements(base, end);
  }, [months, zoom, viewStartDate]);

  // Ensure initial selection is the current month and week anchor
  useEffect(() => {
    if (!monthsAll || monthsAll.length === 0) return;
    const today = new Date();
    const idx = monthsAll.findIndex(m => today >= m.start && today <= m.end);
    if (idx >= 0) setViewMonthOffset(idx);
    setViewStartDate(startOfWeekMon(today));
  }, [monthsAll]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(0.25, prev - 0.25));
  const handlePrevMonths = () => {
    if (zoom < 1) {
      setViewStartDate(prev => {
        const base = prev ?? startOfWeekMon(new Date());
        const next = addDays(base, -7);
        const minDate = monthsAll[0].start;
        return next < minDate ? minDate : next;
      });
      return;
    }
    setViewMonthOffset(o => Math.max(0, o - 1));
  };
  const handleNextMonths = () => {
    if (zoom < 1) {
      setViewStartDate(prev => {
        const base = prev ?? startOfWeekMon(new Date());
        const next = addDays(base, 7);
        const maxDate = monthsAll[monthsAll.length - 1].end;
        return next > maxDate ? addDays(maxDate, -6) : next;
      });
      return;
    }
    setViewMonthOffset(o => Math.min(Math.max(0, monthsAll.length - 1), o + 1));
  };

  // updates a single item in state
  const handleItemUpdt = (itemId, nextFields) => {
    setItems(curr => curr.map(it => (it.id === itemId ? { ...it, ...nextFields } : it)));
  };

  const handleItemDrag = (itemId, newStart, newEnd) => {
    console.log("Item dragged:", itemId, newStart, newEnd);
  };

  return (
    <div className="timeline-container">
      <div className="timeline-controls">
        <button onClick={handleZoomOut} className="zoom-btn" disabled={zoom <= 0.25}>-</button>
        <span className="zoom-level">{zoom < 1 ? 'Week' : `${Math.floor(zoom)} mo`}</span>
        <button onClick={handleZoomIn} className="zoom-btn" disabled={zoom >= 3}>+</button>
        <label className="grid-toggle" style={{ marginLeft: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={showDayGrid} onChange={(e) => setShowDayGrid(e.target.checked)} />
          <span>Show day grid</span>
        </label>
      </div>
      
      <div className="timeline-view" style={{ overflow: 'hidden' }}>
        <div className="timeline-header">
          <div className="header-controls">
            <button className="nav-btn" onClick={handlePrevMonths}>{"<"}</button>
            <div className="date-months" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
              {(() => {
                const dayMs = 1000 * 60 * 60 * 24;
                const visibleStart = days[0]?.date || (months[0]?.start || new Date());
                return months.map((m, idx) => {
                  const diff = Math.floor((m.start - visibleStart) / dayMs);
                  const startIdx = Math.max(0, diff);
                  const span = Math.min(days.length - startIdx, m.days);
                  return (
                    <div
                      key={idx}
                      className="month-cell"
                      style={{ gridColumn: `${startIdx + 1} / span ${Math.max(1, span)}` }}
                    >
                      {m.label}
                    </div>
                  );
                });
              })()}
            </div>
            <button className="nav-btn" onClick={handleNextMonths}>{">"}</button>
          </div>
          <div className="date-days" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
            {days.map((d, i) => (
              <div key={i} className={`day-cell ${d.isToday ? 'today' : ''}`}>{d.label}</div>
            ))}
          </div>
        </div>
        
        <div className="lanes-container">
          {showDayGrid && (
            <div className="day-grid-overlay" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
              {days.map((_, i) => (
                <div key={i} className="day-grid-cell" />
              ))}
            </div>
          )}
          {(() => {
            // render solid month boundaries at day 1 of each visible month
            const dayMs = 1000 * 60 * 60 * 24;
            const visibleStart = days[0]?.date;
            if (!visibleStart) return null;
            const elements = [];
            months.forEach((m) => {
              const diff = Math.floor((m.start - visibleStart) / dayMs);
              if (diff >= 0 && diff <= days.length - 1) {
                const pct = (diff / (days.length - 1)) * 100;
                elements.push(<div key={`mb-${m.start.toISOString()}`} className="month-boundary" style={{ left: `${pct}%` }} />);
              }
            });
            return elements;
          })()}
          {(() => {
            const visibleStart = zoom >= 1 ? months[0].start : (viewStartDate ?? months[0].start);
            const visibleEnd = zoom >= 1 ? months[months.length - 1].end : addDays(visibleStart, 6);
            const today = new Date();
            if (today >= visibleStart && today <= visibleEnd) {
              const total = calculateTotalDays(visibleStart, visibleEnd);
              const pct = (today - visibleStart) / (1000*60*60*24) / total * 100;
              return <div className="today-marker" style={{ left: `${pct}%` }} />;
            }
            return null;
          })()}
          {lanes.map((lane, laneIndex) => (
            <div key={laneIndex} className="timeline-lane">
              {lane.map((item) => (
                <TimelineItem
                  key={item.id}
                  item={item}
                  rangeStart={zoom >= 1 ? months[0].start : (viewStartDate ?? months[0].start)}
                  totalDays={totalDays}
                  onItemChange={handleItemUpdt}
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
