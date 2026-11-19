import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_BILLS, billDate, dueLabel, billReminder, linkedReminder, parseCommand } from '../public/connections.js';
import { normalizeTask } from '../public/planning.js';
const day = '2026-11-12';

test('bills have stable due dates and correct overdue labels', () => {
  assert.equal(billDate(DEMO_BILLS[0], day), '2026-11-15');
  assert.equal(dueLabel('2026-11-15', day), 'Dans 3 jours');
  assert.equal(dueLabel(day, day), 'Aujourd’hui');
  assert.equal(dueLabel('2026-11-11', day), 'En retard de 1 jour');
});
test('a reminder keeps its bill identity through editing, completion and normalization', () => {
  const reminder = normalizeTask({ ...billReminder(DEMO_BILLS[0], day), id: 'reminder' }, day);
  assert.equal(reminder.sourceBillId, 'hydro'); assert.equal(reminder.date, '2026-11-15');
  assert.equal(linkedReminder([reminder], 'hydro'), reminder);
  const edited = normalizeTask({ ...reminder, title: 'Appeler le service client', done: true }, day);
  assert.equal(linkedReminder([edited], 'hydro'), edited);
  assert.equal(linkedReminder([edited], 'assurance'), null);
});
test('French task commands prepare date, time, duration and priority without creating data', () => {
  const command = parseCommand('Jarvie, ajoute une tâche Appeler le dentiste demain à 14 h pendant 30 minutes prioritaire', day);
  assert.deepEqual(command, { kind: 'task', draft: { title: 'Appeler le dentiste', date: '2026-11-13', time: '14:00', duration: 30, priority: 'high', kind: 'task' } });
  assert.equal(parseCommand('crée un rendez-vous Dentiste le 2026-12-01 à 09:15 pendant 1 heure', day).draft.duration, 60);
});
test('relative dates use today while unspecified dates respect the selected agenda day', () => {
  assert.equal(parseCommand('ajoute une tâche Lire mes documents', day, '2026-11-18').draft.date, '2026-11-18');
  assert.equal(parseCommand('ajoute une tâche Lire mes documents demain', day, '2026-11-18').draft.date, '2026-11-13');
});
test('note text remains verbatim, including time and date words', () => {
  assert.deepEqual(parseCommand('note : Appeler demain à 14 h', day), { kind: 'note', text: 'Appeler demain à 14 h' });
  assert.deepEqual(parseCommand('ajoute une note Préparer mes documents', day), { kind: 'note', text: 'Préparer mes documents' });
});
test('invalid dates, hours and durations produce an error instead of silently changing intent', () => {
  for (const text of ['ajoute une tâche Dentiste le 2026-02-30', 'ajoute une tâche Dentiste à 25 h', 'ajoute une tâche Dentiste à 14:75', 'ajoute une tâche Dentiste pendant 7 minutes']) {
    assert.equal(parseCommand(text, day).kind, 'error', text);
  }
});
test('navigation is explicit; unsupported payment and deletion requests do not execute', () => {
  assert.equal(parseCommand('montre-moi mes factures', day).kind, 'bills');
  assert.equal(parseCommand('organise ma journée', day).kind, 'plan');
  assert.equal(parseCommand('mon agenda', day).kind, 'plan');
  assert.equal(parseCommand('Bonjour !', day).kind, 'greeting');
  assert.equal(parseCommand('paye mes factures', day).kind, 'unknown');
  assert.equal(parseCommand('supprime toutes mes tâches', day).kind, 'unknown');
});
