import test from 'node:test';
import assert from 'node:assert/strict';
import { weekDays, monthDays, shiftMonth, eventLanes } from '../public/calendar.js';

test('week starts on Monday even when the selected date is a Sunday', () => {
  assert.deepEqual(weekDays('2026-11-15'), ['2026-11-09','2026-11-10','2026-11-11','2026-11-12','2026-11-13','2026-11-14','2026-11-15']);
});
test('month grid covers complete weeks including dates in adjacent months', () => {
  const days = monthDays('2026-11-12');
  assert.equal(days.length, 42); assert.equal(days[0], '2026-10-26'); assert.equal(days.at(-1), '2026-12-06');
  assert.equal(new Set(days).size, 42);
});
test('month navigation clamps day 31 safely, including leap years and year changes', () => {
  assert.equal(shiftMonth('2026-01-31', 1), '2026-02-28');
  assert.equal(shiftMonth('2028-01-31', 1), '2028-02-29');
  assert.equal(shiftMonth('2026-12-31', 1), '2027-01-31');
});
test('overlapping events have separate lanes; adjacent events can use all the width', () => {
  const tasks = [ {id:'a',time:'09:00',duration:60}, {id:'b',time:'09:30',duration:60}, {id:'c',time:'10:30',duration:30} ];
  const layout = eventLanes(tasks);
  assert.deepEqual(layout.map(({task,lane,lanes})=>[task.id,lane,lanes]), [['a',0,2],['b',1,2],['c',0,1]]);
});
test('connected overlap groups share a consistent width without changing the data', () => {
  const tasks = [ {id:'a',time:'09:00',duration:60}, {id:'b',time:'09:30',duration:120}, {id:'c',time:'10:30',duration:30} ];
  const snapshot = structuredClone(tasks), layout = eventLanes(tasks);
  assert.equal(layout[2].lanes, 2); assert.equal(layout[2].lane, 0); assert.deepEqual(tasks,snapshot);
});
test('unscheduled items do not produce calendar tiles and late events stop at midnight', () => {
  const layout = eventLanes([{id:'open',time:'',duration:30},{id:'late',time:'23:30',duration:60}]);
  assert.equal(layout.length,1); assert.equal(layout[0].end,1440);
});
