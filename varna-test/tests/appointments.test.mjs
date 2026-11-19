import test from 'node:test';
import assert from 'node:assert/strict';
import { APPOINTMENT_CATEGORIES, validateAppointment, appointmentProposals, applyAppointmentProposals } from '../public/appointments.js';
import { normalizeTask } from '../public/planning.js';
const draft = (options = {}) => ({ id: 'appointment-1', title: 'Dentiste — Léa', date: '2026-11-20', time: '09:00', duration: 45, kind: 'event', appointment: { category: 'medical', type: 'Dentiste', person: 'child', personName: 'Léa', provider: 'Dr Test', place: 'Clinique', address: '123 rue Exemple', reason: 'Consultation', options, confirmed: {}, documents: [] } });

test('six categories expose relevant consultation types and preserve appointment data after reload', () => {
  assert.equal(Object.keys(APPOINTMENT_CATEGORIES).length, 6);
  const raw = draft({ travel: { enabled: true, origin: 'Maison', minutes: 30, mode: 'Voiture' } });
  raw.appointment.documents = [{ id: 'file-1', name: 'Ordonnance.pdf', type: 'application/pdf' }];
  const saved = normalizeTask(JSON.parse(JSON.stringify(normalizeTask(raw))));
  assert.equal(saved.appointment.personName, 'Léa');
  assert.equal(saved.appointment.options.travel.origin, 'Maison');
  assert.equal(saved.appointment.documents[0].name, 'Ordonnance.pdf');
  assert.equal(validateAppointment(saved), '');
});
test('enabled options do not execute without explicit confirmation', () => {
  const event = draft({ followup: { enabled: true, date: '2026-12-20' }, preparation: { enabled: true, date: '2026-11-19', text: 'Préparer les questions' }, travel: { enabled: true, origin: 'Maison', minutes: 30, mode: 'Voiture' }, expense: { enabled: true, amount: 75 } });
  assert.equal(appointmentProposals(event).length, 4);
  assert.equal(applyAppointmentProposals([], event).length, 1);
  const selected = applyAppointmentProposals([], event, ['preparation']);
  assert.equal(selected.length, 2);
  assert.equal(selected[1].appointmentAction, 'preparation');
  assert.equal(selected[0].appointment.confirmed.expense, undefined);
});
test('confirmed associated tasks are idempotent and survive normalization', () => {
  const event = draft({ followup: { enabled: true, date: '2026-12-20' }, travel: { enabled: true, origin: 'Maison', minutes: 30, mode: 'Voiture' } });
  const first = applyAppointmentProposals([], event, ['followup', 'travel']);
  const second = applyAppointmentProposals(first, event, ['followup', 'travel']);
  assert.equal(second.length, 3);
  assert.equal(normalizeTask(second[1]).sourceAppointmentId, event.id);
  assert.equal(second.find(t => t.appointmentAction === 'travel').time, '08:30');
  assert.equal(second.find(t => t.appointmentAction === 'followup').kind, 'reminder');
});
test('travel before midnight uses the previous date', () => {
  const event = draft({ travel: { enabled: true, origin: 'Maison', minutes: 45, mode: 'Voiture' } }); event.time = '00:15';
  const departure = appointmentProposals(event)[0].task;
  assert.equal(departure.date, '2026-11-19'); assert.equal(departure.time, '23:30');
});
test('invalid dates, backward end time, missing preparation and invalid costs are rejected', () => {
  for (const change of [e => e.date = '2026-02-30', e => e.time = '', e => e.duration = -10, e => { e.time = '23:50'; e.duration = 30; }, e => e.appointment.options.followup = { enabled: true, date: '2026-11-19' }, e => e.appointment.options.preparation = { enabled: true, date: '2026-11-19', text: '' }, e => e.appointment.options.expense = { enabled: true, amount: -1 }]) {
    const event = draft(); change(event); assert.notEqual(validateAppointment(event), '');
    assert.throws(() => applyAppointmentProposals([], event));
  }
});
test('documents require a selected option and files; approved expense snapshot survives reload', () => {
  const event = draft({ documents: { enabled: false }, expense: { enabled: true, amount: 90 } });
  event.appointment.documents = [{ id: 'file', name: 'note.pdf' }];
  assert.deepEqual(appointmentProposals(event).map(p => p.key), ['expense']);
  event.appointment.options.documents.enabled = true;
  assert.deepEqual(appointmentProposals(event).map(p => p.key), ['documents', 'expense']);
  event.appointment.expenseEntry = { amount: 75, date: event.date, title: event.title };
  const saved = normalizeTask(JSON.parse(JSON.stringify(event)));
  assert.equal(saved.appointment.expenseEntry.amount, 75);
  assert.equal(saved.appointment.options.expense.amount, 90);
});
