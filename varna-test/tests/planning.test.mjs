import test from 'node:test';
import assert from 'node:assert/strict';
import { todayKey, validDate, shiftDay, normalizeTask, tasksForDay, conflictsForDay, suggestDay } from '../public/planning.js';
const day = '2026-11-12';
const task = (id, overrides = {}) => normalizeTask({ id, title: id, date: day, duration: 30, ...overrides }, day);

test('Toronto date uses the client day across UTC midnight and calendar boundaries', () => {
  assert.equal(todayKey(new Date('2026-11-13T02:00:00Z')), '2026-11-12');
  assert.equal(shiftDay('2026-12-31', 1), '2027-01-01');
  assert.equal(shiftDay('2028-03-01', -1), '2028-02-29');
  assert.equal(validDate('2026-02-30'), false);
});
test('old saved tasks migrate without losing their title or completion status', () => {
  const old = normalizeTask({ id: 'old', title: 'Conserver cette tâche', time: '09:30', done: true }, day);
  assert.equal(old.title, 'Conserver cette tâche'); assert.equal(old.done, true);
  assert.equal(old.date, day); assert.equal(old.duration, 30); assert.equal(old.priority, 'normal');
  assert.equal(normalizeTask({ id: 'x', title: ' ' }, day), null);
});
test('daily list filters other days and orders timed items before priorities to place', () => {
  const items = [task('later', { time: '13:00' }), task('tomorrow', { date: '2026-11-13' }), task('low', { priority: 'low' }), task('high', { priority: 'high' }), task('early', { time: '09:00' })];
  assert.deepEqual(tasksForDay(items, day).map(item => item.id), ['early', 'later', 'high', 'low']);
});
test('adjacent slots are allowed; overlaps are reported; completed items do not warn', () => {
  const items = [task('a', { time: '09:00', duration: 60 }), task('b', { time: '10:00' }), task('c', { time: '09:45' }), task('done', { time: '09:00', done: true })];
  assert.deepEqual(conflictsForDay(items, day).map(pair => [pair.left.id, pair.right.id]), [['a', 'c'], ['c', 'b']]);
});
test('suggestions preserve fixed appointments, prioritize urgent tasks and never mutate input', () => {
  const items = [task('normal', { duration: 45 }), task('urgent', { priority: 'high', duration: 30 }), task('appointment', { kind: 'event', time: '09:00', duration: 60 }), task('done', { done: true }), task('tomorrow', { date: '2026-11-13' })];
  const before = structuredClone(items);
  const proposal = suggestDay(items, day, '08:30', '12:00');
  assert.deepEqual(proposal.assignments, [{ id: 'urgent', time: '08:30' }, { id: 'normal', time: '10:00' }]);
  assert.equal(proposal.tasks.find(item => item.id === 'appointment').time, '09:00');
  assert.deepEqual(items, before); assert.equal(conflictsForDay(proposal.tasks, day).length, 0);
});
test('a full day leaves tasks unplaced and does not move them into tomorrow', () => {
  const items = [task('meeting', { time: '08:30', duration: 60 }), task('big', { duration: 90 }), task('short', { duration: 15 })];
  const proposal = suggestDay(items, day, '08:30', '10:00');
  assert.deepEqual(proposal.unplaced, ['big']);
  assert.deepEqual(proposal.assignments, [{ id: 'short', time: '09:30' }]);
  assert.equal(proposal.tasks.find(item => item.id === 'big').time, '');
  assert.throws(() => suggestDay(items, day, '18:00', '08:30'), /invalide/);
});
test('overlapping fixed blocks remain fixed while new tasks use a truly free slot', () => {
  const items = [task('a', { time: '09:00', duration: 120 }), task('b', { time: '10:00', duration: 120 }), task('new', { duration: 60 })];
  const proposal = suggestDay(items, day, '09:00', '14:00');
  assert.equal(proposal.assignments[0].time, '12:00');
  assert.equal(conflictsForDay(proposal.tasks, day).length, 1);
});

test('chosen task section survives storage and editing without guessing from the title', () => {
  const original = task('section', { title: 'Appeler la banque', section: 'documents' });
  const restored = normalizeTask(JSON.parse(JSON.stringify(original)), day);
  assert.equal(restored.section, 'documents');
  assert.equal(normalizeTask({ ...restored, title: 'Préparer mon dossier' }, day).section, 'documents');
  assert.equal(task('legacy', { title: 'Appeler la banque' }).section, '');
  assert.equal(task('invalid', { section: 'unknown' }).section, '');
});
