let section = 'tasks';

export function renderTaskWorkspace(content, options) {
  const { element: el, taskRow, formatDay, refresh, icon } = options;
  const tasks = options.getState().tasks;
  const isReminder = task => Boolean(task.sourceBillId || task.kind === 'event' || task.kind === 'reminder');
  const sections = [
    { id: 'tasks', label: 'Toutes les tâches', icon: 'check', matches: task => !isReminder(task) },
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
  if (add) {
    add.textContent = section === 'reminders' ? '+ Nouveau rappel' : '+ Nouvelle tâche';
    add.onclick = event => {
      event.stopImmediatePropagation();
      options.addTask(null, { kind: section === 'reminders' ? 'reminder' : 'task' });
    };
    header.append(titles, add);
  } else header.append(titles);
  const items = tasks.filter(selected.matches)
    .sort((a, b) => a.date.localeCompare(b.date)
      || (a.time || '99:99').localeCompare(b.time || '99:99'));
  const summary = el('p', 'task-library-summary', `${items.length} élément${items.length > 1 ? 's' : ''} dans cette section`);
  const list = el('ol', 'agenda-list task-work-list');
  items.forEach(task => {
    const row = taskRow(task);
    row.querySelector('.task-metadata').append(el('span', 'home-task-date', formatDay(task.date, true)));
    if (task.description) row.querySelector('.task-open').append(el('small', 'task-work-description', task.description));
    list.append(row);
  });
  if (!items.length) list.append(el('li', 'page-empty', section === 'completed' ? 'Aucun élément terminé pour le moment.' : section === 'reminders' ? 'Aucun rappel pour le moment.' : 'Aucune tâche pour le moment.'));
  panel.append(header, summary, list);
  layout.append(sidebar, panel);
  content.append(layout);
}
