const DATABASE = 'varna-test.invoices.v1';
const STORE = 'files';
const MAX_SIZE = 20 * 1024 * 1024;
const ALLOWED = /\.(pdf|png|jpe?g|webp|gif|heic|heif)$/i;

function database() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 2);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: 'id' });
      if (!request.result.objectStoreNames.contains('sections')) request.result.createObjectStore('sections', { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function transact(mode, operation, storeName = STORE) {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const request = operation(tx.objectStore(storeName));
      tx.oncomplete = () => { if (mode === 'readwrite') window.dispatchEvent(new CustomEvent('varna-data-change')); resolve(request?.result); };
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Import interrompu'));
    });
  } finally { db.close(); }
}

export async function readInvoiceMetadata() {
  const files = await transact('readonly', store => store.getAll());
  return files.map(({ blob, ...metadata }) => metadata);
}
export async function getInvoiceFile(id) { return transact('readonly', store => store.get(id)); }
export async function updateInvoicePayment(id, patch) {
  const file = await getInvoiceFile(id);
  if (!file) throw new Error('Facture introuvable');
  const allowed = {}; for (const key of ['paymentStatus','dueDate','amount','recurring']) if (Object.hasOwn(patch,key)) allowed[key]=patch[key];
  return transact('readwrite', store => store.put({ ...file, ...allowed }));
}

export function invoiceTitle(name) {
  return name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim() || 'Facture';
}

