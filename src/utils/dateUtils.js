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

// Build all 12 months for a given year
export function buildMonthsForYear(year) {
  const months = [];
  for (let m = 0; m < 12; m++) {
    const start = new Date(year, m, 1);
    const end = new Date(year, m + 1, 0);
    months.push({
      start,
      end,
      label: formatMonthLabelPt(start),
      days: getMonthDays(start),
    });
  }
  return months;
}

// Build day segments between two dates
export function buildDaySegements(rangeStart, rangeEnd) {
  const days = [];
  const start = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate());
  const end = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate());
  const today = new Date();
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let cur = new Date(start);
  while (cur <= end) {
    days.push({
      date: new Date(cur),
      label: String(cur.getDate()).padStart(2, '0'),
      isToday: cur.getTime() === t.getTime(),
    });
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

// Find month index for a given date
export function findMonthIndex(months, date) {
  const ym = `${date.getFullYear()}-${date.getMonth()}`;
  return months.findIndex(m => `${m.start.getFullYear()}-${m.start.getMonth()}` === ym);
}

// Return Monday of the week for a date
function startOfWeekMonday(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  return d;
}

// Build week segments (Mon..Sun) between range
export function buildWeekSegments(rangeStart, rangeEnd) {
  const weeks = [];
  const start = startOfWeekMonday(rangeStart);
  const end = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate());
  let cur = new Date(start);
  while (cur <= end) {
    const weekStart = new Date(cur);
    const weekEnd = new Date(cur);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weeks.push({ start: weekStart, end: weekEnd });
    cur.setDate(cur.getDate() + 7);
  }
  return weeks;
}
