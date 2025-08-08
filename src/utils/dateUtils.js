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

// Build month segments between two dates (inclusive by month)
export function buildMonthSegements(rangeStart, rangeEnd) {
  const start = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
  const end = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1);
  const months = [];
  let cursor = new Date(start);
  while (cursor <= end) {
    const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    months.push({
      start: monthStart,
      end: monthEnd,
      label: formatMonthLabelPt(monthStart),
      days: getMonthDays(monthStart),
    });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
  return months;
}

// Get number of days in a month
export function getMonthDays(date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  return new Date(y, m + 1, 0).getDate();
}

// Format month in Portuguese short label
export function formatMonthLabelPt(date) {
  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Calculate total days of the visible range
export function calculateTotalDays(rangeStart, rangeEnd) {
  return (rangeEnd - rangeStart) / (1000 * 60 * 60 * 24);
}
