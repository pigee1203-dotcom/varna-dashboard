import { renderRoutinesWorkspace } from './routines.js';
import { renderDocumentWorkspace, resetDocumentWorkspace } from './documents-page.js?v=appointments-37';
import { renderTaskWorkspace } from './tasks-page.js';
import { renderFinance } from './finance.js?v=appointments-37';
import { weekDays, monthDays, shiftMonth } from './calendar.js';
import { todayKey, validDate, shiftDay, tasksForDay, formatDuration, conflictsForDay } from './planning.js';

const ROUTES = {
  briefing: { title: 'Briefing du jour', description: 'Votre journée, organisée intelligemment avec JAVIE.', icon: 'spark', label: 'Briefing du jour' },
  calendrier: { title: 'Mon calendrier', description: 'Une vue claire de votre temps. Une place pour chaque priorité.', icon: 'calendar', label: 'Calendrier' },
  taches: { title: 'Mes tâches et rappels', description: 'Tout ce qu’il ne faut pas oublier.', icon: 'check', label: 'Tâches et rappels' },
  factures: { title: 'Mes factures', description: 'Anticiper les échéances, sans les garder en tête.', icon: 'bill', label: 'Factures' },
  documents: { title: 'Mes documents', description: 'Vos essentiels, organisés et faciles à retrouver.', icon: 'folder', label: 'Documents' },
  notes: { title: 'Mon bloc-notes', description: 'Une idée, un rappel, un peu de place pour penser.', icon: 'note', label: 'Notes' },
  routines: { title: 'Mes routines', description: 'Vos repères pour commencer et terminer la journée.', icon: 'spark', label: 'Routines' },
  banque: { title: 'Mes finances et paiements', description: 'Votre budget, vos échéances et vos paiements au même endroit.', icon: 'bank', label: 'Mes finances et paiements' },
};
const WEEKDAYS = ['LUN.', 'MAR.', 'MER.', 'JEU.', 'VEN.', 'SAM.', 'DIM.'];
export function createPages(options) {
  const { element: el, icon, taskRow, showTaskDetails, addTask, addNote, formatDay } = options;
  const $ = selector => document.querySelector(selector);
  let route = 'accueil';
  let view = options.getView();
  let financeTab = 'overview';
  $('#workspace-page').addEventListener('animationend', event => {
    if (event.target === $('#workspace-page') && event.animationName === 'page-unfold') {
      $('#workspace-page').classList.remove('hologram-opening');
    }
  });
  function syncDate() {
    if (route !== 'calendrier') return;
    const query = new URLSearchParams({ vue: view, date: options.getDay() });
    history.replaceState(null, '', `#/calendrier?${query}`);
  }
  function applyRoute(scroll = false) {
    const previousRoute = route;
    const wasOpen = !$('#workspace-page').hidden;
    const [path, query = ''] = location.hash.replace(/^#\//, '').split('?');
    route = Object.hasOwn(ROUTES, path) ? path : 'accueil';
    if (route === 'documents' && previousRoute !== 'documents') resetDocumentWorkspace();
    if (route === 'calendrier') {
      const params = new URLSearchParams(query);
      if (['agenda', 'day', 'week', 'month'].includes(params.get('vue'))) view = params.get('vue');
      if (validDate(params.get('date'))) options.selectDay(params.get('date'));
      options.onView(view);
    }
    if (route === 'briefing') { const params = new URLSearchParams(query); options.setBriefingDate(params.get('date') || todayKey()); }
    options.onRoute(route);
    const workspaceOpen = route !== 'accueil';
    $('#dashboard').hidden = false;
    $('#dashboard').inert = workspaceOpen;
    document.querySelectorAll('.topbar, .bottom-nav, .lab-footer').forEach(node => { node.inert = workspaceOpen; });
    $('#workspace-page').hidden = route === 'accueil';
    const page = $('#workspace-page');
    page.classList.toggle('hologram-page', workspaceOpen);
    document.body.classList.toggle('calendar-projecting', workspaceOpen);
    if (!workspaceOpen) page.classList.remove('hologram-opening');
    if (workspaceOpen && !wasOpen) {
      // Unfold once on entry; section changes stay inside the same glass.
      page.classList.remove('hologram-opening');
      void page.offsetWidth;
      page.classList.add('hologram-opening');
    }
    if (previousRoute !== route) page.scrollTop = 0;
    document.title = route === 'accueil' ? 'VARNA · Javie — laboratoire' : `${ROUTES[route].label} · Mon espace · VARNA Lab`;
    document.querySelectorAll('[data-nav]').forEach(button => {
      const active = (route === 'accueil' || route === 'briefing') ? button.dataset.nav === 'home' : button.dataset.nav === 'tools';
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'location'); else button.removeAttribute('aria-current');
    });
    options.refresh();
    if (route === 'briefing') { const key = new URLSearchParams(query).get('section'); if (key) requestAnimationFrame(() => options.focusBriefingSection(key)); }
    if (scroll) { window.scrollTo({ top: 0 }); if (route !== 'accueil') $('#workspace-page').focus({ preventScroll: true }); }
  }
  document.addEventListener('keydown', event => {
    if (route === 'accueil' || $('#modal').open) return;
    if (event.key === 'Escape') {
      navigate('accueil');
      document.querySelector('[data-action="calendar"]')?.focus();
    }
    if (event.key === 'Tab') {
      const page = $('#workspace-page');
      const controls = [...page.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex="0"]')].filter(node => node.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === page)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  });
  function navigate(destination, settings = {}) {
    options.closeModal();
    if (settings.date && validDate(settings.date)) options.selectDay(settings.date);
    if (settings.view && ['agenda', 'day', 'week', 'month'].includes(settings.view)) { view = settings.view; options.onView(view); }
    const query = destination === 'briefing' ? `?${new URLSearchParams({ date: settings.date || todayKey(), ...(settings.section ? { section: settings.section } : {}) })}` : destination === 'calendrier' ? `?${new URLSearchParams({ vue: view, date: options.getDay() })}` : '';
    const hash = `#/${destination}${query}`;
    if (location.hash !== hash) history.pushState(null, '', hash);
    applyRoute(true);
  }
  function button(text, className, action) {
    const node = el('button', className, text); node.type = 'button'; node.addEventListener('click', action); return node;
  }
  function panel(title, subtitle) {
    const node = el('section', 'panel workspace-panel');
    if (title) { const heading = el('div', 'workspace-panel-heading'); heading.append(el('h2', '', title)); if (subtitle) heading.append(el('p', '', subtitle)); node.append(heading); }
    return node;
  }
  function tabBar(entries, selected, name, target, onChange) {
    const list = el('div', 'page-tabs'); list.setAttribute('role', 'tablist'); list.setAttribute('aria-label', name);
    entries.forEach(([value, title]) => {
      const tab = button(title, '', () => onChange(value, true));
      tab.id = `${target}-${value}`; tab.setAttribute('role', 'tab'); tab.setAttribute('aria-selected', String(value === selected)); tab.setAttribute('aria-controls', target); tab.tabIndex = value === selected ? 0 : -1;
      tab.addEventListener('keydown', event => {
        const current = entries.findIndex(item => item[0] === value);
        const position = event.key === 'ArrowRight' ? (current + 1) % entries.length : event.key === 'ArrowLeft' ? (current + entries.length - 1) % entries.length : event.key === 'Home' ? 0 : event.key === 'End' ? entries.length - 1 : null;
        if (position !== null) { event.preventDefault(); onChange(entries[position][0], true); }
      }); list.append(tab);
    }); return list;
  }
  function selectView(next, focus = false) {
    if (next === 'agenda') options.selectDay(todayKey());
    view = next; options.onView(view); syncDate(); render();
    if (focus) $(`#calendar-view-${view}`)?.focus();
  }
  function openDay(day) { options.selectDay(day); selectView('week'); options.refresh(); }
  function calendarToolbar() {
    const toolbar = el('div', 'calendar-toolbar');
    const date = view === 'agenda' || view === 'day' ? todayKey() : options.getDay();
    const titles = el('div', 'calendar-period');
    titles.append(el('span', 'eyebrow', 'MON TEMPS, À MON RYTHME'), el('h2', '', new Date(`${date}T12:00:00Z`).toLocaleDateString('fr-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' })));
    if (view === 'agenda' || view === 'day') { toolbar.hidden = true; return toolbar; }
    const navigation = el('div', 'calendar-date-navigation');
    const change = offset => options.setDay(view === 'month' ? shiftMonth(date, offset) : shiftDay(date, offset * (view === 'week' ? 7 : 1)));
    const previous = button('‹', 'icon-button', () => change(-1)); previous.setAttribute('aria-label', 'Période précédente');
    const next = button('›', 'icon-button', () => change(1)); next.setAttribute('aria-label', 'Période suivante');
    const picker = el('label', 'calendar-picker'); picker.append(el('span', 'sr-only', 'Date du calendrier'));
    const input = el('input'); input.type = 'date'; input.value = date; input.required = true; input.addEventListener('change', () => options.setDay(input.value)); picker.append(input);
    navigation.append(button('Aujourd’hui', 'secondary-button', () => options.setDay(todayKey())), previous, picker, next);
    toolbar.append(titles, navigation); return toolbar;
  }
  function monthGrid() {
    const grid = el('div', 'calendar-month-grid');
    grid.style.setProperty('--month-weeks', String(monthDays(options.getDay()).length / 7));
    WEEKDAYS.forEach(title => grid.append(el('div', 'month-weekday', title)));
    const selected = options.getDay();
    monthDays(selected).forEach(day => {
      const tasks = tasksForDay(options.getState().tasks, day);
      const cell = el('article', `month-day${day.slice(0, 7) !== selected.slice(0, 7) ? ' outside' : ''}${day === todayKey() ? ' current' : ''}${day === selected ? ' selected' : ''}`);
      const title = button(String(Number(day.slice(8))), 'month-date', () => openDay(day)); title.setAttribute('aria-label', `Voir ${formatDay(day)}, ${tasks.length} élément${tasks.length > 1 ? 's' : ''}`); cell.append(title);
      tasks.slice(0, 2).forEach(task => {
        const item = button('', `month-event${task.kind === 'event' ? ' appointment' : ''}${task.done ? ' completed' : ''}`, () => showTaskDetails(task)); item.setAttribute('aria-label', `Voir les détails : ${task.title}`); item.title = task.title;
        item.append(el('i', 'event-dot'), el('span', 'event-title', task.title)); cell.append(item);
      });
      if (tasks.length > 2) cell.append(button(`+${tasks.length - 2}`, 'month-more', () => openDay(day)));
      grid.append(cell);
    }); return grid;
  }
  const calendarKinds = [
    ['personal','Personnel','#bd79ff'],['family','Famille','#38caff'],['work','Travail','#41ef9a'],
    ['medical','Rendez-vous médicaux','#ffc65a'],['finance','Finances','#ff71ba'],['deadlines','Échéances & renouvellements','#aebfd2']
  ];
  const displayedCalendars = new Set(calendarKinds.map(([key])=>key));
  function calendarKind(task) {
    if(task.sourceBillId)return 'finance';
    if(/médical|medical|dentiste|médecin|santé/i.test(`${task.title} ${task.appointment?.category||''}`))return 'medical';
    if(task.kind==='reminder')return 'deadlines';
    if(task.calendarCategory && calendarKinds.some(([key])=>key===task.calendarCategory))return task.calendarCategory;
    return 'personal';
  }
  function renderCalendar(content) {
    if(!location.pathname.endsWith('/verre.html'))return renderLegacyCalendar(content);
    const page=$('#workspace-page');page.classList.add('calendar-javie');
    const day=options.getDay(),state=options.getState();
    const visibleTasks=date=>tasksForDay(state.tasks,date).filter(t=>!t.cancelled&&displayedCalendars.has(calendarKind(t)));
    const layout=el('div','javie-calendar-layout');
    const left=el('div','javie-calendar-left');
    const month=panel('','');month.classList.add('javie-month-panel');
    const toolbar=el('div','javie-month-toolbar');
    const previous=button('«','calendar-month-arrow',()=>options.setDay(shiftMonth(day,-1)));previous.setAttribute('aria-label','Mois précédent');
    const next=button('»','calendar-month-arrow',()=>options.setDay(shiftMonth(day,1)));next.setAttribute('aria-label','Mois suivant');
    const monthTitle=el('h2','',new Date(`${day}T12:00:00Z`).toLocaleDateString('fr-CA',{month:'long',year:'numeric',timeZone:'UTC'}));
    const today=button('','javie-today',()=>options.setDay(todayKey()));today.append(icon('calendar'),document.createTextNode('Aujourd’hui'));
    toolbar.append(previous,monthTitle,next,today);month.append(toolbar);
    const grid=el('div','javie-month-grid');grid.setAttribute('aria-label','Choisir une date');
    ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].forEach(label=>grid.append(el('span','javie-weekday',label)));
    monthDays(day).forEach(date=>{
      const tasks=visibleTasks(date),cell=button('','javie-month-day',()=>options.setDay(date));
      cell.classList.toggle('outside',date.slice(0,7)!==day.slice(0,7));cell.classList.toggle('selected',date===day);cell.classList.toggle('today',date===todayKey());
      cell.setAttribute('aria-pressed',String(date===day));cell.setAttribute('aria-label',`${formatDay(date)}, ${tasks.length} élément(s)`);
      cell.append(el('span','javie-day-number',String(Number(date.slice(8)))));
      const marks=el('span','javie-day-marks');tasks.slice(0,3).forEach(task=>{const mark=el('i');mark.style.setProperty('--event-color',calendarKinds.find(([key])=>key===calendarKind(task))[2]);marks.append(mark);});
      cell.append(marks);grid.append(cell);
    });month.append(grid);left.append(month);
    const filters=panel('','');filters.classList.add('javie-calendar-filters');const filterTitle=el('h2');filterTitle.append(icon('folder'),document.createTextNode('Calendriers affichés'));filters.append(filterTitle);
    calendarKinds.forEach(([key,label,color])=>{
      const line=el('label','javie-calendar-filter'),check=el('input');check.type='checkbox';check.checked=displayedCalendars.has(key);check.style.setProperty('--calendar-color',color);
      check.onchange=()=>{if(check.checked)displayedCalendars.add(key);else displayedCalendars.delete(key);render();};line.append(check,el('span','',label));filters.append(line);
    });
    const dayPanel=panel('','');dayPanel.classList.add('javie-day-panel');const title=el('h2','javie-day-title');title.append(icon('calendar'),document.createTextNode(`Journée du ${formatDay(day)}`));dayPanel.append(title,el('h3','javie-calendar-label','Aperçu rapide'));
    const tasks=visibleTasks(day),events=tasks.filter(t=>t.kind==='event'),todos=tasks.filter(t=>t.kind!=='event'&&!t.sourceBillId),payments=tasks.filter(t=>t.sourceBillId),priorities=tasks.filter(t=>t.priority==='high'&&!t.done);
    const stats=el('div','javie-calendar-stats');
    [['calendar',events.length,'Rendez-vous',()=>options.addTask(null,{kind:'event',date:day})],['check',todos.length,'Tâches',()=>navigate('taches')],['wallet',payments.length,'Paiements',()=>navigate('banque')],['spark',priorities.length,'Priorités',()=>navigate('briefing',{date:day,section:'priorities'})]].forEach(([symbol,count,label,action])=>{const stat=button('','javie-calendar-stat',action);stat.append(icon(symbol),el('strong','',String(count)),el('span','',label));stats.append(stat);});dayPanel.append(stats,el('h3','javie-calendar-label','Déroulement de la journée'));
    const timeline=el('ol','javie-day-timeline');
    tasks.forEach(task=>{
      const row=el('li','javie-timeline-item');row.style.setProperty('--event-color',calendarKinds.find(([key])=>key===calendarKind(task))[2]);
      const time=el('time','',task.time||'À placer');if(task.time)time.dateTime=`${day}T${task.time}`;
      const open=button('','javie-timeline-event',()=>showTaskDetails(task));open.append(icon(task.sourceBillId?'wallet':task.kind==='event'?'calendar':'check'));
      const text=el('span','javie-timeline-copy');text.append(el('strong','',task.title));if(task.description||task.duration)text.append(el('small','',task.description||`${task.duration} min`));open.append(text,icon(task.done?'check':'chevron'));row.append(time,open);timeline.append(row);
    });if(!tasks.length)timeline.append(el('li','javie-calendar-empty','Aucun élément prévu. Ajoutez un rendez-vous ou une tâche pour organiser cette journée.'));
    dayPanel.append(timeline);const add=button('Ajouter un élément','javie-calendar-add',()=>options.addTask(null,{date:day}));dayPanel.append(add);const dayColumn=el('div','javie-day-column');dayColumn.append(dayPanel,filters);layout.append(dayColumn,left);content.append(layout);
    const suggestions=panel('','');suggestions.classList.add('javie-calendar-suggestions');const heading=el('h2');heading.append(icon('spark'),document.createTextNode('Suggestions de JAVIE'));const copy=el('div','javie-calendar-suggestion-copy');
    const overlaps=conflictsForDay(tasks,day);copy.append(el('p','',overlaps.length?`${overlaps.length} chevauchement(s) : vérifions vos horaires.`:tasks.length?'Organisons les tâches sans horaire autour de vos rendez-vous.':'Votre journée est libre. Ajoutez vos premières priorités.'));
    const optimize=button('Optimiser ma journée →','javie-calendar-optimize',()=>options.planDay());suggestions.append(heading,copy,optimize);content.append(suggestions);
  }
  function searchAppointments() {
    const content=showModal('Rechercher un rendez-vous');
    const label=el('label','field','Nom, date, lieu ou personne');
    const input=el('input');input.type='search';input.placeholder='Ex. : dentiste, 2026-10, Montréal';input.autocomplete='off';label.append(input);
    const status=el('p','calendar-search-status');status.setAttribute('aria-live','polite');
    const results=el('div','calendar-search-results');
    const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    function update(){
      const words=normalize(input.value).trim().split(/\s+/).filter(Boolean);
      const matches=options.getState().tasks.filter(task=>task.kind==='event').filter(task=>{
        const a=task.appointment||{};
        const haystack=normalize([task.title,task.description,task.date,formatDay(task.date),a.place,a.address,a.personName].join(' '));
        return words.every(word=>haystack.includes(word));
      }).sort((a,b)=>`${b.date} ${b.time||''}`.localeCompare(`${a.date} ${a.time||''}`));
      status.textContent=`${matches.length} rendez-vous trouvé(s) · Toutes les dates, y compris les anciens rendez-vous`;
      results.replaceChildren();
      matches.forEach(task=>{
        const result=button('','calendar-search-result',()=>{options.closeModal();showTaskDetails(task);});
        result.append(el('strong','',task.title),el('span','',`${formatDay(task.date)} ${task.date.slice(0,4)}${task.time?' · '+task.time:''}${task.cancelled?' · Annulé':task.done?' · Terminé':''}`));
        const place=task.appointment?.place||task.appointment?.address;if(place)result.append(el('small','',place));results.append(result);
      });
      if(!matches.length)results.append(el('p','page-empty','Aucun rendez-vous correspondant. Essayez un autre mot ou une autre date.'));
    }
    input.addEventListener('input',update);content.append(label,status,results);update();input.focus();
  }
  function renderLegacyCalendar(content) {
    const day = view === 'agenda' || view === 'day' ? todayKey() : options.getDay(), state = options.getState(), week = weekDays(day);
    const layout = el('div', 'task-library-layout calendar-library-layout');
    const sidebar = el('aside', 'task-library-sidebar');
    sidebar.append(el('h2', '', 'MES VUES'));
    const navigation = el('nav', 'task-sections');
    navigation.setAttribute('aria-label', 'Vues du calendrier');
    const selected = view === 'day' ? 'agenda' : view;
    const entries = [['agenda', 'Jours', 'check'], ['week', 'Semaine', 'calendar'], ['month', 'Mois', 'calendar']];
    entries.forEach(([value, label, symbol]) => {
      const item = button('', '', () => selectView(value, true));
      item.id = `calendar-view-${value}`;
      item.setAttribute('aria-pressed', String(value === selected));
      item.setAttribute('aria-controls', 'calendar-view');
      item.append(icon(symbol), el('span', '', label));
      navigation.append(item);
    });
    const help = el('div', 'task-library-help');
    help.append(el('h3', '', 'Votre temps, en vue'), el('p', '', 'Changez de vue pour parcourir votre planning. Ouvrez un élément pour consulter ses détails.'));
    sidebar.append(navigation, help);
    const main = el('div', 'task-library-content');
    const add = $('#workspace-actions .primary-button');
    if (add) { add.classList.add('calendar-sidebar-add'); sidebar.insertBefore(add, help); }
    main.append(calendarToolbar());
    layout.append(sidebar, main);
    content.append(layout);
    const body = el('section', 'calendar-compact-agenda');
    body.id = 'calendar-view'; body.setAttribute('aria-label', `Calendrier : ${entries.find(([value]) => value === selected)[1]}`);
    if (view === 'month') {
      body.append(monthGrid()); main.append(body); return;
    }
    const days = el('nav', 'calendar-week-strip'); days.setAttribute('aria-label', 'Choisir une journée');
    week.forEach(date => {
      const item = button('', 'calendar-strip-day', () => options.setDay(date));
      item.setAttribute('aria-pressed', String(date === day)); item.setAttribute('aria-label', formatDay(date));
      item.append(el('span', '', new Date(`${date}T12:00:00Z`).toLocaleDateString('fr-CA', { weekday: 'short', timeZone: 'UTC' })), el('strong', '', String(Number(date.slice(8)))));
      if (state.tasks.some(task => task.date === date && !task.done)) item.append(el('i', 'calendar-strip-dot'));
      days.append(item);
    });
    if (view === 'week') body.append(days);
    const visibleDays = view === 'week' ? week.filter(date => state.tasks.some(task => task.date === date)) : [day];
    visibleDays.forEach(date => {
      const tasks = tasksForDay(state.tasks, date);
      const heading = el('div', 'calendar-agenda-heading'); heading.append(el('h2', '', `${formatDay(date)} ${date.slice(0, 4)}`), el('span', '', `${tasks.length} élément${tasks.length > 1 ? 's' : ''}`));
      const list = el('ol', 'agenda-list calendar-compact-list'); tasks.forEach(task => list.append(taskRow(task, showTaskDetails)));
      if (!tasks.length) list.append(el('li', 'agenda-empty', 'Rien de prévu pour cette journée.'));
      body.append(heading, list);
    });
    if (!visibleDays.length) body.append(el('p', 'agenda-empty', 'Rien de prévu pour cette semaine.'));
    main.append(body);
  }
  function renderTasks(content) {
    renderTaskWorkspace(content, { ...options, refresh: render, tabBar });
  }
  function renderNotes(content) {
    const notes = options.getState().notes, card = panel('Mes idées à portée de main', `${notes.length} note${notes.length > 1 ? 's' : ''}`);
    const grid = el('div', 'full-notes-grid');
    notes.forEach(note => { const article = el('article', 'note-item'); article.append(el('p', '', note.text), el('small', '', new Date(note.date).toLocaleDateString('fr-CA', { day: 'numeric', month: 'long' }))); const remove = button('', 'icon-button', () => options.removeNote(note.id)); remove.setAttribute('aria-label', `Supprimer la note : ${note.text.slice(0, 40)}`); remove.append(icon('close')); article.append(remove); grid.append(article); });
    if (!notes.length) grid.append(el('p', 'page-empty', 'Une page libre pour vos idées. Ajoutez une première note pour commencer.'));
    card.append(grid); content.append(card);
  }
  function renderDocuments(content) {
    renderDocumentWorkspace(content, { element: el, icon, refresh: render, getTasks: () => options.getState().tasks });
  }

  function renderBank(content) {
    const header = el('div', 'finance-section-heading');
    header.append(el('span', 'eyebrow', 'MON ESPACE FINANCIER'), el('h2', '', 'Mes finances et paiements'), el('p', '', 'Un regard sur le mois, une place pour chaque échéance.'));
    content.append(header);
    const tabs = tabBar([['overview', 'Vue d’ensemble'], ['payments', 'Paiements'], ['invoices', 'Factures'], ['budget', 'Budget'], ['markets', 'Bourse']], financeTab, 'Mes finances et paiements', 'finance-view', (next, focus) => {
      if (next === 'invoices') { navigate('factures'); return; }
      financeTab = next; render(); if (focus) $(`#finance-view-${next}`)?.focus();
    });
    tabs.classList.add('finance-tabs');
    const symbols = ['bank', 'calendar', 'bill', 'wallet', 'spark'];
    [...tabs.children].forEach((tab, index) => tab.prepend(icon(symbols[index])));
    content.append(tabs);
    const body = el('div', 'finance-tab-content'); body.id = 'finance-view'; body.setAttribute('role', 'tabpanel'); body.setAttribute('aria-labelledby', `finance-view-${financeTab}`); body.tabIndex = 0;
    content.append(body);
    renderFinance(body, financeTab, {
      element: el, icon, buildBills: options.buildBills, refresh: render, navigate, getState: options.getState,
      selectTab(next) { financeTab = next; render(); $(`#finance-view-${next}`)?.focus(); },
    });
  }

  function renderRoutines(content) { renderRoutinesWorkspace(content, { ...options, refresh: options.refresh }); }
  function render() {
    if (route === 'accueil') return;
    const settings = ROUTES[route];
    const tasksOnly = route === 'taches';
    $('#workspace-page').classList.toggle('briefing-page', route === 'briefing');
    $('#workspace-page').classList.toggle('tasks-only', tasksOnly);
    $('#workspace-page').classList.toggle('invoices-page', route === 'factures');
    $('#workspace-page').classList.toggle('documents-page', route === 'documents');
    $('#workspace-page').classList.toggle('calendar-compact', route === 'calendrier');
    $('#workspace-page').classList.toggle('calendar-javie', route === 'calendrier' && location.pathname.endsWith('/verre.html'));
    $('#workspace-page').classList.toggle('calendar-month-view', route === 'calendrier' && view === 'month');
    $('#workspace-title').textContent = tasksOnly ? 'Mes tâches et rappels' : settings.title;
    $('.workspace-breadcrumb').hidden = true;
    $('#workspace-section-label').hidden = true;
    $('#workspace-section-label').textContent = settings.label;
    $('#workspace-description').textContent = settings.description;
    $('#workspace-breadcrumb-title').textContent = settings.label;
    const navigation = $('#workspace-navigation'); navigation.replaceChildren();
    navigation.hidden = true;
    Object.entries(ROUTES).filter(([key]) => key !== 'briefing').forEach(([key, definition]) => { const link = el('a', 'workspace-section'); link.href = `#/${key}`; if (key === route) link.setAttribute('aria-current', 'page'); link.append(icon(definition.icon), document.createTextNode(definition.label)); navigation.append(link); });
    const actions = $('#workspace-actions'); actions.replaceChildren();
    if (route === 'calendrier') {
      actions.append(button('Recherche', 'secondary-button calendar-search-button', searchAppointments),button('+ Ajouter un rendez-vous', 'primary-button', () => addTask(null, { date: options.getDay(), kind: 'event' })));
    }
    else if (route === 'taches') {
      const add = el('button', 'primary-button', '+ Nouvelle tâche');
      add.type = 'button'; actions.append(add);
    }
    else if (route === 'notes') actions.append(button('+ Nouvelle note', 'primary-button', () => addNote()));
    else if (route !== 'factures' && route !== 'documents' && route !== 'briefing') actions.append(el('span', 'workspace-local', 'APERÇU LOCAL'));
    const close = button('Fermer ×', 'secondary-button', () => navigate('accueil'));
    close.setAttribute('aria-label', 'Fermer mon espace et revenir à l’accueil');
    actions.append(close);
    const content = $('#workspace-content'); content.replaceChildren();
    if (route === 'briefing') options.renderBriefing(content);
    else if (route === 'calendrier') renderCalendar(content);
    else if (route === 'taches') renderTasks(content);
    else if (route === 'factures') options.buildBills(content);
    else if (route === 'notes') renderNotes(content);
    else if (route === 'routines') renderRoutines(content);
    else if (route === 'documents') renderDocuments(content);
    else if (route === 'banque') renderBank(content);

  }
  return { navigate, render, syncDate, start() { window.addEventListener('hashchange', () => applyRoute(true)); $('.skip').addEventListener('click', event => { event.preventDefault(); const target = route === 'accueil' ? $('#dashboard') : $('#workspace-page'); target.setAttribute('tabindex', '-1'); target.focus(); target.scrollIntoView({ block: 'start' }); }); applyRoute(false); }, get view() { return view; } };
}
