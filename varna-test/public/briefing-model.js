import { todayKey, validDate, minutesOf, timeOf, conflictsForDay, shiftDay } from './planning.js';
import { APPOINTMENT_CATEGORIES } from './appointments.js';
export const BRIEFING_SECTIONS = { agenda: 'Agenda', priorities: 'Priorités', tasks: 'Tâches', routines: 'Routines', payments: 'Finances', deadlines: 'Échéances', documents: 'Documents', notes: 'Notes', weather: 'Météo et déplacements', suggestions: 'Suggestions JAVIE' };
export const BRIEFING_DEFAULTS = { sections: Object.keys(BRIEFING_SECTIONS), collapsed: [], detail: 'complete', analyses: true, frequency: 'demand', hour: '08:00', notification: 'inapp', priority: 'urgency' };
export function realTasks(tasks = []) { return tasks.filter(t => !t.id.startsWith('demo-') && !['hydro', 'assurance', 'credit', 'internet'].includes(t.sourceBillId) && !t.cancelled); }
export function unpaidInvoices(invoices = []) { return invoices.filter(i => i.paymentStatus === 'unpaid' && validDate(i.dueDate)); }
export function buildBriefing({ state, invoices = [], routines = [], day = todayKey(), now = new Date(), analyses = true, priority = 'urgency' }) {
  const tasks = realTasks(state.tasks);
  const sameDay = day === todayKey(now);
  const items = tasks.filter(t => t.date === day && (sameDay || t.kind === 'event'));
  const events = items.filter(t => t.kind === 'event').sort((a,b) => (a.time || '99:99').localeCompare(b.time || '99:99'));
  const demoTasks = sameDay ? (state.tasks || []).filter(t =>
    t.id.startsWith('demo-') && t.date === day && t.kind === 'task' && !t.cancelled && !t.sourceBillId
  ) : [];
  const todos = [...items, ...demoTasks].filter(t => t.kind !== 'event' && !t.sourceBillId);
  const overdue = tasks.filter(t => t.kind === 'event' && !t.done && t.date < day);
  const invoicesDue = unpaidInvoices(invoices);
  const payments = invoicesDue.filter(i => i.dueDate === day);
  const latePayments = invoicesDue.filter(i => i.dueDate < day);
  const conflicts = conflictsForDay(events, day);
  const clock = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now);
  const upcoming = events.find(t => !t.done && (!sameDay || minutesOf(t.time) >= minutesOf(clock)));
  const priorities = [];
  for (const t of [...items, ...demoTasks, ...overdue]) {
    if (t.done) continue;
    const reasons = [];
    if (t.priority === 'high') reasons.push('Importance définie par vous');
    if (t.date < day) reasons.push(`En retard depuis le ${t.date}`);
    if (t.kind === 'reminder' && t.date === day) reasons.push('Rappel à traiter aujourd’hui');
    if (analyses && t.sourceAppointmentId && t.appointmentAction === 'preparation') reasons.push('Préparation liée à un rendez-vous');
    if (analyses && t.dependsOn?.some(id => tasks.find(x => x.id === id && !x.done))) reasons.push('Dépendance à terminer avant de commencer');
    if (!reasons.length) continue;
    priorities.push({ id: t.id, kind: 'task', task: t, title: t.title, origin: t.kind === 'event' ? 'Calendrier' : 'Tâches', date: t.date, level: t.date < day ? 'urgent' : t.priority, reasons, score: (t.date < day ? 100 : 0) + (t.priority === 'high' ? 60 : 0) + (t.kind === 'event' ? 20 : 0) + (t.sourceAppointmentId ? 10 : 0), action: 'Vérifier les détails.' });
  }
  for (const i of [...payments, ...latePayments]) priorities.push({ id: `invoice:${i.id}`, kind: 'invoice', invoice: i, title: i.title || i.name, origin: 'Factures', date: i.dueDate, level: i.dueDate < day ? 'urgent' : 'high', reasons: [i.dueDate < day ? 'Facture identifiée impayée et en retard' : 'Facture identifiée impayée, à échéance aujourd’hui'], score: i.dueDate < day ? 120 : 80, action: 'Consulter la facture et préparer son paiement.' });
  priorities.sort((a,b) => priority === 'deadline' ? a.date.localeCompare(b.date) || b.score-a.score : b.score-a.score || a.date.localeCompare(b.date));
  const documents = events.flatMap(t => t.appointment?.confirmed?.documents ? t.appointment.documents.map(d => ({ ...d, task: t })) : []);
  const notes = (state.notes || []).filter(n => n.pinned || n.day === day || (!n.day && new Date(n.date).toString() !== 'Invalid Date' && todayKey(new Date(n.date)) === day) || n.taskId && items.some(t => t.id === n.taskId));
  const deadlines = [
    ...invoicesDue.filter(i => i.dueDate <= shiftDay(day,30)).map(i => ({ id: `invoice:${i.id}`, kind:'invoice', title:i.title || i.name, date:i.dueDate, invoice:i, origin:'Factures' })),
    ...tasks.filter(t => !t.done && (t.kind === 'event' || sameDay && t.date === day) && (t.kind === 'reminder' || t.deadline) && (t.deadline || t.date) <= shiftDay(day,30)).map(t => ({ id:t.id, kind:'task', title:t.title, date:t.deadline || t.date, task:t, origin:t.kind === 'event'?'Calendrier':'Tâches' })),
  ].sort((a,b)=>a.date.localeCompare(b.date));
  const remaining = todos.filter(t=>!t.done).length;
  const phrase = priorities.length ? `${priorities.length} élément${priorities.length>1?'s':''} mérite${priorities.length>1?'nt':''} votre attention.` : events.length+remaining ? `${events.length} rendez-vous et ${remaining} tâche${remaining>1?'s':''} à faire.` : 'Rien d’urgent à signaler pour le moment.';
  const summary = `Bonjour${state.name ? ` ${state.name}`:''} ! Pour le ${day}, vous avez ${events.length} rendez-vous, ${remaining} tâche${remaining>1?'s':''} à accomplir et ${payments.length} facture${payments.length>1?'s':''} impayée${payments.length>1?'s':''} à échéance. ${priorities.length ? `${priorities.length} priorité(s) identifiée(s) pour vous aider à organiser la journée.` : 'Aucune priorité urgente identifiée dans les données disponibles.'}`;
  const load = items.filter(t=>!t.done).reduce((s,t)=>s+t.duration,0);
  const suggestions = [];
  if (analyses) {
    if (conflicts.length) suggestions.push({ id:`conflicts:${day}`, title:'Vérifier les chevauchements', text:`${conflicts.length} conflit(s) d’horaire détecté(s). Examinez vos horaires avant de déplacer un élément.`, section:'agenda', action:'Examiner' });
    if (sameDay && load > 480) suggestions.push({ id:`load:${day}`, title:'Une journée chargée', text:`${load} minutes prévues pour une plage indicative de 8 heures. Une réorganisation peut être utile.`, section:'tasks', action:'Proposer un planning', plan:true });
    if (payments.length) suggestions.push({ id:`payments:${day}`, title:'Préparer les paiements', text:`${payments.length} facture(s) impayée(s) à échéance. Un rappel peut vous aider.`, section:'payments', action:'Voir' });
    if (documents.length) suggestions.push({ id:`documents:${day}`, title:'Préparer les documents', text:`${documents.length} document(s) associé(s) à vos rendez-vous. Leur contenu reste masqué.`, section:'documents', action:'Consulter' });
  }
  return { day, items, events, todos, overdue, payments, latePayments, invoicesDue, priorities, documents, notes, deadlines, routines, conflicts, upcoming, phrase, summary, load, suggestions, refreshed: now.toISOString(), remaining, urgent:priorities.filter(p=>p.level==='urgent').length };
}
export function appointmentCategory(t) { return APPOINTMENT_CATEGORIES[t.appointment?.category]?.label || 'Rendez-vous'; }
export function endTime(t) { const n = minutesOf(t.time); return n === null ? 'Non précisée' : timeOf(Math.min(1439,n+t.duration)); }
