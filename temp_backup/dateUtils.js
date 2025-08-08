// Calculate position of item on timeline
export function calculatePosition(itemStart, timelineStart, totalDays) {
  const itemStartDate = new Date(itemStart);
  const daysFromStart = (itemStartDate - timelineStart) / (1000 * 60 * 60 * 24);
  return (daysFromStart / totalDays) * 100;
}

// Calculate width of item based on duration
export function calculateWidth(startDate, endDate, totalDays) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = (end - start) / (1000 * 60 * 60 * 24);
  return (duration / totalDays) * 100;
}
