import { todayKey, shiftDay, validDate } from './planning.js';

export const DEMO_BILLS = [
  { id: 'hydro', title: 'Hydro-Québec', amount: 87.65, days: 3 },
  { id: 'assurance', title: 'Assurance auto', amount: 148, days: 5 },
  { id: 'credit', title: 'Carte de crédit', amount: 420, days: 12 },
  { id: 'internet', title: 'Internet / Vidéotron', amount: 59.95, days: 18 },
];
export function billDate(bill, baseDay) { return shiftDay(baseDay, bill.days); }
export function dueLabel(date, now = todayKey()) {
  const days = Math.round((Date.parse(`${date}T12:00:00Z`) - Date.parse(`${now}T12:00:00Z`)) / 86400000);
  return days === 0 ? 'Aujourd’hui' : days === 1 ? 'Demain' : days > 1 ? `Dans ${days} jours` : `En retard de ${-days} jour${days < -1 ? 's' : ''}`;
}
export function billReminder(bill, baseDay) {
  return { title: `Préparer le paiement — ${bill.title}`, date: billDate(bill, baseDay), duration: 15, priority: 'high', kind: 'task', sourceBillId: bill.id, description: `Vérifier la facture de démonstration de ${bill.amount.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} et préparer son paiement. Aucun paiement n’est effectué dans le laboratoire.` };
}
export function linkedReminder(tasks, billId) { return tasks.find(task => task.sourceBillId === billId) || null; }
const normalized = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

// Explicit local commands; no AI inference or automatic creation/payment.
export function parseCommand(text, referenceDay = todayKey(), defaultDay = referenceDay) {
  const clean = text.trim().replace(/^(?:jarvie|javie)[,\s]+/iu, '').replace(/\s+s[’']il (?:te|vous) pla[iî]t[.!?]*$/iu, '').trim();
  const command = normalized(clean).replace(/[.!?]+$/u, '').trim();
  const creation = clean.match(/^(?:ajoute(?:r)?|crée(?:r)?|cree(?:r)?)(?:-moi)?\s+(?:une?|la|le)\s+(tâche|tache|rendez-vous|rdv|note)\s*[:—-]?\s*(.*)$/iu);
  const directNote = clean.match(/^note\s*:\s*(.+)$/iu);
  if (directNote) return { kind: 'note', text: directNote[1].trim() };
  if (creation) {
    const type = normalized(creation[1]);
    let title = creation[2].trim();
    if (type === 'note') return { kind: 'note', text: title };
    const draft = { title: '', date: defaultDay, time: '', duration: 30, priority: 'normal', kind: ['rdv', 'rendez-vous'].includes(type) ? 'event' : 'task' };
    const iso = title.match(/\s+(?:le\s+)?(\d{4}-\d{2}-\d{2})(?=\s|$)/u);
    if (iso) {
      if (!validDate(iso[1])) return { kind: 'error', text: 'Cette date n’existe pas. Essayez une date au format AAAA-MM-JJ.' };
      draft.date = iso[1]; title = title.replace(iso[0], ' ');
    } else {
      const relative = title.match(/\s+(demain|aujourd[’']hui)(?=\s|$)/iu);
      if (relative) { draft.date = normalized(relative[1]) === 'demain' ? shiftDay(referenceDay, 1) : referenceDay; title = title.replace(relative[0], ' '); }
    }
    const time = title.match(/\s+(?:à|a)\s+(\d{1,2})(?:\s*h(?:\s*(\d{2}))?|:(\d{2}))?(?=\s|$)/iu);
    if (time) {
      const hours = Number(time[1]), minutes = Number(time[2] || time[3] || 0);
      if (hours > 23 || minutes > 59) return { kind: 'error', text: 'L’heure doit être comprise entre 00:00 et 23:59.' };
      draft.time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`; title = title.replace(time[0], ' ');
    }
    const duration = title.match(/\s+pendant\s+(\d+)\s*(minutes?|min|heures?|h)(?=\s|$)/iu);
    if (duration) {
      const amount = Number(duration[1]) * (/^h/iu.test(duration[2]) ? 60 : 1);
      if (amount < 5 || amount > 480 || amount % 5 !== 0) return { kind: 'error', text: 'Choisissez une durée de 5 à 480 minutes, par pas de 5 minutes.' };
      draft.duration = amount; title = title.replace(duration[0], ' ');
    }
    const priority = title.match(/\s+(prioritaire|urgente?|priorité\s+(?:haute|élevée)|priorite\s+(?:haute|elevee))(?=\s|$)/iu);
    if (priority) { draft.priority = 'high'; title = title.replace(priority[0], ' '); }
    draft.title = title.replace(/\s+/g, ' ').trim();
    return { kind: 'task', draft };
  }
  if (/^(bonjour|salut|bonsoir|coucou)[!.?]*$/u.test(command)) return { kind: 'greeting' };
  if (/^(?:(?:montre|affiche|ouvre|voir)(?:-moi)?\s+)?(?:mes |les )?factures[.!?]*$/u.test(command)) return { kind: 'bills' };
  if (/^(?:(?:montre|affiche|ouvre|voir)(?:-moi)?\s+)?(?:mes |les )?documents[.!?]*$/u.test(command)) return { kind: 'documents' };
  if (/^(?:(?:montre|affiche|ouvre|voir)(?:-moi)?\s+)?(?:mon |le )?(?:agenda|planning|calendrier|programme|ma journee|mes priorites)[.!?]*$/u.test(command) || /^(?:organise|planifie)(?:-moi)?\s+(?:ma|la)\s+journee[.!?]*$/u.test(command)) return { kind: 'plan' };
  if (/^(?:aide|commandes|que peux-tu faire)[?!.]*$/u.test(command)) return { kind: 'help' };
  return { kind: 'unknown' };
}
