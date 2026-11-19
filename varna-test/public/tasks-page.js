import { shiftDay, todayKey } from './planning.js';

let section = 'tasks';
let dueFilter = '';

export function renderTaskWorkspace(content, options) {
  const { element: el, taskRow, refresh, icon } = options;
  const tasks = options.getState().tasks.filter(task => task.kind !== 'event' && !task.cancelled);
  const isReminder = task => Boolean(task.sourceBillId || task.kind === 'reminder');
  const sections = [
    { id: 'tasks', label: 'Tâches', icon: 'check', matches: task => !isReminder(task) },
    { id: 'reminders', label: 'Rappels', icon: 'calendar', matches: isReminder },
    { id: 'completed', label: 'Terminés', icon: 'folder', matches: task => task.done },
  ];
  const selected = sections.find(item => item.id === section);
  const layout = el('div', 'task-library-layout');
  const sidebar = el('aside', 'task-library-sidebar');
  sidebar.append(el('h2', '', 'MES SECTIONS'));
  const navigation = el('nav', 'task-sections');
  navigation.setAttribute('aria-label', 'Sections des tâches');
  sections.forEach(item => {
    const button = el('button');
    button.type = 'button';
    button.id = `task-section-${item.id}`;
    button.setAttribute('aria-pressed', String(section === item.id));
    button.setAttribute('aria-controls', 'task-library-content');
    button.append(icon(item.icon), el('span', '', item.label), el('small', '', String(tasks.filter(item.matches).length)));
    button.addEventListener('click', () => {
      section = item.id;
      refresh();
      document.getElementById(`task-section-${section}`)?.focus();
    });
    navigation.append(button);
  });
  const help = el('div', 'task-library-help');
  help.append(el('h3', '', 'À votre rythme'), el('p', '', 'Ouvrez une tâche pour la modifier. Cochez-la une fois terminée : vous la retrouverez dans « Terminés ».'));
  sidebar.append(navigation, help);
  const panel = el('section', 'task-library-content');
  panel.id = 'task-library-content';
  panel.setAttribute('aria-labelledby', 'task-library-title');
  const header = el('div', 'task-library-header');
  const titles = el('div');
  const title = el('h2', '', selected.label);
  title.id = 'task-library-title';
  titles.append(title, el('p', '', section === 'completed' ? 'Vos tâches et rappels déjà accomplis.' : 'Vos priorités, organisées par date.'));
  const add = document.querySelector('#workspace-actions .primary-button');
  let tasksForFilter = tasks;
  if (add) {
    add.textContent = section === 'reminders' ? '+ Nouveau rappel' : '+ Nouvelle tâche';
    add.onclick = event => {
      event.stopImmediatePropagation();
      options.addTask(null, { kind: section === 'reminders' ? 'reminder' : 'task' });
    };
    const actions = el('div', 'task-library-actions');
    const today = todayKey();
    const tomorrow = shiftDay(today, 1);
    const weekday = new Date(`${today}T12:00:00Z`).getUTCDay();
    const weekStart = shiftDay(today, -((weekday + 6) % 7));
    const weekEnd = shiftDay(weekStart, 6);
    const filters = [
      ['today', 'Aujourd’hui'],
      ['tomorrow', 'Demain'],
      ['week', 'Cette semaine'],
    ];
    filters.forEach(([key, label]) => {
      const pill = el('button', 'task-due-pill', label);
      pill.id = `task-due-${key}`;
      pill.type = 'button';
      pill.setAttribute('aria-pressed', String(dueFilter === key));
      pill.onclick = () => {
        dueFilter = dueFilter === key ? '' : key;
        refresh();
        document.getElementById(pill.id)?.focus();
      };
      actions.append(pill);
    });
    actions.append(add);
    header.append(titles, actions);
    tasksForFilter = tasksForFilter.filter(task => {
      if (dueFilter === 'today') return task.date === today;
      if (dueFilter === 'tomorrow') return task.date === tomorrow;
      if (dueFilter === 'week') return task.date >= weekStart && task.date <= weekEnd;
      return true;
    });
  } else header.append(titles);
  const items = tasksForFilter.filter(selected.matches)
    .sort((a, b) => a.date.localeCompare(b.date));
  const summary = el('p', 'task-library-summary', `${items.length} élément${items.length > 1 ? 's' : ''} dans cette section`);
  const list = el('ol', 'agenda-list task-work-list');
  items.forEach(task => {
    const row = taskRow(task);
    if (task.description) row.querySelector('.task-open').append(el('small', 'task-work-description', task.description));
    list.append(row);
  });
  if (!items.length) list.append(el('li', 'page-empty', section === 'completed' ? 'Aucun élément terminé pour le moment.' : section === 'reminders' ? 'Aucun rappel pour le moment.' : 'Aucune tâche pour le moment.'));
  panel.append(header, summary, list);
  layout.append(sidebar, panel);
  content.append(layout);
}
