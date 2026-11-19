import { normalizeAppointment } from './appointments.js';
// Pure planning helpers shared by the interface and local checks.
export const PRIORITIES = { high: 'Prioritaire', normal: 'Normale', low: 'Souple' };
export function todayKey(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type).value).join('-');
}
export function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function shiftDay(day, offset) {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}
export function minutesOf(value) {
  if (typeof value !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) return null;
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}
export function timeOf(minutes) {
  return `${Math.floor(minutes / 60).toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`;
}
export function formatDuration(value) {
  const hours = Math.floor(value / 60), minutes = value % 60;
  return hours ? `${hours} h${minutes ? ` ${minutes.toString().padStart(2, '0')}` : ''}` : `${minutes} min`;
}
export const TASK_SECTIONS = { personal: 'Personnel', home: 'Maison', documents: 'Documents', payments: 'Paiements', shopping: 'Courses', calls: 'Appels' };
export function normalizeTask(task, fallbackDay = todayKey()) {
  if (!task || typeof task.id !== 'string' || typeof task.title !== 'string' || !task.title.trim()) return null;
  return {
    id: task.id, title: task.title.trim().slice(0, 160),
    date: validDate(task.date) ? task.date : fallbackDay,
    time: minutesOf(task.time) !== null ? task.time : '',
    duration: Number.isInteger(task.duration) && task.duration >= 5 && task.duration <= 480 ? task.duration : 30,
    priority: Object.hasOwn(PRIORITIES, task.priority) ? task.priority : 'normal',
    kind: task.kind === 'event' ? 'event' : task.kind === 'reminder' ? 'reminder' : 'task', done: task.done === true,
    description: typeof task.description === 'string' ? task.description.slice(0, 1000) : '',
    sourceBillId: typeof task.sourceBillId === 'string' ? task.sourceBillId.slice(0, 80) : '',
    section: Object.hasOwn(TASK_SECTIONS, task.section) ? task.section : '',
    started: task.started === true, cancelled: task.cancelled === true,
    ...(validDate(task.deadline) ? { deadline: task.deadline } : {}),
    ...(Array.isArray(task.dependsOn) ? { dependsOn: task.dependsOn.filter(id => typeof id === 'string') } : {}),
    ...(typeof task.sourceNoteId === 'string' && task.sourceNoteId ? { sourceNoteId: task.sourceNoteId } : {}),
    ...(typeof task.recurring === 'string' && task.recurring ? { recurring: task.recurring } : {}),
    ...(task.appointment ? { appointment: normalizeAppointment(task.appointment) } : {}),
    ...(typeof task.sourceAppointmentId === 'string' ? { sourceAppointmentId: task.sourceAppointmentId.slice(0, 80), appointmentAction: String(task.appointmentAction || '').slice(0, 40) } : {}),
  };
}
export function tasksForDay(tasks, day) {
  const rank = { high: 0, normal: 1, low: 2 };
  return tasks.filter(task => task.date === day && !task.cancelled).sort((a, b) =>
    (a.time || '99:99').localeCompare(b.time || '99:99') || rank[a.priority] - rank[b.priority] || a.title.localeCompare(b.title, 'fr'));
}
export function conflictsForDay(tasks, day) {
  const scheduled = tasksForDay(tasks, day).filter(task => task.time && !task.done);
  const conflicts = [];
  for (let i = 0; i < scheduled.length; i++) {
    const left = scheduled[i], start = minutesOf(left.time), end = start + left.duration;
    for (let j = i + 1; j < scheduled.length; j++) {
      const right = scheduled[j];
      if (minutesOf(right.time) >= end) break;
      conflicts.push({ left, right });
    }
  }
  return conflicts;
}
export function suggestDay(tasks, day, startTime = '08:30', endTime = '18:00') {
  const start = minutesOf(startTime), end = minutesOf(endTime);
  if (start === null || end === null || start >= end) throw new Error('La plage horaire est invalide.');
  const result = tasks.map(task => ({ ...task }));
  const fixed = result.filter(task => task.date === day && task.time).map(task => ({ start: minutesOf(task.time), end: minutesOf(task.time) + task.duration })).sort((a, b) => a.start - b.start);
  const rank = { high: 0, normal: 1, low: 2 };
  const pending = result.filter(task => task.date === day && !task.done && !task.time && task.kind !== 'event').sort((a, b) => rank[a.priority] - rank[b.priority] || a.id.localeCompare(b.id));
  const assignments = [], unplaced = [];
  for (const task of pending) {
    let candidate = start;
    for (const occupied of fixed) {
      if (candidate + task.duration <= occupied.start) break;
      if (candidate < occupied.end && candidate + task.duration > occupied.start) candidate = occupied.end;
    }
    if (candidate + task.duration > end) { unplaced.push(task.id); continue; }
    task.time = timeOf(candidate);
    fixed.push({ start: candidate, end: candidate + task.duration }); fixed.sort((a, b) => a.start - b.start);
    assignments.push({ id: task.id, time: task.time });
  }
  return { tasks: result, assignments, unplaced };
}
