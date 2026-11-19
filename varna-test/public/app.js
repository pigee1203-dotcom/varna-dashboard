import { realTasks } from './briefing-model.js';
import { createBriefing } from './briefing.js?v=cyan-name-146';
import { APPOINTMENT_CATEGORIES, applyAppointmentProposals } from './appointments.js';
import { openAppointmentForm } from './appointment-form.js?v=appointments-37';
import { createPages } from './pages.js?v=calendar-search-159';
import { mountInvoiceImports } from './invoice-imports.js';
import { DEMO_BILLS, billDate, dueLabel, billReminder, linkedReminder, parseCommand } from './connections.js';
import { PRIORITIES, TASK_SECTIONS, todayKey, validDate, shiftDay, minutesOf, formatDuration, normalizeTask, tasksForDay, conflictsForDay, suggestDay } from './planning.js';

'use strict';

const $ = selector => document.querySelector(selector);
const isVerre = location.pathname.endsWith('/verre.html');
const STORAGE_KEY = 'varna-test.javie.v1';
let selectedDay = todayKey();
let currentRoute = 'accueil';
let calendarView = 'agenda';
let pages;
let briefing;
function navigate(...args) { briefing?.stopSpeech(); pages.navigate(...args); }
function syncCalendarUrl() { pages?.syncDate(); }
function renderWorkspace() { pages?.render(); }
let planningStart = '08:30', planningEnd = '18:00';
const initialTasks = [
  { id: 'demo-1', title: 'Appeler Hydro-Québec', time: '09:30', duration: 15, priority: 'high', done: false },
  { id: 'demo-2', title: 'Préparer les documents bancaires', time: '11:00', duration: 45, done: false },
  { id: 'demo-3', title: 'Vérifier les paiements du jour', time: '15:00', duration: 20, priority: 'low', done: false },
].map(task => normalizeTask(task, selectedDay));
let state = { name: 'Melissa', tasks: initialTasks, notes: [], profileConfigured: false, billBaseDate: todayKey() };
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (saved && typeof saved === 'object') {
    state.profileConfigured = saved.profileConfigured === true;
    if (validDate(saved.billBaseDate)) state.billBaseDate = saved.billBaseDate;
    state.name = typeof saved.name === 'string' && saved.name.trim() ? saved.name.slice(0, 40) : 'Melissa';
    if (Array.isArray(saved.tasks)) state.tasks = saved.tasks.map(task => normalizeTask(task, selectedDay)).filter(Boolean);
    if (Array.isArray(saved.notes)) state.notes = saved.notes.filter(note => typeof note?.id === 'string' && typeof note?.text === 'string' && typeof note?.date === 'string');
  }
} catch { /* Browser storage is optional for the laboratory. */ }

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { toast('Stockage indisponible : vos modifications restent dans cette session.'); }
}
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#i-${name}`);
  svg.append(use);
  return svg;
}
let toastTimer;
function toast(message) {
  const notification = $('#toast');
  notification.textContent = message;
  notification.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { notification.hidden = true; }, 4200);
}
const conversationHome = document.createComment('Emplacement du fil Javie');
$('#conversation').before(conversationHome);
function restoreConversation() {
  const conversation = $('#conversation');
  if (!conversation || conversation.parentNode !== $('#modal-content')) return;
  conversation.hidden = true;
  conversationHome.after(conversation);
  document.querySelector('[aria-controls="conversation"]')?.setAttribute('aria-expanded', 'false');
}
function openModal(title) {
  restoreConversation();
  $('#modal').dataset.view = '';
  $('#modal-title').textContent = title;
  $('#modal-content').replaceChildren();
  if (!$('#modal').open) $('#modal').showModal();
  return $('#modal-content');
}
function closeModal() { $('#modal').close(); }
$('#modal-close').addEventListener('click', closeModal);
$('#modal').addEventListener('click', event => {
  if (event.target !== $('#modal')) return;
  const bounds = $('#modal').getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeModal();
});
$('#modal').addEventListener('close', () => {
  if ($('#modal').open) return;
  restoreConversation();
  document.body.style.overflow = '';
});
function showModal(title) {
  const content = openModal(title);
  document.body.style.overflow = 'hidden';
  return content;
}
function field(label, { type = 'text', placeholder = '', value = '', required = true, maxLength = 160 } = {}) {
  const wrapper = element('label', 'field', label);
  const input = element(type === 'textarea' ? 'textarea' : 'input');
  if (type !== 'textarea') input.type = type;
  input.placeholder = placeholder;
  input.value = value;
  input.required = required;
  input.maxLength = maxLength;
  wrapper.append(input);
  return { wrapper, input };
}
function formActions(form, label, onSubmit, onCancel = closeModal) {
  const actions = element('div', 'form-actions');
  const cancel = element('button', 'secondary-button', 'Annuler');
  cancel.type = 'button'; cancel.addEventListener('click', onCancel);
  const submit = element('button', 'primary-button', label); submit.type = 'submit';
  actions.append(cancel, submit); form.append(actions);
  form.addEventListener('submit', event => { event.preventDefault(); onSubmit(); });
}
function appendHint(content, text) { content.append(element('p', 'modal-hint', text)); }
function sortedTasks() { return tasksForDay(state.tasks, selectedDay); }
function formatDay(day, short = false) {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString('fr-CA', { timeZone: 'UTC', weekday: short ? 'short' : 'long', day: 'numeric', month: short ? 'short' : 'long' });
}
function setDay(day) {
  if (!validDate(day)) return;
  selectedDay = day; syncCalendarUrl(); render();
  if ($('#modal').open && $('#modal').dataset.view === 'planner') calendar();
}
function taskRow(task, openTask = addTask) {
  const item = element('li', `agenda-item${task.done ? ' done' : ''}`);
  item.dataset.priority = task.priority;
  const time = element('time', 'task-time', task.time || 'À placer');
  if (task.time) time.dateTime = `${task.date}T${task.time}`;
  time.append(element('small', '', formatDuration(task.duration)));
  const open = element('button', 'task-open'); open.type = 'button';
  open.setAttribute('aria-label', `Ouvrir : ${task.title}`);
  open.append(element('strong', '', task.title));
  const metadata = element('span', 'task-metadata');
  metadata.append(element('span', `priority-tag priority-${task.priority}`, PRIORITIES[task.priority]));
  if (task.section && TASK_SECTIONS[task.section]) metadata.append(element('span', 'task-section-label', TASK_SECTIONS[task.section]));
  if (task.sourceBillId) metadata.append(element('span', 'bill-tag', 'Rappel de facture'));
  if (task.kind === 'event') metadata.append(element('span', 'event-tag', 'Rendez-vous'));
  open.append(metadata); open.addEventListener('click', () => openTask(task));
  const check = element('button', 'agenda-check', task.done ? '✓' : '');
  check.type = 'button'; check.dataset.taskCheck = task.id;
  check.setAttribute('aria-label', `${task.done ? 'Rouvrir' : 'Terminer'} la tâche : ${task.title}`);
  check.setAttribute('role', 'checkbox');
  check.setAttribute('aria-checked', String(task.done));
  check.addEventListener('click', () => {
    const inPlanner = $('#modal').open && $('#modal').dataset.view === 'planner';
    const inDayTasks = $('#modal').open && $('#modal').dataset.view === 'day-tasks';
    const homeListId = check.closest('#home-tasks-list, #agenda-list')?.id;
    task.done = !task.done; save(); render();
    if (inPlanner) calendar();
    const scope = inPlanner || inDayTasks ? $('#modal') : currentRoute === 'accueil' ? (homeListId ? document.getElementById(homeListId) : $('#dashboard')) : $('#workspace-page');
    [...scope.querySelectorAll('[data-task-check]')].find(button => button.dataset.taskCheck === task.id)?.focus({ preventScroll: true });
    toast(task.done ? 'Une chose de moins à garder en tête. Bien joué !' : 'La tâche est de nouveau à faire.');
  });
  item.append(time, open, check);
  return item;
}
function render() {
  $('#greeting-name').textContent = state.name;
  $('.profile-button').textContent = state.name.charAt(0).toUpperCase();
  $('.profile-button').setAttribute('aria-label', `Profil de ${state.name}`);
  const dayTasks = sortedTasks();
  const remaining = dayTasks.filter(task => !task.done).length;
  const completed = dayTasks.length - remaining;
  const progress = dayTasks.length ? Math.round(completed / dayTasks.length * 100) : 0;
  if (!isVerre) {
  const overviewDate = new Date(`${selectedDay}T12:00:00Z`);
  $('#overview-date').dateTime = selectedDay;
  $('#overview-date-label').textContent = selectedDay === todayKey() ? 'Aujourd’hui' : 'Votre journée';
  $('#overview-weekday').textContent = overviewDate.toLocaleDateString('fr-CA', { weekday: 'long', timeZone: 'UTC' });
  $('#overview-day-number').textContent = Number(selectedDay.slice(8));
  $('#overview-month').textContent = overviewDate.toLocaleDateString('fr-CA', { month: 'long', timeZone: 'UTC' });
  $('#overview-progress').textContent = `${progress} %`;
  $('#overview-ring').style.setProperty('--progress', `${progress}%`);
  $('#overview-ring').setAttribute('aria-valuenow', progress);
  $('#overview-appointments').textContent = dayTasks.filter(task => task.kind === 'event' && !task.done).length;
  $('#overview-pending').textContent = dayTasks.filter(task => !task.done && task.kind !== 'event' && task.kind !== 'reminder' && !task.sourceBillId).length;
  for (const [selector, items, empty] of [
    ['#overview-events-list', dayTasks.filter(task => task.kind === 'event' && !task.done), 'Aucun rendez-vous pour cette journée.'],
    ['#overview-tasks-list', dayTasks.filter(task => !task.done && task.kind !== 'event' && task.kind !== 'reminder' && !task.sourceBillId), 'Aucune tâche à faire pour cette journée.'],
  ]) {
    const list = $(selector);
    if (!list) continue;
    list.replaceChildren();
    items.forEach(task => list.append(taskRow(task, showTaskDetails)));
    if (!items.length) list.append(element('li', 'overview-inline-empty', empty));
  }
  const overviewDuration = $('#overview-duration');
  if (overviewDuration) overviewDuration.textContent = formatDuration(dayTasks.filter(task => !task.done).reduce((sum, task) => sum + task.duration, 0));
  const next = dayTasks.find(task => !task.done && task.time);
  $('#overview-next').textContent = next ? `À l’agenda · ${next.time} — ${next.title}` : remaining ? 'Votre journée reste à organiser.' : 'Tout est à jour pour cette journée.';
  } else briefing?.renderHome();
  const homeTaskItems = state.tasks.filter(task => task.kind !== 'event' && task.kind !== 'reminder' && !task.sourceBillId).sort((a, b) => a.date.localeCompare(b.date) || (a.time || '99:99').localeCompare(b.time || '99:99'));
  const pendingCount = homeTaskItems.filter(task => !task.done).length;
  $('#home-tasks-count').textContent = `${pendingCount} à faire · ${homeTaskItems.length - pendingCount} terminée${homeTaskItems.length - pendingCount > 1 ? 's' : ''} · toutes les dates`;
  const homeTasks = $('#home-tasks-list'); homeTasks.replaceChildren();
  homeTaskItems.forEach(task => {
    const row = taskRow(task);
    row.querySelector('.task-metadata').append(element('span', 'home-task-date', formatDay(task.date, true)));
    homeTasks.append(row);
  });
  if (!homeTaskItems.length) homeTasks.append(element('li', 'agenda-empty', 'Aucune tâche pour le moment. Ajoutez votre prochaine priorité.'));
  $('#day-picker').value = selectedDay;
  $('#today-date').textContent = formatDay(selectedDay);
  $('#day-load').textContent = `${formatDuration(dayTasks.filter(task => !task.done).reduce((sum, task) => sum + task.duration, 0))} à prévoir`;
  $('#day-completed').textContent = `${completed} / ${dayTasks.length} terminés`;
  $('#day-progress').setAttribute('aria-valuenow', progress);
  $('#day-progress span').style.width = `${progress}%`;
  const conflicts = conflictsForDay(state.tasks, selectedDay);
  $('#day-conflicts').hidden = !conflicts.length;
  $('#day-conflicts').textContent = conflicts.length ? `${conflicts.length} chevauchement${conflicts.length > 1 ? 's' : ''} d’horaire à vérifier` : '';
  $('#day-conflicts').setAttribute('role', 'status');
  $('#back-today').hidden = selectedDay === todayKey();
  if ($('#task-count')) $('#task-count').textContent = `${state.tasks.filter(task => !task.done).length} à faire`;
  $('#agenda-count').textContent = `${remaining} à faire`;
  $('#chat-task-count').textContent = `${remaining} chose${remaining !== 1 ? 's' : ''} à faire`;
  if ($('#note-count')) $('#note-count').textContent = `${state.notes.length} note${state.notes.length !== 1 ? 's' : ''}`;
  const latestNotePreview = $('#latest-note-preview');
  if (latestNotePreview) {
    const latestNote = state.notes[0];
    latestNotePreview.hidden = !latestNote;
    $('#latest-note-text').textContent = latestNote?.text || '';
  }
  const agenda = $('#agenda-list'); agenda.replaceChildren();
  if (!dayTasks.length) agenda.append(element('li', 'agenda-empty', 'Une page blanche pour votre journée. Ajoutez une tâche.'));
  sortedTasks().slice(0, 4).forEach(task => agenda.append(taskRow(task)));
  const planningLink = $('#agenda .panel-link > span');
  planningLink.replaceChildren(icon('calendar'), document.createTextNode(dayTasks.length > 4 ? `Voir mes ${dayTasks.length} éléments` : 'Ouvrir ma planification'));
  renderBillReminders();
  const notes = $('#notes-list'); notes.replaceChildren();
  if (!state.notes.length) {
    const empty = element('div', 'empty-note');
    const mark = element('span', 'square-icon violet'); mark.append(icon('note'));
    const text = element('div'); text.append(element('strong', '', 'Une idée en passant ?'), element('p', '', 'Elle sera bien ici.'));
    empty.append(mark, text); notes.append(empty);
  }
  state.notes.slice(0, 4).forEach(note => {
    const item = element('article', 'note-item');
    const remove = element('button'); remove.type = 'button'; remove.setAttribute('aria-label', `Supprimer la note : ${note.text.slice(0, 40)}`); remove.append(icon('close'));
    remove.addEventListener('click', () => { if (!window.confirm('Supprimer cette note ?')) return; state.notes = state.notes.filter(candidate => candidate.id !== note.id); save(); render(); toast('Note supprimée du laboratoire.'); });
    item.append(element('p', '', note.text), element('small', '', new Date(note.date).toLocaleDateString('fr-CA', { day: 'numeric', month: 'long' })), remove); notes.append(item);
  });
  renderWorkspace();
  if ($('#modal').open && $('#modal').dataset.view === 'day-tasks') dayTasksHologram();
}
function projectHologram() {
    const modal = $('#modal');
    modal.classList.remove('tasks-projecting');
    modal.getAnimations().forEach(animation => animation.cancel());
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      modal.animate([
        { offset: 0, opacity: 0, transform: 'perspective(1600px) rotateX(16deg) scale(.015,.002)', backgroundColor: '#dbfcff', boxShadow: '0 0 60px 18px #a6f4ff' },
        { offset: .1, opacity: 1, transform: 'perspective(1600px) rotateX(16deg) scale(.05,.004)', backgroundColor: '#dbfcff' },
        { offset: .32, opacity: 1, transform: 'perspective(1600px) rotateX(12deg) scale(.96,.006)', backgroundColor: '#c4f7ff', boxShadow: '0 0 55px 10px #86e5ff99' },
        { offset: .68, opacity: 1, transform: 'perspective(1600px) rotateX(4deg) scale(1,.96)', backgroundColor: '#91dfff24' },
        { offset: 1, opacity: 1, transform: 'none', backgroundColor: 'transparent' },
      ], { duration: 2000, easing: 'cubic-bezier(.25,.7,.25,1)' });
      [...modal.children].forEach(child => child.animate([
        { offset: 0, opacity: 0 }, { offset: .45, opacity: 0 },
        { offset: .72, opacity: .55 }, { offset: 1, opacity: 1 },
      ], { duration: 2000, easing: 'ease-out' }));
    }
}
function dayTasksHologram() {
  const alreadyOpen = $('#modal').open && $('#modal').dataset.view === 'day-tasks';
  const content = showModal('Mes tâches du jour');
  $('#modal').dataset.view = 'day-tasks';
  if (!alreadyOpen) projectHologram();
  const tasks = sortedTasks().filter(task => task.kind !== 'event' && task.kind !== 'reminder' && !task.sourceBillId);
  const pending = tasks.filter(task => !task.done).length;
  content.append(element('p', 'modal-copy', `${formatDay(selectedDay)} · ${pending} à faire · ${tasks.length - pending} terminées`));
  const list = element('ol', 'agenda-list');
  tasks.forEach(task => list.append(taskRow(task)));
  if (!tasks.length) list.append(element('li', 'agenda-empty', 'Aucune tâche pour cette journée.'));
  content.append(list);
  const add = element('button', 'primary-button', 'Ajouter une tâche');
  add.type = 'button';
  add.addEventListener('click', () => addTask());
  content.append(add);
}
function selectField(label, options, value) {
  const wrapper = element('label', 'field', label), input = element('select');
  input.setAttribute('aria-label', label);
  Object.entries(options).forEach(([key, text]) => { const option = element('option', '', text); option.value = key; input.append(option); });
  input.value = value; wrapper.append(input); return { wrapper, input };
}
function showTaskDetails(task) {
  const content = showModal(task.kind === 'event' ? 'Mon rendez-vous' : task.kind === 'reminder' ? 'Mon rappel' : 'Ma tâche');
  $('#modal').dataset.view = 'task-details';
  content.append(element('h3', 'task-detail-title', task.title));
  const details = element('dl', 'task-detail-grid');
  const rows = [
    ['Date', formatDay(task.date)],
    ['Heure', task.time || 'Non précisée'],
    ['Durée', formatDuration(task.duration)],
    ['Priorité', PRIORITIES[task.priority]],
    ['État', task.done ? 'Terminé' : 'À faire'],
  ];
  if (task.appointment) {
    const a = task.appointment;
    for (const [label, key] of [['Catégorie', 'category'], ['Consultation', 'type'], ['Personne concernée', 'personName'], ['Professionnel', 'provider'], ['Établissement', 'place'], ['Adresse', 'address'], ['Téléphone', 'phone'], ['Véhicule', 'vehicle'], ['Visioconférence', 'meetingUrl']]) if (a[key]) rows.push([label, key === 'category' ? APPOINTMENT_CATEGORIES[a.category]?.label || a[key] : a[key]]);
  }
  if (task.section) rows.push(['Section', TASK_SECTIONS[task.section] || task.section]);
  rows.forEach(([label, value]) => { const row = element('div'); row.append(element('dt', '', label), element('dd', '', value)); details.append(row); });
  content.append(details);
  if (task.description) {
    const notes = element('section', 'task-detail-notes');
    notes.append(element('h3', '', 'Détails et notes'), element('p', '', task.description)); content.append(notes);
  }
  const actions = element('div', 'form-actions');
  const close = element('button', 'secondary-button', 'Fermer'); close.type = 'button'; close.onclick = closeModal;
  const edit = element('button', 'primary-button', 'Modifier'); edit.type = 'button'; edit.onclick = () => addTask(task);
  actions.append(close, edit); content.append(actions);
}
function addAppointment(existing = null, defaults = {}) {
  openAppointmentForm({
    element, icon, field, selectField, showModal, closeModal, selectedDay,
    getTasks: () => state.tasks,
    remove: task => confirmDelete(task, false),
    commit: async (candidate, proposals) => {
      const event = normalizeTask(candidate);
      if (!event?.appointment) throw new Error('Invalid appointment');
      const tasks = applyAppointmentProposals(state.tasks, event, proposals.map(p => p.key));
      const next = { ...state, tasks };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      state = next; selectedDay = event.date;
      closeModal(); syncCalendarUrl(); render();
      toast('Rendez-vous enregistré. Les actions confirmées ont été ajoutées.');
    },
  }, existing, defaults);
}
function addTask(existing = null, defaults = {}) {
  if ((existing?.kind || defaults.kind) === 'event') { addAppointment(existing, defaults); return; }
  const returnToPlanner = $('#modal').open && $('#modal').dataset.view === 'planner';
  const isReminder = (existing?.kind || defaults.kind) === 'reminder';
  const content = showModal(existing ? (isReminder ? 'Modifier mon rappel' : 'Modifier ma planification') : (isReminder ? 'Un nouveau rappel' : 'Une nouvelle tâche'));
  $('#modal').dataset.view = 'task';
  content.append(element('p', 'modal-copy', existing ? 'Ajustez les détails de cet élément de votre journée.' : 'Une priorité à la fois. Choisissez quand et comment lui faire une place.'));
  const form = element('form');
  const title = field('Que souhaitez-vous faire ?', { placeholder: 'Ex. Préparer mon rendez-vous', value: existing?.title || defaults.title || '' });
  const date = field('Quelle journée ?', { type: 'date', value: existing?.date || defaults.date || selectedDay });
  const time = field('À quelle heure ? (facultatif)', { type: 'time', required: false, value: existing?.time || defaults.time || '' });
  const duration = field('Durée en minutes', { type: 'number', value: String(existing?.duration || defaults.duration || 30) });
  duration.input.min = '5'; duration.input.max = '480'; duration.input.step = '5';
  const priority = selectField('Priorité', PRIORITIES, existing?.priority || defaults.priority || 'normal');
  const kind = selectField('Type', { task: 'Tâche', reminder: 'Rappel', event: 'Rendez-vous' }, existing?.kind || defaults.kind || 'task');
  const section = selectField('Dans quelle section ? (facultatif)', { '': 'Sans section', ...TASK_SECTIONS }, existing?.section || defaults.section || '');
  const description = field('Un détail à garder ? (facultatif)', { type: 'textarea', required: false, value: existing?.description || defaults.description || '', maxLength: 1000 });
  const dateTime = element('div', 'field-grid'); dateTime.append(date.wrapper, time.wrapper);
  const preferences = element('div', 'field-grid'); preferences.append(duration.wrapper, priority.wrapper);
  const warning = element('p', 'planning-warning'); warning.hidden = true; warning.setAttribute('role', 'status');
  const draft = () => ({ id: existing?.id || 'draft', title: title.input.value.trim() || 'Cet élément', date: date.input.value, time: time.input.value, duration: Number(duration.input.value), priority: priority.input.value, kind: kind.input.value, section: section.input.value, description: description.input.value.trim(), done: existing?.done || false, sourceBillId: existing?.sourceBillId || defaults.sourceBillId || '', sourceNoteId: existing?.sourceNoteId || defaults.sourceNoteId || '', started: existing?.started || false, cancelled: existing?.cancelled || false, ...((existing?.sourceAppointmentId || defaults.sourceAppointmentId) ? { sourceAppointmentId: existing?.sourceAppointmentId || defaults.sourceAppointmentId, appointmentAction: existing?.appointmentAction || '' } : {}) });
  const updateWarning = () => {
    time.input.required = kind.input.value === 'event';
    time.wrapper.firstChild.textContent = kind.input.value === 'event' ? 'À quelle heure ?' : 'À quelle heure ? (facultatif)';
    const candidate = draft();
    const overlapping = conflictsForDay([...state.tasks.filter(task => task.id !== candidate.id), candidate], candidate.date).filter(pair => pair.left.id === candidate.id || pair.right.id === candidate.id);
    const crossesMidnight = candidate.time && minutesOf(candidate.time) + candidate.duration > 1440;
    warning.hidden = !overlapping.length && !crossesMidnight;
    warning.textContent = crossesMidnight ? 'Ce créneau dépasse minuit. Choisissez une heure plus tôt ou une durée plus courte.' : overlapping.length ? 'Ce créneau chevauche un autre élément de votre journée. Vous pourrez ajuster les horaires.' : '';
    time.input.setCustomValidity(crossesMidnight ? 'Le créneau doit se terminer avant minuit.' : '');
  };
  form.addEventListener('input', updateWarning); form.addEventListener('change', updateWarning);
  form.append(title.wrapper, dateTime, preferences, kind.wrapper, section.wrapper, description.wrapper, warning);
  formActions(form, existing ? 'Enregistrer les modifications' : 'Ajouter à ma journée', () => {
    if (!title.input.value.trim()) { title.input.setCustomValidity('Écrivez le titre de votre tâche.'); title.input.reportValidity(); return; }
    const candidate = normalizeTask({ ...draft(), id: existing?.id || crypto.randomUUID() });
    if (existing) state.tasks = state.tasks.map(task => task.id === existing.id ? candidate : task);
    else state.tasks.push(candidate);
    selectedDay = candidate.date;
    save(); render();
    if (returnToPlanner) calendar(); else closeModal();
    toast(existing ? 'Votre planification est à jour.' : 'Votre nouvelle tâche a trouvé sa place.');
  }, returnToPlanner ? calendar : closeModal);
  title.input.addEventListener('input', () => title.input.setCustomValidity(''));
  if (existing) {
    const remove = element('button', 'delete-task', 'Supprimer cet élément'); remove.type = 'button';
    remove.addEventListener('click', () => confirmDelete(existing, returnToPlanner)); form.append(remove);
  }
  content.append(form); appendHint(content, 'Conservé dans ce navigateur, uniquement pour la version de test.');
  updateWarning(); title.input.focus();
}
function confirmDelete(task, returnToPlanner) {
  const content = showModal('Supprimer cet élément ?');
  content.append(element('p', 'modal-copy', `« ${task.title} » sera retiré de votre planification de test.`));
  const controls = element('div', 'form-actions');
  const cancel = element('button', 'secondary-button', 'Garder cet élément');
  cancel.addEventListener('click', () => { if (returnToPlanner) calendar(); else closeModal(); });
  const remove = element('button', 'danger-button', 'Supprimer');
  remove.addEventListener('click', () => { state.tasks = state.tasks.filter(item => item.id !== task.id && item.sourceAppointmentId !== task.id); save(); render(); if (returnToPlanner) calendar(); else closeModal(); toast('Élément retiré de votre journée.'); });
  controls.append(cancel, remove); content.append(controls);
}
function addNote(initialText = '') {
  const content = showModal('Une idée à garder');
  const form = element('form');
  const note = field('Votre note', { type: 'textarea', placeholder: 'Une idée, un rappel, quelque chose pour plus tard…', value: initialText, maxLength: 2000 });
  const noteDay = field('Associer à une journée (facultatif)', { type: 'date', required: false, value: selectedDay });
  form.append(note.wrapper, noteDay.wrapper);
  formActions(form, 'Garder ma note', () => {
    if (!note.input.value.trim()) { note.input.setCustomValidity('Écrivez le contenu de votre note.'); note.input.reportValidity(); return; }
    state.notes.unshift({ id: crypto.randomUUID(), text: note.input.value.trim(), date: new Date().toISOString(), day: noteDay.input.value });
    save(); render(); closeModal(); toast('Votre idée est gardée dans le bloc-notes de test.');
  });
  note.input.addEventListener('input', () => note.input.setCustomValidity(''));
  content.append(form); appendHint(content, 'Vos notes de test restent dans ce navigateur et ne modifient pas le bloc-notes de VARNA.');
  note.input.focus();
}
function calendar(view = 'agenda') {
  closeModal();
  navigate('calendrier', { view, date: selectedDay });
}
function planningBox(dayTasks) {
  const unscheduled = dayTasks.filter(task => !task.done && !task.time && task.kind !== 'event');
  const planning = element('section', 'planning-box');
  planning.append(element('h3', '', 'Faire de la place à vos priorités'), element('p', '', 'Les tâches sans heure sont proposées dans les créneaux libres, par priorité. Vos horaires déjà fixés restent en place.'));
  const range = element('div', 'field-grid');
  const start = field('Début de journée', { type: 'time', value: planningStart });
  const end = field('Fin de journée', { type: 'time', value: planningEnd });
  range.append(start.wrapper, end.wrapper); planning.append(range);
  const error = element('p', 'planning-warning'); error.hidden = true; error.setAttribute('role', 'alert'); planning.append(error);
  const suggest = element('button', 'secondary-button', unscheduled.length ? `Proposer des horaires (${unscheduled.length})` : 'Aucune tâche à placer');
  suggest.disabled = !unscheduled.length;
  suggest.addEventListener('click', () => {
    planningStart = start.input.value; planningEnd = end.input.value;
    try { previewPlan(suggestDay(isVerre ? realTasks(state.tasks) : state.tasks, selectedDay, planningStart, planningEnd)); }
    catch (issue) { error.textContent = issue.message; error.hidden = false; }
  }); planning.append(suggest); return planning;
}
function previewPlan(proposal) {
  const content = showModal('Votre proposition de journée');
  $('#modal').dataset.view = 'planner';
  content.append(element('p', 'modal-copy', `${formatDay(selectedDay)} · ${proposal.assignments.length} tâche${proposal.assignments.length > 1 ? 's' : ''} placée${proposal.assignments.length > 1 ? 's' : ''}. Rien n’est modifié avant d’appliquer cette proposition.`));
  const list = element('ul', 'detail-list');
  proposal.assignments.forEach(assignment => {
    const task = proposal.tasks.find(item => item.id === assignment.id);
    const row = element('li'), text = element('div');
    text.append(element('strong', '', task.title), element('small', '', `${PRIORITIES[task.priority]} · ${formatDuration(task.duration)}`));
    row.append(text, element('span', '', assignment.time)); list.append(row);
  }); content.append(list);
  if (proposal.unplaced.length) content.append(element('p', 'planning-warning', `${proposal.unplaced.length} tâche${proposal.unplaced.length > 1 ? 's restent' : ' reste'} sans horaire : la plage choisie est trop courte. Elles seront conservées à placer.`));
  const controls = element('div', 'form-actions');
  const back = element('button', 'secondary-button', 'Revenir'); back.addEventListener('click', calendar);
  const apply = element('button', 'primary-button', 'Appliquer ce planning'); apply.disabled = !proposal.assignments.length;
  apply.addEventListener('click', () => {
    const times = new Map(proposal.assignments.map(assignment => [assignment.id, assignment.time]));
    state.tasks = state.tasks.map(task => times.has(task.id) && task.date === selectedDay && !task.time && !task.done ? { ...task, time: times.get(task.id) } : task);
    save(); render(); message(`Votre planning du ${formatDay(selectedDay, true)} est prêt : ${proposal.assignments.length} tâche${proposal.assignments.length > 1 ? 's ont' : ' a'} trouvé un créneau libre. Vos rendez-vous et horaires fixés sont conservés.`);
    calendar(); toast('Votre proposition a été appliquée à la journée.');
  }); controls.append(back, apply); content.append(controls);
}
function message(text, role = 'assistant') {
  const row = element('div', `message ${role === 'user' ? 'user-message' : 'assistant-message'}`);
  if (role !== 'user') row.append(element('span', 'ai-avatar', 'J'));
  row.append(element('div', 'bubble', text));
  const log = $('#messages'); log.append(row); log.scrollTop = log.scrollHeight;
  return row.querySelector('.bubble');
}
function planDay() {
  const remaining = sortedTasks().filter(task => !task.done);
  const summary = remaining.length ? `Votre journée du ${formatDay(selectedDay, true)} : ${remaining.map(task => `${task.time || 'à placer'} — ${task.title} (${formatDuration(task.duration)})`).join(' ; ')}. Les tâches sans horaire peuvent être placées dans les créneaux libres de la planification.` : 'Toutes les tâches sont terminées. Vous pouvez ajouter une nouvelle priorité ou garder un moment pour vous.';
  message(summary); calendar('day');
}
function reminderStatus(bill) {
  const task = linkedReminder(state.tasks, bill.id);
  return task ? task.done ? 'Rappel terminé' : `Rappel prévu le ${formatDay(task.date, true)}` : dueLabel(billDate(bill, state.billBaseDate));
}
function prepareBillReminder(bill) {
  const existing = linkedReminder(state.tasks, bill.id);
  if (existing) { addTask(existing); return; }
  addTask(null, billReminder(bill, state.billBaseDate));
}
function renderBillReminders() {
  const linked = DEMO_BILLS.filter(bill => linkedReminder(state.tasks, bill.id)).length;
  const label = $('#bill-reminder-status');
  const dot = element('i', 'amber-dot');
  label.replaceChildren(dot, document.createTextNode(linked ? `${linked} rappel${linked > 1 ? 's' : ''} lié${linked > 1 ? 's' : ''} aux factures` : '4 factures à suivre'));
  const list = $('#bill-reminder-list'); list.replaceChildren();
  DEMO_BILLS.slice(0, 3).forEach(bill => {
    const row = element('li');
    const mark = element('span', 'bill-reminder-mark'); mark.append(icon('bill'));
    const text = element('div'); text.append(element('strong', '', bill.title), element('small', '', reminderStatus(bill)));
    const button = element('button', 'icon-button');
    const linked = linkedReminder(state.tasks, bill.id);
    button.setAttribute('aria-label', `${linked ? 'Voir le rappel' : 'Préparer un rappel'} pour ${bill.title}`);
    button.append(icon(linked ? 'arrow' : 'plus'));
    button.addEventListener('click', () => prepareBillReminder(bill));
    row.append(mark, text, button); list.append(row);
  });
}
function detailList(rows) {
  const list = element('ul', 'detail-list');
  rows.forEach(([title, detail, amount]) => {
    const row = element('li'); const text = element('div');
    text.append(element('strong', '', title), element('small', '', detail));
    row.append(text); if (amount) row.append(element('span', '', amount)); list.append(row);
  });
  return list;
}
function bills() { navigate('factures'); }
function buildBills(content) {
  mountInvoiceImports(content, element, icon);
  const examples = element('details', 'invoice-examples');
  examples.append(element('summary', '', 'Voir les exemples de factures et rappels'));
  const list = element('ul', 'detail-list connected-bills');
  DEMO_BILLS.forEach(bill => {
    const row = element('li');
    const heading = element('div', 'bill-detail-heading');
    const text = element('div');
    text.append(element('strong', '', bill.title), element('small', '', `${dueLabel(billDate(bill, state.billBaseDate))} · échéance le ${formatDay(billDate(bill, state.billBaseDate), true)}`));
    heading.append(text, element('span', '', bill.amount.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })));
    const footer = element('div', 'bill-detail-footer');
    const existing = linkedReminder(state.tasks, bill.id);
    footer.append(element('small', '', existing ? reminderStatus(bill) : 'Pas encore de rappel'));
    const button = element('button', 'secondary-button', existing ? 'Modifier le rappel' : 'Préparer un rappel');
    button.setAttribute('aria-label', `${existing ? 'Modifier le rappel' : 'Préparer un rappel'} pour ${bill.title}`);
    button.addEventListener('click', () => prepareBillReminder(bill));
    footer.append(button); row.append(heading, footer); list.append(row);
  });
  examples.append(list); appendHint(examples, 'Factures de démonstration. Les rappels n’effectuent aucun paiement.');
  content.append(examples);
}
function documents() { navigate('documents'); }
function bank() { navigate('banque'); }
function profile() {
  const content = showModal('Mon profil de test');
  content.append(element('p', 'modal-copy', 'Un espace qui vous ressemble, jusque dans les petits détails.'));
  const form = element('form'); const name = field('Comment souhaitez-vous être appelée ?', { value: state.name, maxLength: 40 });
  form.append(name.wrapper);
  formActions(form, 'Enregistrer dans le test', () => {
    if (!name.input.value.trim()) { name.input.setCustomValidity('Indiquez un prénom.'); name.input.reportValidity(); return; }
    state.name = name.input.value.trim(); state.profileConfigured = true; save(); render(); closeModal(); toast(`Bienvenue dans votre espace, ${state.name}.`);
  });
  name.input.addEventListener('input', () => name.input.setCustomValidity(''));
  content.append(form); appendHint(content, 'Ce profil est local au laboratoire. Votre compte VARNA reste inchangé.'); name.input.focus();
}
function tools() {
  const content = showModal('Menu');
  $('#modal').dataset.view = 'menu';
  const list = element('nav', 'holo-menu-list');
  list.setAttribute('aria-label', 'Toutes les options');
  content.append(element('p', 'menu-screen-intro', 'Qu’est-ce qu’on simplifie aujourd’hui ?'));
  [['Briefing du jour','menu-briefing','home','Votre journée en un regard'],['Calendrier','calendar','calendar','Faire place à vos journées'],['Tâches & rappels','task','check','Vos priorités au quotidien'],['Mes finances','bank','wallet','Voir plus clair'],['Mes documents','documents','folder','Tout retrouver simplement'],['Mon espace personnel','profile','person','Votre profil personnel'],['Santé & bien-être','menu-wellbeing','heart','Vos routines et votre équilibre']].forEach(([title, action, symbol, description]) => {
    const button = element('button'); button.type = 'button'; button.dataset.action = action;
    const mark = element('span', 'menu-tile-icon'); mark.append(icon(symbol));
    const text = element('span', 'menu-tile-text'); text.append(element('strong', '', title), element('small', '', description));
    const arrow = icon('chevron'); arrow.classList.add('menu-tile-arrow');
    button.append(mark, text, arrow); list.append(button);
  });
  content.append(list);
  content.append(element('div', 'menu-screen-footer', 'VARNA · Votre quotidien, connecté.'));
  projectHologram();
}
function openConversation() {
  const conversation = $('#conversation');
  const content = showModal('Une question ? Parlons-en.');
  $('#modal').dataset.view = 'conversation';
  conversation.hidden = false;
  content.append(conversation);
  document.querySelector('[aria-controls="conversation"]')?.setAttribute('aria-expanded', 'true');
  projectHologram();
  if (isVerre && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $('#modal').getAnimations().forEach(animation => animation.cancel());
    $('#modal').animate([{ opacity: 0, transform: 'translateY(16px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'ease-out' });
  }
  $('#messages').scrollTop = $('#messages').scrollHeight;
  $('#chat-input').focus({ preventScroll: true });
}
const actions = {
  'menu-briefing': () => { closeModal(); briefing.open(); },
  'menu-wellbeing': () => { closeModal(); navigate('routines'); },
  suggestions: () => {
    const content = showModal('Suggestions de Javie');
    content.append(element('p', 'modal-copy', 'Suggestions de démonstration à explorer.'));
    content.append(document.querySelector('.suggestion-list').cloneNode(true));
  },
  'suggestion-finances': () => {
    const content = showModal('Explorer les aides financières');
    content.append(element('p', 'modal-copy', 'Pour trouver un programme adapté, précisez votre lieu de résidence et votre situation. Cette suggestion de démonstration ne confirme aucune admissibilité.'));
  },
  'suggestion-wellbeing': () => {
    const content = showModal('Une routine du soir simple');
    content.append(element('p', 'modal-copy', 'Préparer les affaires de demain, garder quelques minutes au calme et choisir une heure de coucher régulière. Adaptez cette idée à votre rythme.'));
  },
  conversation: openConversation,
  renewals: () => {
    const content = showModal('Échéances & renouvellements');
    content.append(element('p', 'modal-copy', 'Les dates importantes à ne pas oublier. Ces échéances sont des exemples du laboratoire.'));
    const list = document.querySelector('.renewal-list');
    if (list) content.append(list.cloneNode(true));
  },
  'day-tasks': dayTasksHologram, routines: () => navigate('routines'),
  task: () => navigate('taches'), 'new-task': () => addTask(), note: () => addNote(), notes: () => navigate('notes'), calendar, plan: planDay, bills, documents, bank, profile, tools,
  portrait: () => $('#portrait-file').click(),
  voice: () => {
    const content = showModal('Javie, à portée de voix');
    content.append(element('p', 'modal-copy', 'Cet espace accueillera la commande vocale de Javie. Pour cette première maquette, le microphone n’est pas activé. Vous pouvez déjà préparer votre journée, ajouter des tâches et garder vos idées par écrit.'));
    const button = element('button', 'primary-button', 'Écrire à Javie');
    button.addEventListener('click', () => { closeModal(); openConversation(); });
    content.append(button);
  },
};
document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (button && actions[button.dataset.action]) actions[button.dataset.action]();
});
function messageAction(text, title, action) {
  const bubble = message(text);
  const button = element('button', 'inline-plan'); button.type = 'button';
  button.append(icon('arrow'), document.createTextNode(title));
  button.addEventListener('click', action); bubble.append(button);
}
function respondToCommand(text) {
  const briefingCommand = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (isVerre && /organiser ma journee|organiser la journee/.test(briefingCommand)) { messageAction('Je peux proposer des créneaux pour les tâches sans horaire. Vous validerez le planning avant son application.', 'Préparer une proposition', () => { const content = showModal('Organiser mon Briefing du jour'); content.append(planningBox(realTasks(state.tasks).filter(task => task.date === selectedDay))); }); return; }
  if (isVerre && /briefing|prochain rendez-vous|mes priorites|quelles factures|que.*reporter/.test(briefingCommand)) {
    const section = /rendez-vous/.test(briefingCommand) ? 'agenda' : /priorites|reporter/.test(briefingCommand) ? 'priorities' : /factures/.test(briefingCommand) ? 'payments' : '';
    messageAction('Votre Briefing du jour rassemble les informations enregistrées dans VARNA.', 'Ouvrir mon Briefing du jour', () => briefing.open(section)); return;
  }
  const command = parseCommand(text, todayKey(), selectedDay);
  if (command.kind === 'task') {
    messageAction('Je prépare les détails. Vérifiez la date, la durée et la priorité avant d’enregistrer.', 'Revoir cette proposition', () => addTask(null, command.draft));
    if (!isVerre) addTask(null, command.draft);
  } else if (command.kind === 'note') {
    messageAction('Votre note est prête à être vérifiée. Elle sera conservée lorsque vous choisirez « Garder ma note ».', 'Revoir ma note', () => addNote(command.text));
    if (!isVerre) addNote(command.text);
  } else if (command.kind === 'plan') {
    if (isVerre) {
      const pending = sortedTasks().filter(task => !task.done);
      messageAction(pending.length ? `Il reste ${pending.length} tâche${pending.length > 1 ? 's' : ''} pour cette journée. ${pending.slice(0, 3).map(task => `${task.time || 'À placer'} — ${task.title}`).join(' · ')}. On fait de la place pour vos priorités ?` : 'Votre journée est libre. Ajoutons une priorité ou gardons un moment pour vous.', 'Organiser ma journée', () => calendar('day'));
    } else planDay();
  } else if (command.kind === 'bills') {
    messageAction('Voici vos factures de démonstration. Vous pouvez préparer un rappel lié à chacune pour votre agenda.', 'Voir mes factures', bills); if (!isVerre) bills();
  } else if (command.kind === 'documents') {
    messageAction('J’ouvre l’aperçu de vos documents du laboratoire.', 'Voir mes documents', documents); if (!isVerre) documents();
  } else if (command.kind === 'greeting') {
    message(`Bonjour ${state.name}, comment allez-vous aujourd’hui ? On peut préparer votre journée ou garder une idée ensemble.`);
  } else if (command.kind === 'error') {
    message(command.text);
  } else {
    const prefix = command.kind === 'help' ? 'Voici les commandes disponibles dans le laboratoire.' : 'Je n’ai pas de commande locale pour cette demande. L’IA n’est pas encore connectée.';
    message(`${prefix} Essayez « montre mes factures », « organise ma journée », « ajoute une tâche appeler le dentiste demain à 14 h pendant 30 minutes » ou « note : préparer mes documents ». Aucun élément n’est créé sans votre validation.`);
  }
}
let chatBusy = false;
function updateChatSend() {
  if (isVerre) $('#chat-form button[type="submit"]').disabled = chatBusy || !$('#chat-input').value.trim();
}
$('#chat-input').addEventListener('input', updateChatSend);
document.querySelectorAll('[data-chat-command], [data-chat-draft]').forEach(button => {
  button.addEventListener('click', () => {
    if (chatBusy) return;
    $('#chat-input').value = button.dataset.chatCommand || button.dataset.chatDraft;
    updateChatSend();
    if (button.dataset.chatCommand) $('#chat-form').requestSubmit();
    else $('#chat-input').focus();
  });
});
updateChatSend();
$('#chat-form').addEventListener('submit', async event => {
  event.preventDefault(); const input = $('#chat-input'); const text = input.value.trim(); if (!text) return;
  if (chatBusy) return;
  message(text, 'user'); input.value = '';
  if (!isVerre) { respondToCommand(text); return; }
  chatBusy = true; updateChatSend();
  const typing = element('div', 'message assistant-message chat-typing');
  typing.append(element('span', 'ai-avatar', 'J'));
  const dots = element('div', 'bubble');
  dots.setAttribute('role', 'status'); dots.setAttribute('aria-label', 'Préparation de la réponse');
  for (let index = 0; index < 3; index++) dots.append(element('i'));
  typing.append(dots); $('#messages').append(typing);
  $('#messages').scrollTop = $('#messages').scrollHeight;
  try {
    await new Promise(resolve => setTimeout(resolve, 550));
    typing.remove(); respondToCommand(text);
  } finally {
    typing.remove(); chatBusy = false; updateChatSend();
  }
});
document.querySelectorAll('[data-nav]').forEach(button => button.addEventListener('click', () => {
  const target = button.dataset.nav;
  if (target === 'chat') { openConversation(); return; }
  if (target === 'profile') { profile(); return; }
  document.querySelectorAll('[data-nav]').forEach(item => { item.classList.remove('active'); item.removeAttribute('aria-current'); });
  button.classList.add('active'); button.setAttribute('aria-current', 'location');
  if (currentRoute !== 'accueil') navigate('accueil');
  const destinations = { home: '#dashboard', chat: '#conversation', javie: '.avatar-stage', tools: '#tools' };
  requestAnimationFrame(() => {
    $(destinations[target]).scrollIntoView({ behavior: 'smooth', block: target === 'home' ? 'start' : 'center' });
    if (target === 'chat') $('#chat-input').focus({ preventScroll: true });
  });
}));
let portraitUrl;
let portraitSelection = 0;
const portrait = $('#portrait-image');
function displayOriginal(url) {
  portrait.src = url;
  portrait.hidden = false;
  $('#portrait-placeholder').hidden = true;
  $('#portrait-frame').classList.add('has-portrait');
  $('.portrait-upload span').textContent = 'Changer mon image originale';
}
function portraitDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('varna-test.original-portrait', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('images');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function saveOriginal(file) {
  const database = await portraitDatabase();
  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction('images', 'readwrite');
      transaction.objectStore('images').put(file, 'original');
      transaction.objectStore('images').put(portrait.dataset.defaultSrc || '', 'baseSource');
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally { database.close(); }
}
async function restoreOriginal() {
  const selection = portraitSelection;
  try {
    const database = await portraitDatabase();
    let file, baseSource;
    try {
      const store = database.transaction('images').objectStore('images');
      const read = key => new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      [file, baseSource] = await Promise.all([read('original'), read('baseSource')]);
    } finally { database.close(); }
    const currentSource = portrait.dataset.defaultSrc || '';
    if (file instanceof Blob && (baseSource || '') === currentSource && selection === portraitSelection) {
      portraitUrl = URL.createObjectURL(file);
      displayOriginal(portraitUrl);
    }
  } catch { /* Original can still be selected when browser storage is unavailable. */ }
}
function syncPortraitScan() {
  if (!portrait.naturalWidth || !portrait.naturalHeight) return;
  const height = 1000 * portrait.naturalHeight / portrait.naturalWidth;
  const scan = $('#portrait-scan');
  scan.setAttribute('viewBox', `0 0 1000 ${height}`);
  scan.style.setProperty('--scan-distance', `${height + 160}px`);
  $('#scan-silhouette').setAttribute('height', String(height));
  $('#scan-source').setAttribute('height', String(height));
  $('#scan-source').setAttribute('href', portrait.currentSrc || portrait.src);
}
portrait.addEventListener('load', () => {
  syncPortraitScan();
  portrait.hidden = false;
  $('#portrait-placeholder').hidden = true;
  $('#portrait-frame').classList.add('has-portrait');
});
portrait.addEventListener('error', () => {
  portrait.hidden = true;
  $('#portrait-placeholder').hidden = false;
  $('#portrait-frame').classList.remove('has-portrait');
});
$('#portrait-file').addEventListener('change', async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 15 * 1024 * 1024) {
    toast('Choisissez une image PNG, JPEG ou WebP de moins de 15 Mo.'); event.target.value = ''; return;
  }
  portraitSelection++;
  const nextUrl = URL.createObjectURL(file);
  const check = new Image();
  try { check.src = nextUrl; await check.decode(); }
  catch { URL.revokeObjectURL(nextUrl); toast('Cette image ne peut pas être ouverte.'); event.target.value = ''; return; }
  if (portraitUrl) URL.revokeObjectURL(portraitUrl);
  portraitUrl = nextUrl;
  displayOriginal(nextUrl);
  try { await saveOriginal(file); toast('Votre image originale est conservée telle quelle dans ce navigateur.'); }
  catch { toast('Votre image est affichée sans retouche pour cette session.'); }
  event.target.value = '';
});
restoreOriginal();
if (portrait.complete) syncPortraitScan();
for (const [selector, count] of [['.mini-wave', 65], ['.voice-wave', 75]]) {
  const wave = $(selector);
  for (let i = 0; i < count; i++) {
    const bar = element('i');
    if (selector === '.voice-wave') {
      bar.style.setProperty('--wave-delay', `${-((i * .173) % 2.4).toFixed(3)}s`);
      bar.style.setProperty('--wave-speed', `${(1.1 + (i % 7) * .16).toFixed(2)}s`);
    }
    const envelope = Math.sin(i / (count - 1) * Math.PI);
    const height = selector === '.mini-wave' ? 3 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * .21)) * 23 * envelope : 6 + Math.abs(Math.sin(i * .91) * Math.cos(i * .17)) * 70 * envelope;
    bar.style.height = `${height}px`; wave.append(bar);
  }
}
$('#day-picker').addEventListener('change', event => setDay(event.target.value));
$('#previous-day').addEventListener('click', () => setDay(shiftDay(selectedDay, -1)));
$('#next-day').addEventListener('click', () => setDay(shiftDay(selectedDay, 1)));
$('#back-today').addEventListener('click', () => setDay(todayKey()));
$('#messages .assistant-message .bubble p').textContent = `Bonjour ${state.name} ✨\nTout commence par un peu de clarté. Voici votre programme de démonstration.`;
pages = createPages({
  getState: () => state, field, selectField, showModal, toast,
  renderBriefing: content => briefing?.renderPage(content), setBriefingDate: day => briefing?.setDate(day), focusBriefingSection: key => briefing?.focusSection(key),
  getDay: () => selectedDay, getView: () => calendarView,
  selectDay: day => { selectedDay = day; }, setDay,
  onView: view => { calendarView = view; }, onRoute: route => { currentRoute = route; },
  refresh: render, element, icon, taskRow, showTaskDetails, addTask, addNote, formatDay, planningBox, planDay, buildBills, closeModal,
  removeNote: id => { if (!window.confirm('Supprimer cette note ?')) return; state.notes = state.notes.filter(note => note.id !== id); save(); render(); toast('Note supprimée du laboratoire.'); },
});
function commitBriefingState(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); state = next; render();
}
briefing = isVerre ? createBriefing({
  element, icon, field, selectField, showModal, closeModal, toast, navigate, formatDay,
  getState: () => ({ ...state, name: state.name || 'Melissa' }), isOpen: () => currentRoute === 'briefing', refresh: render,
  addTask(existing, defaults = {}) {
    const linked = !existing && state.tasks.find(task => !task.cancelled && !task.done && (defaults.sourceBillId && task.sourceBillId === defaults.sourceBillId || defaults.sourceNoteId && task.sourceNoteId === defaults.sourceNoteId && task.kind === (defaults.kind || 'task') || defaults.sourceAppointmentId && task.sourceAppointmentId === defaults.sourceAppointmentId && task.title === defaults.title));
    addTask(existing || linked || null, defaults);
  }, showTaskDetails, removeTask: task => confirmDelete(task, false),
  patchTask(id, patch) {
    const next = { ...state, tasks: state.tasks.map(task => task.id === id || patch.cancelled && task.sourceAppointmentId === id ? normalizeTask({ ...task, ...patch }) : task) };
    try { commitBriefingState(next); } catch { toast('Modification non enregistrée : stockage indisponible.'); throw new Error('Storage unavailable'); }
  },
  patchNote(id, patch) { commitBriefingState({ ...state, notes: state.notes.map(note => note.id === id ? { ...note, ...patch } : note) }); },
  plan(day) { selectedDay = day; const content = showModal('Organiser mon Briefing du jour'); content.append(planningBox(realTasks(state.tasks).filter(task => task.date === day))); },
}) : null;
pages.start();
window.addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY || !event.newValue) return;
  try { const saved = JSON.parse(event.newValue); if (Array.isArray(saved.tasks) && Array.isArray(saved.notes)) { state = { ...state, ...saved, tasks: saved.tasks.map(t => normalizeTask(t)).filter(Boolean) }; render(); } } catch {}
});

// Keep the demonstration's reference dates stable between visits.
save();
