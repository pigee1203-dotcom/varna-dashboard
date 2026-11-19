import { shiftDay, minutesOf } from './planning.js';

export function weekDays(day) {
  const weekday = new Date(`${day}T12:00:00Z`).getUTCDay();
  const monday = shiftDay(day, -(weekday === 0 ? 6 : weekday - 1));
  return Array.from({ length: 7 }, (_, index) => shiftDay(monday, index));
}
export function monthDays(day) {
  const first = `${day.slice(0, 7)}-01`;
  const start = weekDays(first)[0];
  return Array.from({ length: 42 }, (_, index) => shiftDay(start, index));
}
export function shiftMonth(day, offset) {
  const date = new Date(`${day.slice(0, 7)}-01T12:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + offset);
  const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 12)).getUTCDate();
  date.setUTCDate(Math.min(Number(day.slice(8, 10)), last));
  return date.toISOString().slice(0, 10);
}
// Keep overlapping events side by side instead of hiding them behind each other.
export function eventLanes(tasks) {
  const sorted = tasks.filter(task => minutesOf(task.time) !== null).map(task => ({ task, start: minutesOf(task.time), end: Math.min(1440, minutesOf(task.time) + task.duration) })).sort((a, b) => a.start - b.start || a.end - b.end || a.task.id.localeCompare(b.task.id));
  const result = [];
  let group = [], ends = [], groupEnd = -1;
  const flush = () => { group.forEach(event => result.push({ ...event, lanes: ends.length })); group = []; ends = []; groupEnd = -1; };
  for (const event of sorted) {
    if (group.length && event.start >= groupEnd) flush();
    let lane = ends.findIndex(end => end <= event.start);
    if (lane < 0) lane = ends.length;
    ends[lane] = event.end;
    group.push({ ...event, lane }); groupEnd = Math.max(groupEnd, event.end);
  }
  flush();
  return result;
}