export function mountInvoiceImports(content, el, icon) {
  const section = el('section', 'invoice-imports');
  const header = el('div', 'invoice-import-header');
  const text = el('div'); text.append(el('h2', '', 'Toutes les factures'), el('p', '', 'PDF ou photo · 20 Mo maximum par fichier'));
  const input = el('input'); input.type = 'file'; input.multiple = true;
  input.accept = '.pdf,.png,.jpg,.jpeg,.webp,.gif,.heic,.heif'; input.hidden = true;
  const upload = el('button', 'primary-button'); upload.type = 'button';
  upload.append(icon('upload'), document.createTextNode('Importer vos factures'));
  upload.onclick = () => input.click(); header.append(text, upload);
  const status = el('p', 'invoice-import-status'); status.setAttribute('role', 'status');
  const folders = el('div', 'invoice-sections');
  folders.setAttribute('aria-label', 'Sections de factures');
  const create = el('form', 'invoice-section-create');
  const sectionName = el('input'); sectionName.placeholder = 'Ex. Maison, Auto, Travail'; sectionName.maxLength = 60; sectionName.required = true; sectionName.setAttribute('aria-label', 'Nom de la nouvelle section');
  const addSection = el('button', 'primary-button', 'Créer'); addSection.type = 'submit';
  create.append(sectionName, addSection);
  let activeSection = '*', sections = [];
  create.onsubmit = async event => {
    event.preventDefault(); const name = sectionName.value.trim(); if (!name) return;
    addSection.disabled = true;
    try {
      const existing = sections.find(section => section.name.toLocaleLowerCase('fr') === name.toLocaleLowerCase('fr'));
      const folder = existing || { id: crypto.randomUUID(), name };
      if (!existing) await transact('readwrite', store => store.put(folder), 'sections');
      activeSection = folder.id; sectionName.value = ''; newSection.open = false; await refresh(); status.textContent = `Section « ${name} » prête.`;
    } catch { status.textContent = 'Impossible de créer la section.'; }
    finally { addSection.disabled = false; }
  };
  const mailInfo = el('div', 'invoice-mail-info');
  const mailHeading = el('div', 'invoice-mail-heading'); mailHeading.append(el('strong', '', 'Depuis mes courriels'), el('span', '', 'À venir'));
  mailInfo.append(mailHeading, el('p', '', 'Vos factures arriveront ici automatiquement, avec un titre.'));
  const sidebar = el('aside', 'invoice-library-sidebar'); sidebar.setAttribute('aria-label', 'Classement des factures');
  const newSection = el('details', 'invoice-new-section');
  newSection.append(el('summary', '', '+ Nouvelle section'), create);
  sidebar.append(el('h2', '', 'Mes sections'), folders, newSection, mailInfo);
  const library = el('div', 'invoice-library-content');
  const layout = el('div', 'invoice-library-layout');
  const summary = el('p', 'invoice-library-summary');
  const list = el('ul', 'invoice-file-list');
  list.setAttribute('aria-label', 'Factures ajoutées');
  library.append(header, status, summary, list);
  layout.append(sidebar, library);
  section.append(input, layout, el('p', 'modal-hint', 'Documents conservés dans ce navigateur.'));
  content.append(section);
  let urls = [];
  function release() { urls.forEach(url => URL.revokeObjectURL(url)); urls = []; }
  const observer = new MutationObserver(() => {
    if (!section.isConnected) { release(); observer.disconnect(); }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  async function refresh() {
    try {
      const [files, savedSections] = await Promise.all([transact('readonly', store => store.getAll()), transact('readonly', store => store.getAll(), 'sections')]);
      sections = savedSections;
      if (!section.isConnected) return;
      release(); list.replaceChildren();
      folders.replaceChildren();
      const groups = [{ id: '*', name: 'Toutes les factures' }, { id: '', name: 'À classer' }, ...sections];
      for (const group of groups) {
        const count = files.filter(file => group.id === '*' || (file.sectionId || '') === group.id).length;
        const button = el('button'); button.append(icon('folder'), el('span', '', group.name), el('small', '', String(count))); button.type = 'button';
        button.setAttribute('aria-pressed', String(activeSection === group.id));
        button.onclick = () => { activeSection = group.id; refresh(); }; folders.append(button);
      }
      const visible = files.filter(file => activeSection === '*' || (file.sectionId || '') === activeSection);
      text.querySelector('h2').textContent = groups.find(group => group.id === activeSection)?.name || 'Toutes les factures';
      summary.textContent = visible.length ? `${visible.length} document${visible.length > 1 ? 's' : ''} dans votre espace` : 'Votre espace factures est prêt';
      if (!visible.length) { list.append(el('li', 'invoice-empty', 'Aucune facture ici. Importez un document ou classez vos factures dans cette section.')); return; }
      visible.sort((a, b) => b.created - a.created).forEach(file => {
        const row = el('li', 'invoice-document-card'); const details = el('div', 'invoice-file-details');
        details.append(el('strong', '', file.title || invoiceTitle(file.name)), el('small', '', `${(file.blob.size / 1024 / 1024).toLocaleString('fr-CA', { maximumFractionDigits: 1 })} Mo · ${new Date(file.created).toLocaleDateString('fr-CA')}`));
        const editor = el('form', 'invoice-card-editor');
        const titleLabel = el('label', '', 'Titre');
        const titleInput = el('input'); titleInput.value = file.title || invoiceTitle(file.name); titleInput.required = true; titleInput.maxLength = 160; titleLabel.append(titleInput);
        const folderLabel = el('label', '', 'Section'); const select = el('select');
        for (const group of [{ id: '', name: 'À classer' }, ...sections]) { const option = el('option', '', group.name); option.value = group.id; select.append(option); }
        select.value = file.sectionId || ''; folderLabel.append(select);
        const save = el('button', '', 'Enregistrer'); save.type = 'submit';
        const dueLabel=el('label','','Échéance (facultatif)'),due=el('input');due.type='date';due.value=file.dueDate||'';dueLabel.append(due);
        const amountLabel=el('label','','Montant connu ($ CAD)'),amount=el('input');amount.type='number';amount.min='.01';amount.max='1000000';amount.step='.01';amount.value=file.amount||'';amountLabel.append(amount);
        const paymentLabel=el('label','','Statut du paiement'),payment=el('select');for(const [value,title] of [['unknown','À vérifier'],['unpaid','Impayée'],['paid','Payée']]){const o=el('option','',title);o.value=value;payment.append(o);}payment.value=file.paymentStatus||'unknown';paymentLabel.append(payment);
        const recurringLabel=el('label','','Récurrence'),recurring=el('select');for(const [value,title]of [['','Non précisée'],['monthly','Mensuelle'],['annual','Annuelle']]){const o=el('option','',title);o.value=value;recurring.append(o);}recurring.value=file.recurring||'';recurringLabel.append(recurring);
        details.append(el('small','',`${file.dueDate?`Échéance : ${file.dueDate} · `:''}${file.paymentStatus==='unpaid'?'Impayée':file.paymentStatus==='paid'?'Payée':'Paiement à vérifier'}`));
        editor.append(titleLabel, folderLabel, dueLabel, amountLabel, paymentLabel, recurringLabel, save);
        editor.onsubmit = async event => {
          event.preventDefault(); const title = titleInput.value.trim(); if (!title) return;
          if (payment.value === 'paid' && file.paymentStatus !== 'paid' && !window.confirm('Confirmer que cette facture a été payée ? Aucun paiement bancaire ne sera effectué.')) return;
          save.disabled = true;
          try { await transact('readwrite', store => store.put({ ...file, title, sectionId: select.value, dueDate:due.value, amount:amount.value?Number(amount.value):null, paymentStatus:payment.value, recurring:recurring.value })); await refresh(); status.textContent = 'Titre et classement enregistrés.'; }
          catch { status.textContent = 'Impossible d’enregistrer les modifications.'; save.disabled = false; }
        };
        const edit = el('details', 'invoice-edit-details'); edit.append(el('summary', '', 'Modifier, classer et préciser le paiement'), editor);
        const actions = el('div', 'invoice-file-actions');
        const url = URL.createObjectURL(file.blob); urls.push(url);
        const preview = el('a', 'invoice-document-preview');
        preview.href = url; preview.target = '_blank'; preview.rel = 'noopener';
        preview.setAttribute('aria-label', `Aperçu de ${file.name}`);
        const isImage = /\.(png|jpe?g|webp|gif)$/i.test(file.name);
        const format = file.name.split('.').pop().toUpperCase();
        if (isImage) {
          const image = el('img'); image.src = url; image.alt = `Aperçu de ${file.name}`; image.loading = 'lazy';
          preview.append(image);
        } else {
          const paper = el('span', 'invoice-document-paper'); paper.append(icon('bill'), el('span', '', format));
          preview.append(paper);
        }
        preview.append(el('span', 'invoice-format-badge', format));
        const open = el('a', 'invoice-open-button', 'Voir la facture'); open.href = url; open.target = '_blank'; open.rel = 'noopener'; open.setAttribute('aria-label', `Ouvrir ${file.name}`);
        const download = el('a', '', 'Télécharger'); download.href = url; download.download = file.name;
        const remove = el('button', '', 'Retirer'); remove.type = 'button'; remove.setAttribute('aria-label', `Retirer ${file.name}`);
        remove.onclick = async () => {
          if (!window.confirm(`Retirer la facture « ${file.title || file.name} » ?`)) return;
          remove.disabled = true;
          try { await transact('readwrite', store => store.delete(file.id)); await refresh(); status.textContent = 'Facture retirée.'; }
          catch { status.textContent = 'Impossible de retirer cette facture.'; remove.disabled = false; }
        };
        actions.append(open, download, remove); row.append(preview, details, edit, actions); list.append(row);
      });
    } catch { status.textContent = 'Le stockage des factures est indisponible dans ce navigateur.'; }
  }
  input.onchange = async () => {
    const selected = [...input.files]; if (!selected.length) return;
    upload.disabled = true; const errors = []; let count = 0;
    for (const file of selected) {
      if (!ALLOWED.test(file.name) || !file.size || file.size > MAX_SIZE) { errors.push(file.name); continue; }
      try {
        await transact('readwrite', store => store.put({ id: crypto.randomUUID(), name: file.name, title: invoiceTitle(file.name), sectionId: activeSection === '*' ? '' : activeSection, blob: file, created: Date.now() })); count++;
      } catch { errors.push(file.name); }
    }
    input.value = ''; upload.disabled = false;
    await refresh();
    status.textContent = `${count} facture${count > 1 ? 's' : ''} importée${count > 1 ? 's' : ''}.${errors.length ? ` Fichiers non importés : ${errors.join(', ')}. Vérifiez le format, la taille ou l’espace de stockage.` : ''}`;
  };
  refresh();
}
