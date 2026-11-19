import { validDate, minutesOf, shiftDay, normalizeTask } from './planning.js';

export const APPOINTMENT_CATEGORIES = {
  medical: { label: 'Médical', icon: 'plus', types: ['Médecin', 'Dentiste', 'Spécialiste', 'Examen médical', 'Autre'], person: true, provider: 'Nom du professionnel', place: 'Clinique ou établissement', reason: 'Motif de la consultation' },
  professional: { label: 'Professionnel', icon: 'wallet', types: ['Réunion', 'Entrevue', 'Rencontre de travail', 'Autre'], provider: 'Interlocuteur ou organisateur', place: 'Entreprise ou lieu', reason: 'Objectif de la rencontre' },
  family: { label: 'Familial', icon: 'person', types: ['École', 'Enfants', 'Proche', 'Rencontre familiale', 'Autre'], person: true, provider: 'Personne à rencontrer', place: 'École ou lieu de rencontre', reason: 'Objet de la rencontre' },
  car: { label: 'Automobile', icon: 'tools', types: ['Entretien', 'Réparation', 'Inspection', 'Garage', 'Autre'], provider: 'Garage ou professionnel', place: 'Établissement', reason: 'Travaux ou vérifications à prévoir', extra: ['vehicle', 'Véhicule (modèle ou immatriculation)'] },
  personal: { label: 'Personnel', icon: 'spark', types: ['Coiffure', 'Esthétique', 'Service personnel', 'Autre'], provider: 'Nom du professionnel', place: 'Salon ou établissement', reason: 'Service souhaité' },
  other: { label: 'Autre', icon: 'calendar', types: ['Événement', 'Rendez-vous personnalisé', 'Autre'], provider: 'Contact (facultatif)', place: 'Lieu ou établissement', reason: 'Détails de l’événement' },
};
export function normalizeAppointment(value) {
  if (!value || !Object.hasOwn(APPOINTMENT_CATEGORIES, value.category)) return null;
  const result = { category: value.category };
  for (const key of ['type', 'person', 'personName', 'provider', 'place', 'address', 'phone', 'reason', 'vehicle', 'meetingUrl', 'customType']) result[key] = typeof value[key] === 'string' ? value[key].slice(0, key === 'reason' ? 2000 : 200) : '';
  result.options = value.options && typeof value.options === 'object' ? JSON.parse(JSON.stringify(value.options)) : {};
  result.confirmed = value.confirmed && typeof value.confirmed === 'object' ? { ...value.confirmed } : {};
  result.expenseEntry = value.expenseEntry && Number.isFinite(value.expenseEntry.amount) && value.expenseEntry.amount > 0 ? { amount: value.expenseEntry.amount, date: validDate(value.expenseEntry.date) ? value.expenseEntry.date : '', title: String(value.expenseEntry.title || '').slice(0, 160) } : null;
  result.documents = Array.isArray(value.documents) ? value.documents.filter(d => typeof d?.id === 'string' && typeof d?.name === 'string').map(d => ({ id: d.id, name: d.name.slice(0, 200), type: String(d.type || '') })) : [];
  return result;
}
export function validateAppointment(event) {
  const a = event.appointment, start = minutesOf(event.time);
  if (!a || !Object.hasOwn(APPOINTMENT_CATEGORIES, a.category)) return 'Choisissez une catégorie.';
  if (!event.title?.trim()) return 'Donnez un titre à votre rendez-vous.';
  if (!validDate(event.date) || start === null) return 'Précisez une date et une heure valides.';
  if (!Number.isInteger(event.duration) || event.duration < 5 || event.duration > 480 || start + event.duration > 1440) return 'La durée doit être de 5 à 480 minutes et se terminer avant minuit.';
  const o = a.options || {};
  if (o.followup?.enabled && (!validDate(o.followup.date) || o.followup.date < event.date)) return 'Le rappel de suivi doit être à la date du rendez-vous ou après.';
  if (o.preparation?.enabled && (!validDate(o.preparation.date) || o.preparation.date > event.date || !o.preparation.text?.trim())) return 'Précisez la préparation et sa date, au plus tard le jour du rendez-vous.';
  if (o.travel?.enabled && (!Number.isInteger(o.travel.minutes) || o.travel.minutes < 5 || o.travel.minutes > 480 || !o.travel.origin?.trim())) return 'Précisez le point de départ et un trajet de 5 à 480 minutes.';
  if (o.expense?.enabled && (!Number.isFinite(o.expense.amount) || o.expense.amount <= 0 || o.expense.amount > 1000000)) return 'Indiquez une dépense estimée entre 0,01 $ et 1 000 000 $.';
  return '';
}
export function appointmentProposals(event) {
  const o = event.appointment.options, proposals = [];
  if (o.followup?.enabled) proposals.push({ key: 'followup', label: `Rappel de prise de rendez-vous de suivi — ${o.followup.date}`, task: { title: `Prendre un rendez-vous de suivi — ${event.title}`, date: o.followup.date, time: '', duration: 15, kind: 'reminder', description: o.followup.text || '' } });
  if (o.preparation?.enabled) proposals.push({ key: 'preparation', label: `Préparation — ${o.preparation.date} : ${o.preparation.text}`, task: { title: `Préparer — ${event.title}`, date: o.preparation.date, time: '', duration: 15, kind: 'task', description: o.preparation.text } });
  if (o.travel?.enabled) {
    const departure = minutesOf(event.time) - o.travel.minutes;
    const minute = (departure + 1440) % 1440;
    const time = `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
    const date = departure < 0 ? shiftDay(event.date, -1) : event.date;
    proposals.push({ key: 'travel', label: `Déplacement — départ le ${date} à ${time} (${o.travel.minutes} min)`, task: { title: `Déplacement — ${event.title}`, date, time, duration: o.travel.minutes, kind: 'task', description: `Départ : ${o.travel.origin}. Destination : ${event.appointment.address || event.appointment.place || 'À préciser'}. Mode : ${o.travel.mode}. Durée estimée par vous.` } });
  }
  if (o.documents?.enabled && event.appointment.documents.length) proposals.push({ key: 'documents', label: `Ajouter ${event.appointment.documents.length} document(s) dans Documents` });
  if (o.expense?.enabled) proposals.push({ key: 'expense', label: `Ajouter une dépense estimée de ${o.expense.amount.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} dans Finances et paiements` });
  return proposals;
}

function openDocumentDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('varna-test.appointment-documents', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('files');
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  });
}
export async function saveAppointmentFiles(entries) {
  if (!entries.length) return;
  const db = await openDocumentDB();
  try { await new Promise((resolve, reject) => {
    const tx = db.transaction('files', 'readwrite');
    entries.forEach(({ id, file }) => tx.objectStore('files').put(file, id));
    tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
  }); } finally { db.close(); }
}
export async function readAppointmentFile(id) {
  const db = await openDocumentDB();
  try { return await new Promise((resolve, reject) => {
    const request = db.transaction('files').objectStore('files').get(id);
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  }); } finally { db.close(); }
}

// Only explicitly confirmed proposals create associated items; stable IDs avoid duplicates on edits.
export function applyAppointmentProposals(tasks, candidate, selectedKeys = []) {
  const invalid = validateAppointment(candidate);
  if (invalid) throw new Error(invalid);
  const event = normalizeTask(candidate);
  const proposals = appointmentProposals(event).filter(p => selectedKeys.includes(p.key));
  let next = tasks.filter(task => task.id !== event.id);
  next.push(event);
  for (const proposal of proposals) {
    if (!proposal.task) continue;
    const id = `${event.id}:${proposal.key}`;
    next = next.filter(task => task.id !== id);
    next.push(normalizeTask({ ...proposal.task, id, priority: 'normal', sourceAppointmentId: event.id, appointmentAction: proposal.key }));
  }
  return next;
}
