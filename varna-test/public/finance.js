const KEY = 'varna-test.finances.v1';
const money = n => n.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' });
const categories = [['Logement', 920, 1000], ['Épicerie', 320, 400], ['Transport', 110, 200], ['Loisirs', 70, 150]];
let marketFilter = 'all';
let data;
try { data = JSON.parse(localStorage.getItem(KEY)); } catch {}
if (!data || !Array.isArray(data.expenses) || !Array.isArray(data.watchlist)) data = { expenses: [], watchlist: [], saving: false };
export function renderFinance(body, tab, options) {
  const { element: el, icon, buildBills, refresh, navigate } = options;
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
  [['wallet', 'Solde disponible', money(2850 - totalExtra)], ['bill', 'Dépenses du mois', money(spent)], ['bank', 'Épargne totale', money(17000)]].forEach(([name, title, value]) => { const s = el('article', 'calendar-stat'); s.append(icon(name)); const d = el('div'); d.append(el('small', '', title), el('strong', '', value), el('span', '', 'Données de démonstration')); s.append(d); stats.append(s); });
  if (tab === 'overview' || tab === 'budget') body.append(stats);
  const go = next => { options.selectTab(next); };
  function budgetSummary() {
    const s = section('Budget du mois', `${money(spent)} / ${money(budget)}`);
    const layout = el('div', 'finance-budget-layout'), ring = el('div', 'finance-live-ring'); ring.style.setProperty('--used', `${Math.min(100, used)}%`); const center = el('div'); center.append(el('strong', '', `${used} %`), el('span', '', 'du budget mensuel')); ring.append(center);
    const d = el('div', 'finance-budget-details'); d.append(el('h3', '', spent <= budget ? `${money(budget - spent)} disponibles` : `${money(spent - budget)} au-dessus du budget`), el('p', 'calendar-guide', 'Les dépenses ajoutées mettent à jour votre budget et votre solde de démonstration.')); layout.append(ring, d); s.append(layout); return s;
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
  const quick = el('div', 'finance-quick-actions'); quick.append(btn('+ Ajouter une dépense', () => { go('budget'); document.querySelector('.finance-form input')?.focus(); }), btn('Mes factures', () => navigate('factures')), btn('Paiements et rappels', () => go('payments')), btn('↓ Exporter le rapport', reports)); body.append(quick);
  if (tab === 'payments') { const s = section('Échéances à venir', 'Préparez vos rappels · Aucun paiement bancaire effectué'); buildBills(s); body.append(s); return; }
  body.append(budgetSummary());
  const grid = el('div', 'finance-dashboard-grid');
  if (tab === 'overview') { const due = section('Échéances à venir', 'Vos factures et leurs rappels'); buildBills(due); grid.append(due, budgetCategories(), cashflow(), savings()); }
  else grid.append(budgetCategories(), expenseForm(), savings(), cashflow());
  body.append(grid);
  if (tab === 'overview') body.append(marketPanel());
}
