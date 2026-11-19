import { APPOINTMENT_CATEGORIES, appointmentProposals, validateAppointment, saveAppointmentFiles } from './appointments.js';
import { minutesOf, shiftDay, conflictsForDay } from './planning.js';

export function openAppointmentForm(options, existing = null, defaults = {}) {
  const { element: el, icon, field, selectField, showModal, closeModal, selectedDay, getTasks, commit, remove } = options;
  const modal = document.getElementById('modal');
  const stored = existing?.appointment;
  const form = el('form', 'appointment-form');
  const intro = el('p', 'modal-copy', 'Choisissez d’abord la catégorie. JAVIE vous proposera ensuite les actions à confirmer.');
  const categoryGrid = el('div', 'appointment-categories'); categoryGrid.setAttribute('role', 'group'); categoryGrid.setAttribute('aria-label', 'Catégorie du rendez-vous');
  const categoryButtons = new Map();
  let category = stored?.category || '', details = {}, files = [];
  const body = el('div'); body.hidden = !category;
  const title = field('Titre du rendez-vous', { value: existing?.title || defaults.title || '', placeholder: 'Ex. Consultation annuelle' });
  const date = field('Date', { type: 'date', value: existing?.date || defaults.date || selectedDay });
  const time = field('Heure de début', { type: 'time', value: existing?.time || defaults.time || '' });
  const durationMode = selectField('Fin du rendez-vous', { duration: 'Durée estimée', end: 'Heure de fin' }, 'duration');
  const duration = field('Durée estimée (minutes)', { type: 'number', value: String(existing?.duration || defaults.duration || 30) }); duration.input.min = 5; duration.input.max = 480; duration.input.step = 5;
  const end = field('Heure de fin', { type: 'time', required: false }); end.wrapper.hidden = true; end.input.disabled = true;
  if (existing?.time) { const n = minutesOf(existing.time) + existing.duration; if (n < 1440) end.input.value = `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`; }
  durationMode.input.onchange = () => { const ending = durationMode.input.value === 'end'; end.wrapper.hidden = !ending; end.input.disabled = !ending; end.input.required = ending; duration.wrapper.hidden = ending; duration.input.disabled = ending; duration.input.required = !ending; };
  function grid(...fields) { const g = el('div', 'field-grid'); fields.forEach(f => g.append(f.wrapper)); return g; }
  const adaptive = el('section', 'appointment-adaptive');
  const opts = stored?.options || {};
  function option(label, key, fields, old = {}) {
    const box = el('section', 'appointment-option');
    const toggle = el('label', 'appointment-toggle'); const check = el('input'); check.type = 'checkbox'; check.checked = Boolean(old.enabled);
    toggle.append(check, el('span', '', label)); const region = el('fieldset', 'appointment-option-fields'); region.hidden = !check.checked; region.disabled = !check.checked;
    fields.forEach(f => region.append(f.wrapper)); check.onchange = () => { region.hidden = !check.checked; region.disabled = !check.checked; };
    box.append(toggle, region); box.dataset.option = key; return { box, check, fields };
  }
  const followDate = field('Me rappeler de prendre le suivi le', { type: 'date', value: opts.followup?.date || shiftDay(date.input.value, 30) });
  const followText = field('Précisions pour le suivi (facultatif)', { required: false, value: opts.followup?.text || '' });
  const followup = option('Me rappeler de prendre un rendez-vous de suivi', 'followup', [followDate, followText], opts.followup);
  const upload = field('Documents et ordonnances (PDF ou images, 10 Mo par fichier)', { type: 'file', required: false }); upload.input.multiple = true; upload.input.accept = 'application/pdf,image/png,image/jpeg,image/webp';
  const docNote = el('p', 'modal-hint', 'Fichiers conservés dans ce navigateur. Ils apparaîtront dans Documents après votre confirmation.');
  const documents = option('Ajouter des documents et ordonnances', 'documents', [upload], opts.documents); documents.box.lastChild.append(docNote);
  if (stored?.documents?.length) documents.box.lastChild.append(el('p', 'modal-copy', `Déjà associés : ${stored.documents.map(d => d.name).join(', ')}`));
  const prepDate = field('Date du rappel de préparation', { type: 'date', value: opts.preparation?.date || shiftDay(date.input.value, -1) });
  const prepText = field('Que faut-il préparer ?', { type: 'textarea', value: opts.preparation?.text || '', placeholder: 'Ex. Préparer la liste de mes questions', maxLength: 1000 });
  const preparation = option('Créer un rappel de préparation', 'preparation', [prepDate, prepText], opts.preparation);
  const origin = field('Point de départ', { value: opts.travel?.origin || '', placeholder: 'Ex. Maison, adresse de départ' });
  const travelMinutes = field('Durée estimée du trajet (minutes)', { type: 'number', value: String(opts.travel?.minutes || 30) }); travelMinutes.input.min = 5; travelMinutes.input.max = 480; travelMinutes.input.step = 1;
  const mode = selectField('Mode de déplacement', { car: 'Voiture', transit: 'Transport en commun', walk: 'À pied', bike: 'Vélo', other: 'Autre' }, opts.travel?.mode || 'car');
  const travel = option('Prévoir le déplacement', 'travel', [origin, travelMinutes, mode], opts.travel);
  travel.box.lastChild.append(el('p', 'modal-hint', 'JAVIE calcule l’heure de départ à partir de votre estimation. Aucun itinéraire en direct.'));
  const amount = field('Dépense estimée ($ CAD)', { type: 'number', value: opts.expense?.amount ? String(opts.expense.amount) : '' }); amount.input.min = '.01'; amount.input.max = 1000000; amount.input.step = '.01';
  const expense = option('Prévoir une dépense dans Finances et paiements', 'expense', [amount], opts.expense);
  let previousDate = date.input.value;
  date.input.addEventListener('change', () => {
    if (!date.input.value) return;
    if (!stored && followDate.input.value === shiftDay(previousDate, 30)) followDate.input.value = shiftDay(date.input.value, 30);
    if (!stored && prepDate.input.value === shiftDay(previousDate, -1)) prepDate.input.value = shiftDay(date.input.value, -1);
    previousDate = date.input.value;
  });
  body.append(title.wrapper, adaptive, grid(date, time), durationMode.wrapper, duration.wrapper, end.wrapper, el('h3', 'appointment-section-title', 'Suivi et préparation'), followup.box, documents.box, preparation.box, travel.box, expense.box);
  const error = el('p', 'appointment-error'); error.setAttribute('role', 'alert');
  const warning = el('p', 'planning-warning'); warning.hidden = true; warning.setAttribute('role', 'status');
  const footer = el('div', 'form-actions');
  const cancel = el('button', 'secondary-button', 'Annuler'); cancel.type = 'button'; cancel.onclick = closeModal;
  const next = el('button', 'primary-button', 'Continuer avec JAVIE'); next.type = 'submit'; next.disabled = !category; footer.append(cancel, next);
  form.append(intro, categoryGrid, body, warning, error, footer);
  if (existing) { const del = el('button', 'delete-task', 'Supprimer ce rendez-vous'); del.type = 'button'; del.onclick = () => remove(existing); form.append(del); }
  function openForm() { const content = showModal(existing ? 'Modifier mon rendez-vous' : 'Ajouter un rendez-vous'); modal.dataset.view = 'appointment'; content.append(form); modal.scrollTop = 0; (category ? title.input : categoryButtons.values().next().value)?.focus({ preventScroll: true }); }
  function categoryFields(value) {
    category = value; const config = APPOINTMENT_CATEGORIES[value];
    categoryButtons.forEach((button, key) => button.setAttribute('aria-pressed', String(key === value)));
    adaptive.replaceChildren(); details = {};
    const initial = value === stored?.category ? stored : {};
    function add(key, label, optional = true, type = 'text') { const f = field(label, { required: !optional, type, value: initial[key] || '', maxLength: key === 'reason' ? 2000 : 200 }); details[key] = f; adaptive.append(f.wrapper); return f; }
    details.type = selectField('Type de rendez-vous', Object.fromEntries(config.types.map(t => [t, t])), initial.type || config.types[0]); adaptive.append(details.type.wrapper);
    const custom = add('customType', 'Précisez le type de rendez-vous', false); custom.wrapper.hidden = details.type.input.value !== 'Autre'; custom.input.disabled = custom.wrapper.hidden;
    details.type.input.onchange = () => { custom.wrapper.hidden = details.type.input.value !== 'Autre'; custom.input.disabled = custom.wrapper.hidden; };
    if (config.person) {
      details.person = selectField('Personne concernée', { self: 'Moi-même', child: 'Enfant', partner: 'Conjoint(e)', relative: 'Proche', other: 'Autre personne' }, initial.person || 'self'); adaptive.append(details.person.wrapper);
      const name = add('personName', 'Nom de la personne concernée', false); name.wrapper.hidden = details.person.input.value === 'self'; name.input.disabled = name.wrapper.hidden;
      details.person.input.onchange = () => { name.wrapper.hidden = details.person.input.value === 'self'; name.input.disabled = name.wrapper.hidden; };
    }
    add('provider', config.provider); add('place', config.place); add('address', 'Adresse (facultatif)'); add('phone', 'Téléphone (facultatif)', true, 'tel');
    if (value === 'professional') add('meetingUrl', 'Lien de visioconférence (facultatif)', true, 'url');
    if (config.extra) add(...config.extra);
    add('reason', config.reason, true, 'textarea');
    body.hidden = false; next.disabled = false;
  }
  Object.entries(APPOINTMENT_CATEGORIES).forEach(([key, config]) => {
    const button = el('button', 'appointment-category'); button.type = 'button'; button.setAttribute('aria-pressed', 'false');
    button.append(icon(config.icon === 'tools' ? 'wallet' : config.icon), el('strong', '', config.label), el('small', '', config.types.slice(0, 3).join(' · ')));
    button.onclick = () => { if (category !== key) categoryFields(key); };
    categoryButtons.set(key, button); categoryGrid.append(button);
  });
  if (category) categoryFields(category);
  function draft() {
    const appointment = { category, documents: stored?.documents || [], options: {}, confirmed: { ...(stored?.confirmed || {}) }, expenseEntry: stored?.expenseEntry || null };
    Object.entries(details).forEach(([key, f]) => { appointment[key] = f.input.disabled ? '' : f.input.value.trim(); });
    appointment.options = {
      followup: { enabled: followup.check.checked, date: followDate.input.value, text: followText.input.value.trim() },
      documents: { enabled: documents.check.checked },
      preparation: { enabled: preparation.check.checked, date: prepDate.input.value, text: prepText.input.value.trim() },
      travel: { enabled: travel.check.checked, origin: origin.input.value.trim(), minutes: Number(travelMinutes.input.value), mode: mode.input.options[mode.input.selectedIndex].text },
      expense: { enabled: expense.check.checked, amount: Number(amount.input.value) },
    };
    return { id: existing?.id || crypto.randomUUID(), title: title.input.value.trim(), date: date.input.value, time: time.input.value, duration: durationMode.input.value === 'end' ? minutesOf(end.input.value) - minutesOf(time.input.value) : Number(duration.input.value), kind: 'event', sourceNoteId: existing?.sourceNoteId || defaults.sourceNoteId || '', priority: existing?.priority || 'normal', done: existing?.done || false, description: appointment.reason, appointment };
  }
  function updateWarning() {
    if (!category || !date.input.value || !time.input.value) return;
    const event = draft(); const overlaps = conflictsForDay([...getTasks().filter(t => t.id !== event.id), event], event.date);
    warning.hidden = !overlaps.some(pair => pair.left.id === event.id || pair.right.id === event.id);
    warning.textContent = 'Ce rendez-vous chevauche un autre élément de votre agenda. Vérifiez les horaires avant de confirmer.';
  }
  form.addEventListener('input', updateWarning); form.addEventListener('change', updateWarning);
  form.onsubmit = event => {
    event.preventDefault(); error.textContent = '';
    const candidate = draft(); const invalid = validateAppointment(candidate);
    if (invalid) { error.textContent = invalid; return; }
    if (!candidate.appointment.place && !candidate.appointment.address && !candidate.appointment.meetingUrl) {
      error.textContent = 'Indiquez le lieu, l’adresse ou le lien du rendez-vous.'; return;
    }
    files = documents.check.checked ? [...upload.input.files] : [];
    if (files.length > 10 || files.some(f => f.size > 10 * 1024 * 1024 || !['application/pdf', 'image/png', 'image/jpeg', 'image/webp'].includes(f.type))) { error.textContent = 'Choisissez au plus 10 fichiers PDF, PNG, JPEG ou WebP, de 10 Mo maximum chacun.'; return; }
    if (documents.check.checked && !files.length && !stored?.documents?.length) { error.textContent = 'Choisissez au moins un document ou désactivez cette option.'; return; }
    const additions = files.map(file => ({ id: `${candidate.id}/${crypto.randomUUID()}`, file }));
    candidate.appointment.documents = [...(stored?.documents || []), ...additions.map(({ id, file }) => ({ id, name: file.name, type: file.type }))];
    const content = showModal('Les propositions de JAVIE'); modal.dataset.view = 'appointment';
    content.append(el('p', 'modal-copy', 'Vérifiez votre rendez-vous et choisissez les actions à créer. Rien n’est ajouté avant votre confirmation.'));
    const summary = el('section', 'appointment-review');
    summary.append(el('h3', '', candidate.title), el('p', '', `${APPOINTMENT_CATEGORIES[category].label} · ${candidate.date} à ${candidate.time} · ${candidate.duration} min`));
    if (candidate.appointment.personName) summary.append(el('p', '', `Pour : ${candidate.appointment.personName}`));
    for (const key of ['provider', 'place', 'address', 'phone', 'meetingUrl', 'vehicle', 'reason']) if (candidate.appointment[key]) summary.append(el('p', '', candidate.appointment[key]));
    content.append(summary);
    if (!warning.hidden) content.append(el('p', 'planning-warning', warning.textContent));
    const proposals = appointmentProposals(candidate); const choices = [];
    if (proposals.length) content.append(el('h3', 'appointment-section-title', 'À confirmer avec JAVIE'));
    proposals.forEach(proposal => { const label = el('label', 'appointment-proposal'); const check = el('input'); check.type = 'checkbox'; label.append(check, el('span', '', proposal.label)); content.append(label); choices.push({ proposal, check }); });
    if (!proposals.length) content.append(el('p', 'modal-copy', 'Aucune action associée demandée. Seul le rendez-vous sera enregistré.'));
    content.append(el('p', 'modal-hint', 'Rappels dans l’agenda local, sans notification externe. Les propositions sont préparées à partir de vos informations ; aucune IA distante n’est connectée. Une dépense estimée n’effectue aucun paiement.'));
    const saveError = el('p', 'appointment-error'); saveError.setAttribute('role', 'alert'); content.append(saveError);
    const controls = el('div', 'form-actions'); const back = el('button', 'secondary-button', 'Modifier'); back.type = 'button'; back.onclick = openForm;
    const confirm = el('button', 'primary-button', 'Confirmer le rendez-vous'); confirm.type = 'button';
    confirm.onclick = async () => {
      confirm.disabled = true; back.disabled = true; saveError.textContent = '';
      try {
        const selected = choices.filter(c => c.check.checked).map(c => c.proposal);
        const acceptsDocuments = selected.some(p => p.key === 'documents');
        if (acceptsDocuments) await saveAppointmentFiles(additions);
        else candidate.appointment.documents = stored?.documents || [];
        selected.forEach(p => { candidate.appointment.confirmed[p.key] = true; });
        if (selected.some(p => p.key === 'expense')) candidate.appointment.expenseEntry = { amount: candidate.appointment.options.expense.amount, date: candidate.date, title: candidate.title };
        await commit(candidate, selected);
      } catch { saveError.textContent = 'Enregistrement impossible dans ce navigateur. Le rendez-vous n’a pas été ajouté. Libérez du stockage puis réessayez.'; confirm.disabled = false; back.disabled = false; }
    };
    controls.append(back, confirm); content.append(controls);
    modal.scrollTop = 0; const heading = document.getElementById('modal-title'); heading.tabIndex = -1; heading.focus({ preventScroll: true });
  };
  openForm();
}
