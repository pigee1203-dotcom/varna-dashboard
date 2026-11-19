import { readAppointmentFile } from './appointments.js';
import { createFolderIcon } from './folder-icons.js';

const STORAGE_KEY = 'varna-test.document-folders.v1';
let section = 'folder';
export function resetDocumentWorkspace() { section = 'folder'; }
let folders = [];
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (Array.isArray(saved)) folders = saved.filter(item => typeof item?.id === 'string' && typeof item?.name === 'string' && item.name.trim());
} catch {}

export function renderDocumentWorkspace(content, { element: el, icon, refresh, getTasks }) {
  const appointmentDocuments = (getTasks?.() || []).flatMap(task => task.appointment?.confirmed?.documents ? (task.appointment.documents || []).map(document => ({ ...document, kind: 'appointments', appointmentTitle: task.title, detail: `${task.title} · ${task.date}` })) : []);
  const entries = [
    ...appointmentDocuments,
    ...folders.map(folder => ({ ...folder, kind: 'folder', detail: 'Dossier personnel · Vide' })),
  ];
  const layout = el('div', 'task-library-layout');
  const sidebar = el('aside', 'task-library-sidebar');
  sidebar.append(el('h2', '', 'MES SECTIONS'));
  const navigation = el('nav', 'task-sections');
  navigation.setAttribute('aria-label', 'Sections des documents');
  const sections = [['folder', 'Mes dossiers', 'folder'], ['appointments', 'Rendez-vous et ordonnances', 'note'], ['create', 'Créer un dossier', 'plus']];
  function select(value, focus = false) {
    section = value; refresh();
    if (focus) document.getElementById(`document-section-${value}`)?.focus();
  }
  function deleteButton(folder) {
    const button = el('button', 'document-folder-delete');
    button.type = 'button';
    button.title = 'Supprimer le dossier';
    button.setAttribute('aria-label', `Supprimer le dossier « ${folder.name} »`);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7');
    svg.append(path); button.append(svg);
    button.addEventListener('click', () => {
      if (!window.confirm(`Supprimer le dossier « ${folder.name} » ? Cette suppression est définitive.`)) return;
      const next = folders.filter(item => item.id !== folder.id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
      catch {
        let error = main.querySelector('[data-delete-error]');
        if (!error) {
          error = el('p', 'document-folder-error');
          error.dataset.deleteError = '';
          error.setAttribute('role', 'alert');
          header.after(error);
        }
        error.textContent = 'Le navigateur ne peut pas enregistrer la suppression. Votre dossier est conservé. Réessayez.';
        return;
      }
      folders = next;
      select('folder');
      document.getElementById('document-library-title')?.focus();
    });
    return button;
  }
  sections.forEach(([value, name, symbol]) => {
    const button = el('button'); button.type = 'button'; button.id = `document-section-${value}`;
    button.setAttribute('aria-pressed', String(section === value));
    button.setAttribute('aria-controls', 'document-library-content');
    button.append(icon(symbol), el('span', '', name));
    if (value !== 'create') button.append(el('small', '', String(entries.filter(item => value === 'all' || item.kind === value).length)));
    button.addEventListener('click', () => select(value, true)); navigation.append(button);
  });
  const help = el('div', 'task-library-help');
  help.append(el('h3', '', 'Votre espace'), el('p', '', 'Créez vos dossiers pour organiser vos documents : contrat auto, assurance, condo… Vos dossiers sont conservés dans ce navigateur.'));
  sidebar.append(navigation, help);
  const main = el('section', 'task-library-content'); main.id = 'document-library-content';
  const selectedFolder = entries.find(item => item.id === section && item.kind === 'folder');
  const header = el('div', 'task-library-header');
  const title = el('h2', '', selectedFolder?.name || sections.find(([value]) => value === section)?.[1] || 'Mes dossiers');
  title.id = 'document-library-title'; main.setAttribute('aria-labelledby', title.id); header.append(title); main.append(header);
  if (section === 'appointments') {
    main.append(el('p', 'task-library-summary', `${appointmentDocuments.length} document(s) associé(s) aux rendez-vous`));
    const list = el('div', 'document-library-grid');
    appointmentDocuments.forEach(document => {
      const card = el('article', 'document-library-card');
      card.append(icon('note'), el('h3', '', document.name), el('p', '', document.detail));
      const download = el('button', 'secondary-button', 'Télécharger'); download.type = 'button';
      const error = el('p', 'document-folder-error'); error.setAttribute('role', 'alert');
      download.onclick = async () => {
        try {
          const file = await readAppointmentFile(document.id);
          if (!file) throw new Error('Missing file');
          const url = URL.createObjectURL(file); const link = el('a'); link.href = url; link.download = document.name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch { error.textContent = 'Ce fichier n’est pas accessible dans ce navigateur.'; }
      };
      card.append(download, error); list.append(card);
    });
    if (!appointmentDocuments.length) list.append(el('p', 'page-empty', 'Les fichiers confirmés avec un rendez-vous apparaîtront ici.'));
    main.append(list);
  } else if (section === 'create') {
    const form = el('form', 'document-folder-form');
    const label = el('label', '', 'Nom du dossier'); label.htmlFor = 'document-folder-name';
    const input = el('input'); input.id = label.htmlFor; input.required = true; input.maxLength = 80; input.autocomplete = 'off'; input.placeholder = 'Ex. : Contrat auto, Assurance, Documents condo…';
    const error = el('p', 'document-folder-error'); error.id = 'document-folder-error'; error.setAttribute('role', 'alert'); input.setAttribute('aria-describedby', error.id);
    const submit = el('button', 'primary-button', 'Créer le dossier'); submit.type = 'submit';
    const preview = el('div', 'document-folder-preview');
    const previewMark = el('span', 'document-library-mark');
    const previewLabel = el('span');
    function updatePreview() {
      const { svg, label: category } = createFolderIcon(input.value);
      previewMark.replaceChildren(svg);
      previewLabel.textContent = `Icône automatique : ${category}`;
    }
    input.addEventListener('input', updatePreview);
    updatePreview();
    preview.append(previewMark, previewLabel);
    form.append(label, input, preview, error, submit);
    form.addEventListener('submit', event => {
      event.preventDefault(); const name = input.value.trim();
      if (!name) { error.textContent = 'Indiquez un nom pour votre dossier.'; input.focus(); return; }
      if (entries.some(item => item.kind === 'folder' && item.name.toLocaleLowerCase('fr') === name.toLocaleLowerCase('fr'))) { error.textContent = 'Un dossier porte déjà ce nom.'; input.focus(); return; }
      const next = [...folders, { id: crypto.randomUUID(), name }];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
      catch { error.textContent = 'Le navigateur ne peut pas enregistrer ce dossier. Réessayez après avoir libéré du stockage.'; return; }
      folders = next; select('folder'); document.getElementById('document-library-title')?.focus();
    });
    main.append(form);
  } else if (selectedFolder) {
    header.append(deleteButton(selectedFolder));
    const back = el('button', 'secondary-button', '‹ Retour aux dossiers'); back.type = 'button'; back.addEventListener('click', () => select('folder', true));
    main.append(back, el('p', 'page-empty', 'Ce dossier est vide.'));
  } else {
    const items = entries.filter(item => section === 'all' || item.kind === section);
    main.append(el('p', 'task-library-summary', `${items.length} élément${items.length > 1 ? 's' : ''} dans cette section`));
    const grid = el('div', 'document-library-grid');
    items.forEach(item => {
      const pdf = item.kind === 'pdf';
      const card = el('article', pdf ? 'document-card' : 'document-library-card');
      const mark = el('span', pdf ? 'document-mark' : 'document-library-mark');
      if (item.kind === 'folder') {
        const { svg, label } = createFolderIcon(item.name);
        mark.append(svg); mark.setAttribute('role', 'img'); mark.setAttribute('aria-label', label);
      } else mark.append(icon('note'));
      const name = el(item.kind === 'folder' ? 'button' : 'h3', pdf ? '' : 'document-library-name', item.name);
      if (item.kind === 'folder') { name.type = 'button'; name.addEventListener('click', () => { select(item.id); const heading = document.getElementById('document-library-title'); heading?.focus(); }); }
      card.append(mark, name, el('p', '', item.detail));
      if (item.kind === 'folder') card.append(deleteButton(item));
      if (pdf) card.append(el('span', 'subtle-pill', 'PDF'));
      grid.append(card);
    });
    if (!items.length) {
      const empty = el('div', 'page-empty');
      empty.append(el('p', '', 'Vous n’avez pas encore créé de dossier.'));
      const create = el('button', 'secondary-button', '+ Créer mon premier dossier'); create.type = 'button';
      create.addEventListener('click', () => { select('create'); document.getElementById('document-folder-name')?.focus(); });
      empty.append(create); grid.append(empty);
    }
    main.append(grid);
  }
  title.tabIndex = -1;
  layout.append(sidebar, main); content.append(layout);
}
