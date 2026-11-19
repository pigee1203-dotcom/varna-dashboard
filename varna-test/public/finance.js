import { readInvoiceMetadata } from './invoice-imports.js';
import { todayKey, validDate } from './planning.js';

const KEY = 'varna-test.finances.v1';
const money = n => n.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' });
const categories = [['Logement', 920, 1000], ['Épicerie', 320, 400], ['Transport', 110, 200], ['Loisirs', 70, 150]];
let marketFilter = 'all';
let data;
try { data = JSON.parse(localStorage.getItem(KEY)); } catch {}
if (!data || !Array.isArray(data.expenses) || !Array.isArray(data.watchlist)) data = { expenses: [], watchlist: [], saving: false };
if (!Array.isArray(data.cards)) data.cards = [];
export function renderFinance(body, tab, options) {
  const { element: el, icon, refresh, formatDay } = options;
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {} refresh(); };
  const btn = (label, action, name = 'secondary-button') => { const b = el('button', name, label); b.type = 'button'; b.onclick = action; return b; };
  const section = (title, sub) => { const s = el('section', 'panel workspace-panel finance-card'); const h = el('div', 'workspace-panel-heading'); h.append(el('h2', '', title)); if (sub) h.append(el('p', '', sub)); s.append(h); return s; };
  const field = (form, label, type = 'text') => { const wrap = el('label', 'finance-field'); wrap.append(el('span', '', label)); const input = el('input'); input.type = type; input.required = true; if (type === 'number') { input.min = '.01'; input.max = '1000000'; input.step = '.01'; } wrap.append(input); form.append(wrap); return input; };
  const appointmentExpenses = (options.getState?.().tasks || []).filter(task => task.kind === 'event' && task.appointment?.confirmed?.expense).map(task => ({ id: `${task.id}:expense`, title: `Rendez-vous — ${task.appointment.expenseEntry?.title || task.title}`, amount: task.appointment.expenseEntry?.amount || task.appointment.options.expense.amount, appointment: true, date: task.appointment.expenseEntry?.date || task.date }));
  const expenseEntries = [...data.expenses, ...appointmentExpenses];
  const totalExtra = expenseEntries.reduce((sum, e) => sum + e.amount, 0), spent = 1420 + totalExtra, budget = 2000;
  const used = Math.round(spent / budget * 100);
  const note = el('p', 'finance-demo-note', 'Démonstration · Vos ajouts sont enregistrés dans ce navigateur. Aucun compte bancaire connecté.'); body.append(note);
  const stats = el('div', 'calendar-stats');
  [['wallet', 'Solde disponible', money(2850 - totalExtra)], ['bill', 'Dépenses du mois', money(spent)], ['bank', 'Épargne totale', money(17000)]].forEach(([name, title, value]) => {
    const card = el('article', 'calendar-stat');
    const details = el('div');
    details.append(el('small', '', title), el('strong', '', value), el('span', '', 'Données de démonstration'));
    card.append(icon(name), details);
    stats.append(card);
  });
  if (tab === 'overview' || tab === 'budget') {
    options.header.append(budgetSummary());
    body.append(stats, paymentCards());
  }
  const go = next => { options.selectTab(next); };
  const due = tab === 'overview' || tab === 'payments' ? section('Rappels de paiement') : null;
  const paymentBadge = el('span', 'finance-payment-count');
  paymentBadge.hidden = true;
  options.paymentTab.append(paymentBadge);
  const paymentList = el('ul', 'finance-payment-reminders');
  const paymentStatus = el('p', 'page-empty', 'Chargement des rappels…');
  const paymentGroups = tab === 'payments' ? el('div', 'finance-payment-groups') : null;
  due?.append(paymentList, paymentStatus);
  function showPaymentReminders(invoices, unavailable = false) {
    const reminders = new Map();
    const tasks = options.getState().tasks;
    const invoicesById = new Map(invoices.map(invoice => [invoice.id, invoice]));
    for (const task of tasks) {
      if (task.kind === 'event' || task.done || task.cancelled) continue;
      const isPayment = task.sourceBillId || task.section === 'payments'
        || task.kind === 'reminder' && /\b(?:payer|paiement|facture)\b/iu.test(task.title);
      if (!isPayment) continue;
      const invoice = invoicesById.get(task.sourceBillId);
      if (invoice?.paymentStatus === 'paid') continue;
      const date = validDate(invoice?.dueDate) ? invoice.dueDate : task.date;
      if (!validDate(date)) continue;
      const key = invoice ? `invoice:${invoice.id}` : `task:${task.id}`;
      reminders.set(key, { title: invoice?.title || task.title, date, amount: invoice?.amount, recurring: invoice?.recurring || task.recurring, label: 'Planifié' });
    }
    for (const invoice of invoices) {
      const key = `invoice:${invoice.id}`;
      if (invoice.paymentStatus === 'paid' || !validDate(invoice.dueDate) || reminders.has(key)) continue;
      reminders.set(key, {
        title: invoice.title || invoice.name,
        date: invoice.dueDate,
        amount: invoice.amount,
        recurring: invoice.recurring,
        label: invoice.paymentStatus === 'unpaid' ? 'Détecté' : 'À vérifier',
      });
    }
    const entries = [...reminders.values()].sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'fr'));
    paymentBadge.hidden = !entries.length;
    paymentBadge.textContent = String(entries.length);
    paymentBadge.setAttribute('aria-label', `${entries.length} rappel(s) de paiement`);
    if (!due) return;
    const today = todayKey();
    const reminderRow = entry => {
      const row = el('li', 'finance-payment-reminder');
      const info = el('div');
      const date = el('time', '', `${formatDay(entry.date)} ${entry.date.slice(0, 4)}`);
      date.dateTime = entry.date;
      const status = entry.date < today ? `${entry.label} · Échéance passée` : entry.label;
      info.append(el('strong', '', entry.title), date, el('small', '', status));
      row.append(icon('bill'), info);
      if (Number.isFinite(entry.amount)) row.append(el('span', '', money(entry.amount)));
      return row;
    };
    paymentList.replaceChildren(...entries.map(reminderRow));
    paymentStatus.hidden = entries.length > 0 && !unavailable;
    paymentStatus.textContent = unavailable ? 'Les échéances des factures sont indisponibles.' : 'Aucun rappel de paiement.';
    if (!paymentGroups) return;

    const month = today.slice(0, 7);
    const groups = [
      ['Paiements récurrents', 'check', entries.filter(entry => entry.recurring)],
      ['Paiements à venir', 'calendar', entries.filter(entry => entry.date >= today)],
      ['À payer ce mois-ci', 'wallet', entries.filter(entry => entry.date.startsWith(month))],
    ];
    paymentGroups.replaceChildren(...groups.map(([title, symbol, items]) => {
      const card = section(title);
      const heading = card.querySelector('h2');
      const count = el('span', 'finance-payment-count', String(items.length));
      count.setAttribute('aria-label', `${items.length} paiement(s)`);
      heading.prepend(icon(symbol));
      heading.append(count);
      if (items.length) {
        const list = el('ul', 'finance-payment-reminders');
        list.append(...items.map(reminderRow));
        card.append(list);
      } else {
        card.append(el('p', 'page-empty', unavailable ? 'Échéances des factures indisponibles.' : 'Aucun paiement.'));
      }
      return card;
    }));
  }
  readInvoiceMetadata().then(
    invoices => { if (body.isConnected) showPaymentReminders(invoices); },
    () => { if (body.isConnected) showPaymentReminders([], true); },
  );
  function paymentCards() {
    const area = el('section', 'finance-payment-cards');
    area.setAttribute('aria-label', 'Mes cartes');
    const list = el('div', 'finance-payment-card-list');
    data.cards.forEach(({ name, lastFour }) => {
      const card = el('article', 'calendar-stat finance-payment-card');
      const details = el('div');
      details.append(el('strong', '', name), el('span', '', `•••• ${lastFour}`));
      card.append(icon('wallet'), details);
      list.append(card);
    });
    const form = el('form', 'finance-form finance-payment-card-form');
    form.id = 'finance-payment-card-form';
    form.hidden = true;
    const name = field(form, 'Nom sur la carte');
    name.maxLength = 80;
    const lastFour = field(form, 'Quatre derniers chiffres');
    lastFour.inputMode = 'numeric';
    lastFour.autocomplete = 'off';
    lastFour.maxLength = 4;
    lastFour.pattern = '[0-9]{4}';
    const submit = el('button', 'primary-button', 'Enregistrer la carte');
    submit.type = 'submit';
    const error = el('p', '', '');
    error.setAttribute('role', 'alert');
    form.append(submit, error);
    form.onsubmit = event => {
      event.preventDefault();
      const cardName = name.value.trim();
      if (!cardName || !/^[0-9]{4}$/.test(lastFour.value)) {
        error.textContent = 'Indique un nom et quatre chiffres.';
        return;
      }
      const next = { ...data, cards: [...data.cards, { name: cardName, lastFour: lastFour.value }] };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        error.textContent = 'Impossible d’enregistrer la carte dans ce navigateur.';
        return;
      }
      data = next;
      refresh();
      document.getElementById('finance-add-payment-card')?.focus();
    };
    const add = btn('', () => {
      form.hidden = !form.hidden;
      add.setAttribute('aria-expanded', String(!form.hidden));
      if (!form.hidden) name.focus();
    }, 'calendar-stat finance-add-payment-card');
    add.id = 'finance-add-payment-card';
    add.append(icon('plus'), el('span', '', 'Ajouter une carte'));
    add.setAttribute('aria-controls', form.id);
    add.setAttribute('aria-expanded', 'false');
    list.append(add);
    area.append(list, form);
    return area;
  }
  function budgetSummary() {
    const s = el('section', 'finance-budget-summary');
    const heading = el('div', 'workspace-panel-heading');
    heading.append(el('h2', '', 'Budget du mois'));
    s.append(heading);
    const layout = el('div', 'finance-budget-layout'), ring = el('div', 'finance-live-ring'); ring.style.setProperty('--used', `${Math.min(100, used)}%`); const center = el('div'); center.append(el('strong', '', `${used} %`), el('span', '', 'du budget mensuel')); ring.append(center);
    const legend = el('div', 'finance-budget-details');
    legend.append(
      el('p', '', `${money(spent)} / ${money(budget)}`),
      el('p', '', spent <= budget ? `${money(budget - spent)} disponibles` : `${money(spent - budget)} au-dessus du budget`),
    );
    layout.append(ring, legend); s.append(layout); return s;
  }
  function budgetCategories() {
    const s = section('Mon budget intelligent', 'Répartition du mois · Démonstration');
    categories.forEach(([name, value, limit], i) => { const row = el('div', 'finance-category'); const top = el('div'); top.append(el('strong', '', name), el('span', '', `${money(value)} / ${money(limit)}`)); const bar = el('div', 'finance-bar'); const fill = el('span'); fill.style.width = `${value / limit * 100}%`; fill.style.setProperty('--bar-color', ['#79caff', '#ad9bf2', '#78d9c2', '#dfa1ed'][i]); bar.append(fill); row.append(top, bar); s.append(row); });
    if (totalExtra) s.append(el('p', 'calendar-guide', `Autres dépenses ajoutées : ${money(totalExtra)}`));
    const foot = el('div', 'finance-split'); foot.append(el('span', '', 'Fixes · 1 050 $'), el('span', '', `Variables · ${money(370 + totalExtra)}`)); s.append(foot); return s;
  }
  function savings() {
    const s = section('Épargne et objectifs', 'Un pas à la fois');
    [['Coussin de sécurité', 17000, 20000], ['Projet personnel', 1250, 5000]].forEach(([title, current, target]) => { const row = el('div', 'finance-category'); const h = el('div'); h.append(el('strong', '', title), el('span', '', `${money(current)} / ${money(target)}`)); const bar = el('div', 'finance-bar'); const fill = el('span'); fill.style.width = `${current / target * 100}%`; bar.append(fill); row.append(h, bar); s.append(row); });
    const toggle = btn(data.saving ? '✓ Simulation activée · 250 $ / mois' : 'Simuler une épargne de 250 $ / mois', () => { data.saving = !data.saving; save(); }); toggle.setAttribute('aria-pressed', String(data.saving)); s.append(toggle, el('p', 'finance-demo-note', 'Simulation locale : aucun virement effectué.')); return s;
  }
  function cashflow() {
    const s = section('Prévisions de trésorerie', 'Projection illustrative sur 30 jours');
    const bars = el('div', 'finance-cashflow'); bars.setAttribute('role', 'img'); bars.setAttribute('aria-label', 'Solde simulé : aujourd’hui 2 850 $, dans 7 jours 2 550 $, dans 14 jours 3 100 $, dans 21 jours 2 900 $, dans 30 jours 3 240 $, avant vos dépenses ajoutées.');
    [2850, 2550, 3100, 2900, 3240].forEach((v, i) => { const col = el('div'); col.append(el('small', '', money(v - totalExtra))); const bar = el('span'); bar.style.height = `${Math.max(5, (v - totalExtra) / 40)}px`; col.append(bar, el('small', '', ['Auj.', '+7 j', '+14 j', '+21 j', '+30 j'][i])); bars.append(col); }); s.append(bars, el('p', 'calendar-guide', `Solde simulé dans 30 jours : ${money(3240 - totalExtra)}`)); return s;
  }
  function expenseForm() {
    const s = section('Ajouter une dépense', 'Ajout local au budget de démonstration'); const form = el('form', 'finance-form'); const title = field(form, 'Description'); title.maxLength = 100; const amount = field(form, 'Montant ($ CAD)', 'number'); const submit = el('button', 'primary-button', 'Enregistrer la dépense'); submit.type = 'submit'; form.append(submit); form.onsubmit = e => { e.preventDefault(); const value = Number(amount.value); if (!title.value.trim() || !Number.isFinite(value) || value <= 0 || value > 1000000) return; data.expenses.push({ id: crypto.randomUUID(), title: title.value.trim(), amount: value }); save(); }; s.append(form);
    const list = el('ul', 'finance-entries'); expenseEntries.forEach(e => { const row = el('li'); row.append(el('span', '', e.title), el('strong', '', money(e.amount))); const remove = btn('×', () => { data.expenses = data.expenses.filter(item => item.id !== e.id); save(); }, 'icon-button'); remove.setAttribute('aria-label', `Retirer la dépense ${e.title}`); if (e.appointment) row.append(el('small', '', `Estimation liée au rendez-vous · ${e.date}`)); else row.append(remove); list.append(row); }); s.append(list); return s;
  }
  function reports() {
    const rows = [['Description', 'Montant CAD'], ...categories.map(([name, amount]) => [name, amount]), ...expenseEntries.map(e => [e.title, e.amount])];
    const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n'); const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })); const link = el('a'); link.href = url; link.download = 'varna-finances-demo.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function marketPanel() {
    const s = section('Bourse et opportunités', 'Pistes de recherche · Pas de conseil d’achat'); s.classList.add('javie-market-panel');
    const watch = el('div', 'market-watch-banner'); const stamp = el('span', 'market-watch-stamp'); stamp.append(icon('spark'), document.createTextNode('Veille marchés · Démonstration'));
    watch.append(stamp, el('p', '', 'Trois secteurs à explorer. Les tendances et graphiques ci-dessous sont illustratifs, sans données de marché en direct.')); s.append(watch);
    const sectors = el('div', 'market-sector-grid');
    [['Solaire', 'À explorer', 'sun', '#80dfb9', '5,23 17,18 29,21 41,12 53,16 65,5', 'Énergie, innovation et perspectives du secteur.'], ['Semi-conducteurs', 'À surveiller', 'chip', '#f0a4c0', '5,6 17,13 29,10 41,20 53,17 65,25', 'Technologies, production et chaînes d’approvisionnement.'], ['Énergie', 'À suivre', 'energy', '#8cbfff', '5,17 17,8 29,23 41,12 53,19 65,14', 'Production, demande et évolution des marchés.']].forEach(([title, status, kind, color, points, text]) => {
      const card = el('article', `market-sector ${kind}`); card.style.setProperty('--sector-color', color);
      const head = el('div', 'market-sector-heading'); const mark = el('span', 'market-sector-icon'); mark.append(icon(kind === 'sun' ? 'spark' : kind === 'chip' ? 'bank' : 'wallet'));
      const heading = el('div'); heading.append(el('h3', '', title), el('span', '', status));
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 70 32'); svg.setAttribute('aria-hidden', 'true'); const path = document.createElementNS(svg.namespaceURI, 'polyline'); path.setAttribute('points', points); path.setAttribute('fill', 'none'); path.setAttribute('stroke', color); path.setAttribute('stroke-width', '2'); svg.append(path);
      head.append(mark, heading, svg); card.append(head, el('p', '', text));
      const details = el('details', 'market-sector-details'); const summary = el('summary', '', 'Risques et sources'); details.append(summary, el('p', '', 'Exemple visuel : aucune recommandation ni actualité vérifiée. Les risques et les sources documentées pourront être affichés ici après connexion des données.')); card.append(details); sectors.append(card);
    }); s.append(sectors);
    data.watchTypes ||= {};
    const filters = el('div', 'finance-market-filters market-filter-buttons'); filters.setAttribute('aria-label', 'Filtrer ma liste de suivi');
    [['all', 'Ma liste de suivi', data.watchlist.length], ['etf', 'FNB / ETF', data.watchlist.filter(v => data.watchTypes[v] === 'etf').length], ['stock', 'Actions', data.watchlist.filter(v => data.watchTypes[v] !== 'etf').length], ['alerts', 'Alertes', null]].forEach(([key, name, count]) => { const b = btn(`${name}${count === null ? '' : ` (${count})`}`, () => { marketFilter = key; refresh(); document.querySelector(`[data-market-filter="${key}"]`)?.focus(); }, 'market-filter-button'); b.dataset.marketFilter = key; b.setAttribute('aria-pressed', String(marketFilter === key)); filters.append(b); }); s.append(filters);
    if (marketFilter === 'alerts') { s.append(el('p', 'calendar-guide', 'Les alertes automatiques ne sont pas connectées. Aucun suivi des cours ni notification de prix n’est actif.')); return s; }
    const form = el('form', 'finance-form'); const symbol = field(form, 'Symbole ou nom à suivre'); symbol.maxLength = 40;
    const wrap = el('label', 'finance-field'); wrap.append(el('span', '', 'Type')); const type = el('select'); [['stock', 'Action'], ['etf', 'FNB / ETF']].forEach(([value, title]) => { const option = el('option', '', title); option.value = value; type.append(option); }); if (marketFilter === 'etf') type.value = 'etf'; wrap.append(type); form.append(wrap);
    const add = el('button', 'primary-button', 'Ajouter à ma liste'); add.type = 'submit'; form.append(add); form.onsubmit = e => { e.preventDefault(); const value = symbol.value.trim().toUpperCase(); if (value && !data.watchlist.includes(value)) { data.watchlist.push(value); data.watchTypes[value] = type.value; save(); } }; s.append(form);
    const entries = data.watchlist.filter(name => marketFilter === 'all' || (data.watchTypes[name] || 'stock') === marketFilter);
    if (!entries.length) s.append(el('p', 'calendar-guide', 'Votre liste est vide ici. Ajoutez un titre à retrouver dans cet espace.'));
    const list = el('ul', 'finance-entries'); entries.forEach(name => { const row = el('li'); row.append(el('strong', '', name), el('span', '', `${data.watchTypes[name] === 'etf' ? 'FNB / ETF' : 'Action'} · Cours non connecté`)); const remove = btn('×', () => { data.watchlist = data.watchlist.filter(v => v !== name); delete data.watchTypes[name]; save(); }, 'icon-button'); remove.setAttribute('aria-label', `Retirer ${name} du suivi`); row.append(remove); list.append(row); }); s.append(list); return s;
  }
  if (tab === 'markets') { body.append(marketPanel()); return; }
  if (tab === 'invoices') {
    const invoices = el('section', 'invoices-page finance-library finance-invoice-library');
    invoices.setAttribute('aria-label', 'Bibliothèque de factures');
    options.buildBills(invoices);
    body.append(invoices);
    return;
  }
  const quick = el('div', 'finance-quick-actions');
  const addExpense = btn('Ajouter une dépense', () => { go('budget'); document.querySelector('.finance-form input')?.focus(); });
  const exportReport = btn('Exporter le rapport', reports);
  addExpense.prepend(icon('plus'));
  exportReport.prepend(icon('arrow'));
  quick.append(addExpense, exportReport);
  if (paymentGroups) {
    const library = el('section', 'invoices-page finance-library finance-payment-library');
    const layout = el('div', 'invoice-library-layout');
    const sidebar = el('aside', 'invoice-library-sidebar finance-actions-menu');
    sidebar.append(el('h2', '', 'Actions'), quick);
    const content = el('div', 'invoice-library-content');
    content.append(paymentGroups, due);
    layout.append(sidebar, content);
    library.append(layout);
    body.append(library);
    return;
  }
  const layout = el('div', 'finance-actions-layout');
  const menu = el('nav', 'finance-actions-menu');
  menu.setAttribute('aria-label', 'Actions financières');
  menu.append(quick);
  layout.append(menu);
  body.append(layout);
  const main = el('div', 'finance-actions-content');
  const grid = el('div', 'finance-dashboard-grid');
  if (tab === 'overview') grid.append(due, budgetCategories(), cashflow(), savings());
  else grid.append(budgetCategories(), expenseForm(), savings(), cashflow());
  main.append(grid);
  if (tab === 'overview') main.append(marketPanel());
  layout.append(main);
}
