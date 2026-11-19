import { buildBriefing, BRIEFING_SECTIONS, BRIEFING_DEFAULTS, appointmentCategory, endTime } from './briefing-model.js';
import { todayKey, validDate, shiftDay, formatDuration } from './planning.js';
import { routinesForDay, updateRoutine } from './routines.js';
import { readInvoiceMetadata, getInvoiceFile, updateInvoicePayment } from './invoice-imports.js';
import { readAppointmentFile } from './appointments.js';
const PREFS='varna-test.briefing.preferences.v1',SEEN='varna-test.briefing.seen.v1';
export function createBriefing(options) {
  const { element:el,icon,field,selectField,showModal,closeModal,toast,navigate,getState }=options;
  let preferences={...BRIEFING_DEFAULTS},invoices=[],loading=true,loadError='',date=todayKey(),latest=null,reading=false;
  let ignored=[];try{ignored=JSON.parse(localStorage.getItem('varna-test.briefing.ignored.v1')||'[]');}catch{}
  try{const p=JSON.parse(localStorage.getItem(PREFS)||'null');if(p){preferences={...BRIEFING_DEFAULTS,...p};preferences.sections=Array.isArray(p.sections)?p.sections.filter(k=>Object.hasOwn(BRIEFING_SECTIONS,k)):BRIEFING_DEFAULTS.sections;preferences.collapsed=Array.isArray(p.collapsed)?p.collapsed:[];}}catch{}
  const button=(text,action,cls='secondary-button')=>{const b=el('button',cls,text);b.type='button';b.onclick=action;return b;};
  function snapshot(day=date){return buildBriefing({state:getState(),invoices,routines:routinesForDay(day),day,analyses:preferences.analyses,priority:preferences.priority});}
  function stopSpeech(){if('speechSynthesis'in window)window.speechSynthesis.cancel();reading=false;document.querySelector('[data-briefing-speech]')?.replaceChildren(document.createTextNode('Écouter mon briefing'));}
  function focusSection(key){const node=document.getElementById(`briefing-${key}`);if(node){node.open=true;node.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});node.querySelector('summary')?.focus({preventScroll:true});}else if(Object.hasOwn(BRIEFING_SECTIONS,key)){toast('Cette section est désactivée. Vous pouvez la réactiver dans Personnaliser.');}}
  function open(key='',day=todayKey()){stopSpeech();date=validDate(day)?day:todayKey();navigate('briefing',{date,section:key});if(key)requestAnimationFrame(()=>focusSection(key));}
  function renderHome(){
    const card=document.querySelector('.day-overview-panel');if(!card||!document.getElementById('briefing-home-message'))return;
    const b=snapshot(todayKey());
    document.getElementById('briefing-home-date').textContent=options.formatDay(b.day);document.getElementById('briefing-home-date').dateTime=b.day;
    document.getElementById('briefing-home-message').textContent=b.phrase;
    for(const [key,value]of Object.entries({agenda:b.events.length,tasks:b.remaining,payments:b.payments.length,priorities:b.priorities.length}))document.getElementById(`briefing-home-${key}`).textContent=value;
    const next=document.getElementById('briefing-home-next');next.replaceChildren();
    if(b.upcoming){next.append(el('small','','PROCHAIN RENDEZ-VOUS'),el('strong','',`${b.upcoming.time} — ${b.upcoming.title}`),el('span','',appointmentCategory(b.upcoming)));}
    else next.append(el('span','',b.events.length?'Aucun autre rendez-vous à venir aujourd’hui.':'Aucun rendez-vous prévu aujourd’hui.'));
    const priority=document.getElementById('briefing-home-priority');priority.hidden=!b.priorities.length;priority.textContent=b.priorities[0]?`À ne pas oublier : ${b.priorities[0].title}`:'';
  }
  async function reload(){loading=true;loadError='';if(options.isOpen())options.refresh();try{invoices=await readInvoiceMetadata();}catch{loadError='Les factures ne sont pas accessibles dans ce navigateur. Les paiements ne peuvent pas être vérifiés.';}finally{loading=false;renderHome();if(options.isOpen())options.refresh();}}
  function savePreferences(next){localStorage.setItem(PREFS,JSON.stringify(next));preferences=next;}
  function personalize(){
    stopSpeech();const body=showModal('Personnaliser mon Briefing du jour');document.getElementById('modal').dataset.view='appointment';
    const form=el('form'),draft=structuredClone(preferences),all=[...draft.sections,...Object.keys(BRIEFING_SECTIONS).filter(k=>!draft.sections.includes(k))];
    const intro=el('p','modal-copy','Choisissez les sections visibles et leur ordre. Les données restent dans leurs modules d’origine.');
    const list=el('div','briefing-preference-list');
    function rows(){list.replaceChildren();all.forEach((key,i)=>{const row=el('div','briefing-preference-row'),label=el('label');const check=el('input');check.type='checkbox';check.checked=draft.sections.includes(key);check.onchange=()=>{draft.sections=check.checked?[...draft.sections,key]:draft.sections.filter(k=>k!==key);};label.append(check,el('span','',BRIEFING_SECTIONS[key]));const up=button('↑',()=>{[all[i-1],all[i]]=[all[i],all[i-1]];rows();});up.disabled=i===0;up.setAttribute('aria-label',`Monter ${BRIEFING_SECTIONS[key]}`);const down=button('↓',()=>{[all[i+1],all[i]]=[all[i],all[i+1]];rows();});down.disabled=i===all.length-1;down.setAttribute('aria-label',`Descendre ${BRIEFING_SECTIONS[key]}`);row.append(label,up,down);list.append(row);});}rows();
    const detail=selectField('Niveau de détail',{express:'Express — résumé rapide',complete:'Complet — toutes les informations',deep:'Approfondi — analyse et suggestions'},draft.detail);
    const priority=selectField('Ordre des priorités',{urgency:'Urgence puis importance',deadline:'Échéance la plus proche'},draft.priority);
    const frequency=selectField('Préparer le briefing',{demand:'À la demande',morning:'Chaque matin',twice:'Matin et soir (18 h)'},draft.frequency);
    const hour=field('Heure du matin (heure de Toronto)',{type:'time',value:draft.hour});
    const notification=selectField('Notification',{inapp:'Rappel dans VARNA lorsque la page est ouverte',none:'Aucune notification'},draft.notification);
    const analysisLabel=el('label','appointment-toggle'),analysis=el('input');analysis.type='checkbox';analysis.checked=draft.analyses;analysisLabel.append(analysis,el('span','','Activer les suggestions locales de JAVIE'));
    const hint=el('p','modal-hint','Les rappels fonctionnent lorsque cette page est ouverte. Les notifications système, l’exécution en arrière-plan, la météo et la circulation ne sont pas connectées. Vous pouvez réduire une section avec son titre.');
    const error=el('p','appointment-error');error.setAttribute('role','alert');const save=el('button','primary-button','Enregistrer mes préférences');save.type='submit';
    form.append(intro,list,detail.wrapper,priority.wrapper,frequency.wrapper,hour.wrapper,notification.wrapper,analysisLabel,hint,error,save);
    form.onsubmit=e=>{e.preventDefault();try{savePreferences({...draft,sections:all.filter(k=>draft.sections.includes(k)),detail:detail.input.value,priority:priority.input.value,frequency:frequency.input.value,hour:hour.input.value,notification:notification.input.value,analyses:analysis.checked});closeModal();renderHome();options.refresh();}catch{error.textContent='Impossible de conserver les préférences.';}};body.append(form);
  }
  function postpone(item){
    const body=showModal('Reporter cet élément');document.getElementById('modal').dataset.view='appointment';const form=el('form');const day=field('Nouvelle date',{type:'date',value:shiftDay(date,1)});const error=el('p','appointment-error');error.setAttribute('role','alert');const confirm=el('button','primary-button','Confirmer le report');confirm.type='submit';form.append(el('p','modal-copy',item.title),day.wrapper,error,confirm);form.onsubmit=async e=>{e.preventDefault();if(!validDate(day.input.value))return;try{if(item.invoice)await updateInvoicePayment(item.invoice.id,{dueDate:day.input.value});else if(item.routine)updateRoutine(date,item.id,'postpone',day.input.value);else options.patchTask(item.id,{date:day.input.value});closeModal();await reload();options.refresh();}catch{error.textContent='Le report n’a pas pu être enregistré.';}};body.append(form);
  }
  function taskControls(t,{event=false}={}){
    const controls=el('details','briefing-item-actions');controls.append(el('summary','','Actions'));
    controls.append(button('Consulter',()=>options.showTaskDetails(t)),button('Modifier',()=>options.addTask(t)),button('Reporter',()=>postpone(t)));
    if(!t.done){
      if(!event)controls.append(button(t.started?'En cours':'Commencer',()=>{if(confirm(`Commencer « ${t.title} » ?`))options.patchTask(t.id,{started:true});}));
      controls.append(button(event?'Annuler le rendez-vous':'Terminer',()=>{if(confirm(event?`Annuler « ${t.title} » ? Les rappels associés seront également annulés.`:`Marquer « ${t.title} » comme terminé ?`))options.patchTask(t.id,event?{cancelled:true,done:true}:{done:true});}));
    } else if(!event)controls.append(button('Rouvrir',()=>{if(confirm(`Rouvrir « ${t.title} » ?`))options.patchTask(t.id,{done:false});}));
    if(event)controls.append(button('Ajouter un rappel',()=>options.addTask(null,{kind:'reminder',title:`Rappel — ${t.title}`,date:t.date,sourceAppointmentId:t.id})),button('Préparer le déplacement',()=>options.addTask(t)));
    else controls.append(button('Supprimer',()=>options.removeTask(t)));
    return controls;
  }
  async function openFile(id,name,invoice=false){
    try{const file=invoice?(await getInvoiceFile(id))?.blob:await readAppointmentFile(id);if(!file)throw Error();const url=URL.createObjectURL(file);const a=el('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch{toast('Ce fichier n’est pas accessible dans ce navigateur.');}
  }
  function paymentControls(invoice){
    const controls=el('details','briefing-item-actions');controls.append(el('summary','','Actions'));
    controls.append(button('Consulter',()=>openFile(invoice.id,invoice.name,true)),button('Modifier',()=>navigate('factures')),button('Ajouter un rappel',()=>options.addTask(null,{title:`Préparer le paiement — ${invoice.title||invoice.name}`,date:invoice.dueDate,kind:'reminder',sourceBillId:invoice.id})),button('Marquer comme payée',async()=>{if(!confirm(`Confirmer que « ${invoice.title||invoice.name} » a été payée ? Aucun paiement bancaire ne sera effectué.`))return;try{await updateInvoicePayment(invoice.id,{paymentStatus:'paid'});await reload();}catch{toast('Le paiement n’a pas pu être confirmé.');}}));
    return controls;
  }
  function listen(b){
    if(reading){stopSpeech();return;}if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window)){toast('La lecture vocale n’est pas disponible dans ce navigateur.');return;}
    const sections=preferences.sections;
    const parts=[b.summary];
    if(sections.includes('agenda'))parts.push(`Rendez-vous. ${b.events.length?b.events.map(t=>`${t.time||'Heure non précisée'}, ${t.title}`).join('. '):'Aucun rendez-vous.'}`);
    if(sections.includes('priorities'))parts.push(`Priorités. ${b.priorities.slice(0,3).map(p=>p.title).join('. ')||'Aucune priorité identifiée.'}`);
    if(sections.includes('tasks'))parts.push(`Tâches. ${b.remaining} restante(s).`);
    if(sections.includes('payments'))parts.push(`Paiements. ${b.payments.length} facture(s) impayée(s) à échéance.`);
    if(sections.includes('deadlines'))parts.push(`Échéances. ${b.deadlines.length} élément(s) identifié(s) sur trente jours.`);
    parts.push(`Alertes. ${b.conflicts.length} conflit(s) d’horaire, ${b.overdue.length} tâche(s) en retard.`);
    if(sections.includes('suggestions'))parts.push(`Suggestions. ${b.suggestions.map(s=>s.title).join('. ')||'Aucune suggestion supplémentaire.'}`);
    const utterance=new SpeechSynthesisUtterance(parts.join(' '));utterance.lang='fr-CA';utterance.rate=.95;utterance.onend=stopSpeech;utterance.onerror=()=>{stopSpeech();toast('La lecture vocale a été interrompue ou est indisponible.');};reading=true;document.querySelector('[data-briefing-speech]').textContent='Arrêter la lecture';window.speechSynthesis.speak(utterance);
  }
  function renderPage(content){
    const b=latest=snapshot();
    const head=el('section','briefing-intro');
    const greeting=el('article','briefing-greeting panel workspace-panel');
    const portrait=el('div','briefing-portrait');const image=el('img');image.src=document.getElementById('portrait-image')?.getAttribute('src')||'/assets/Portrait holographique bleu électrique futuriste.png';image.alt='JAVIE';portrait.append(image);
    const copy=el('div','briefing-greeting-copy');const hello=el('h2','','Bonjour');if(getState().name){const name=el('span','briefing-greeting-name',getState().name);name.id='briefing-name-neon';hello.append(document.createTextNode(' '),name);}hello.append(document.createTextNode(' !'));copy.append(el('span','briefing-kicker','VOTRE JOURNÉE AVEC JAVIE'),hello,el('p','',b.phrase));
    const fullSummary=el('details','briefing-summary-detail');fullSummary.append(el('summary','','Lire mon résumé personnalisé'),el('p','briefing-summary',b.summary));copy.append(fullSummary);greeting.append(portrait,copy);
    const environment=el('article','briefing-environment panel workspace-panel');
    const weatherPreview=el('div','briefing-environment-cell');weatherPreview.append(icon('sun'),el('strong','','Météo'),el('span','','Service non connecté'));
    const travelPreview=el('div','briefing-environment-cell');
    const departure=getState().tasks.find(t=>t.date===date&&t.appointmentAction==='travel'&&!t.cancelled&&!t.done);
    travelPreview.append(icon('car'),el('strong','',departure?`${departure.duration} min`:'Déplacements'),el('span','',departure?`Départ ${departure.time} · estimation saisie`:'Aucun trajet confirmé'),el('small','','Trafic non connecté'));environment.append(weatherPreview,travelPreview);
    const top=el('div','briefing-welcome-row');top.append(greeting,environment);
    const dateLabel=el('p','briefing-full-date',`${options.formatDay(date)} ${date.slice(0,4)}`);dateLabel.prepend(icon('calendar'));
    document.querySelector('#workspace-actions')?.prepend(dateLabel);
    head.append(top);content.append(head);
    if(loading)content.append(el('p','briefing-status','Actualisation des factures…'));
    if(loadError){const error=el('p','briefing-error',loadError);error.setAttribute('role','alert');error.append(button('Réessayer',reload));content.append(error);}
    const separator=el('hr','briefing-neon-divider');
    content.append(separator);
    const money=n=>n.toLocaleString('fr-CA',{style:'currency',currency:'CAD'});
    const sectionNodes={};
    function section(key){const detail=el('details','briefing-section panel workspace-panel');detail.id=`briefing-${key}`;detail.open=!preferences.collapsed.includes(key)&&preferences.detail!=='express';const title=el('summary');const headings={agenda:'Prochain événement',priorities:`Priorités du jour (${b.priorities.length})`,tasks:`Tâches du jour (${b.todos.length})`,payments:`Paiements à venir (${[...b.latePayments,...b.invoicesDue.filter(i=>i.dueDate>=date&&i.dueDate<=shiftDay(date,7))].length})`,deadlines:'À ne pas oublier',suggestions:'Suggestions de JAVIE'};const symbols={agenda:'calendar',priorities:'spark',tasks:'check',payments:'wallet',deadlines:'clock',suggestions:'spark',routines:'check',documents:'folder',notes:'note',weather:'calendar'};title.append(icon(symbols[key]||'spark'),el('h2','',headings[key]||BRIEFING_SECTIONS[key]));const destinations={agenda:['Voir l’agenda','calendrier'],tasks:['Voir tout','taches'],payments:['Voir tout','banque']};if(destinations[key]){const [label,route]=destinations[key];const link=button(label,e=>navigate(route),'briefing-section-link');link.onclick=event=>{event.preventDefault();event.stopPropagation();navigate(route);};title.append(link);}title.append(el('span','briefing-chevron','⌄'));const body=el('div','briefing-section-body');detail.append(title,body);detail.addEventListener('toggle',()=>{if(!detail.isConnected)return;const collapsed=detail.open?preferences.collapsed.filter(k=>k!==key):[...new Set([...preferences.collapsed,key])];try{savePreferences({...preferences,collapsed});}catch{}});sectionNodes[key]=detail;return body;}
    const empty=(node,text)=>node.append(el('p','briefing-empty',text));
    const row=(title,sub)=>{const r=el('article','briefing-item');r.append(el('h3','',title));if(sub)r.append(el('p','briefing-item-meta',sub));return r;};
    const agenda=section('agenda');agenda.append(button('+ Ajouter un rendez-vous',()=>options.addTask(null,{kind:'event',date})));
    if(!b.events.length)empty(agenda,'Aucun rendez-vous prévu pour cette journée.');
    b.events.filter(t=>!t.done&&!t.cancelled).slice(0,1).forEach(t=>{const a=t.appointment;const r=row(t.title,`${t.time||'Heure non précisée'} — ${endTime(t)} · ${appointmentCategory(t)} · ${t.done?'Terminé':'Prévu'}`);const start=el('time','briefing-agenda-time',t.time||'—');if(t.time)start.dateTime=`${t.date}T${t.time}`;r.prepend(start);if(a?.personName)r.append(el('p','',`Personne concernée : ${a.personName}`));if(a?.place||a?.address)r.append(el('p','',`${a.place||''}${a.address?` · ${a.address}`:''}`));const reminders=getState().tasks.filter(x=>x.sourceAppointmentId===t.id&&!x.done&&!x.cancelled);r.append(el('p','',reminders.length?`${reminders.length} tâche(s) ou rappel(s) associé(s)`:'Aucun rappel associé'));r.append(taskControls(t,{event:true}));agenda.append(r);});
    if(b.conflicts.length){const warning=el('div','briefing-warning');warning.append(el('p','',`${b.conflicts.length} chevauchement(s) d’horaire.`));b.conflicts.forEach(c=>warning.append(el('p','',`${c.left.title} ↔ ${c.right.title}`)));warning.append(button('Examiner une réorganisation',()=>options.plan(date)));agenda.prepend(warning);}
    const priorities=section('priorities');
    const priorityList=el('div');let allPriorities=false;
    function drawPriorities(){priorityList.replaceChildren();(allPriorities?b.priorities:b.priorities.slice(0,3)).forEach(p=>{const r=row(p.title,`${p.origin} · ${p.level==='urgent'?'Urgent':p.level==='high'?'Prioritaire':'À surveiller'} · ${p.date}`);r.append(el('p','',p.reasons.join(' · ')),el('p','',p.action));r.append(p.task?taskControls(p.task):paymentControls(p.invoice));if(p.task)r.querySelector('.briefing-item-actions').append(button('Ajuster la priorité',()=>adjustPriority(p.task)));priorityList.append(r);});}drawPriorities();priorities.append(priorityList);if(!b.priorities.length)empty(priorities,'Aucune priorité identifiée dans les données disponibles.');if(b.priorities.length>3)priorities.append(button('Voir toutes les priorités',()=>{allPriorities=!allPriorities;drawPriorities();}));
    const tasks=section('tasks');
    const groups=[['À faire',b.todos.filter(t=>!t.done&&!t.started)],['En cours',b.todos.filter(t=>!t.done&&t.started)],['Terminées',b.todos.filter(t=>t.done)],['En retard',b.overdue.filter(t=>t.kind==='task'&&!t.sourceBillId)]];
    groups.forEach(([name,items])=>{const group=el('div','briefing-task-group');group.append(el('h3','',`${name} (${items.length})`));items.forEach(t=>{const r=row(t.title,`${t.date} · ${t.time||'À placer'} · ${formatDuration(t.duration)}${t.priority==='high'?' · Prioritaire':''}${t.recurring?' · Récurrente':''}`);const label=el('label','routine-step');const c=el('input');c.type='checkbox';c.checked=t.done;c.setAttribute('aria-label',`Terminer ou rouvrir ${t.title}`);c.onchange=()=>{if(confirm(`${t.done?'Rouvrir':'Terminer'} « ${t.title} » ?`))options.patchTask(t.id,{done:!t.done});else c.checked=t.done;};label.append(c,r.querySelector('h3'));r.prepend(label);r.append(taskControls(t));group.append(r);});if(items.length)tasks.append(group);});if(!b.todos.length&&!b.overdue.length)empty(tasks,'Aucune tâche enregistrée pour cette journée.');
    const routines=section('routines');if(!b.routines.length)empty(routines,'Aucune routine configurée pour cette journée.');
    b.routines.forEach(r=>{const card=row(r.title,`${r.time||'Heure non précisée'} · ${r.done.length}/${r.steps.length} étapes · ${r.complete?'Terminée':r.started?'En cours':'À faire'}`);r.steps.forEach(s=>{const label=el('label','routine-step');const c=el('input');c.type='checkbox';c.checked=r.done.includes(s.id);c.onchange=()=>{try{updateRoutine(date,r.id,'step',s.id);}catch{c.checked=!c.checked;toast('Impossible de conserver cette étape.');}};label.append(c,el('span','',s.title));card.append(label);});const controls=el('div','briefing-item-actions');controls.append(button('Commencer',()=>routineAction(r,'start')),button('Terminer la routine',()=>routineAction(r,'complete')),button('Reporter',()=>postpone({...r,routine:true})),button('Voir les détails',()=>navigate('routines')));card.append(controls);routines.append(card);});
    function routineAction(r,action){if(!confirm(`${action==='start'?'Commencer':'Terminer'} « ${r.title} » ?`))return;try{updateRoutine(date,r.id,action);}catch{toast('La routine n’a pas pu être enregistrée.');}}
    const payments=section('payments');const relevant=[...b.latePayments,...b.invoicesDue.filter(i=>i.dueDate>=date&&i.dueDate<=shiftDay(date,7))];
    relevant.forEach(i=>{const r=row(i.title||i.name,`${Number.isFinite(i.amount)?money(i.amount):'Montant non renseigné'} · ${i.dueDate} · ${i.dueDate<date?'En retard':'Impayée'}${i.recurring?` · ${i.recurring==='monthly'?'Mensuelle':'Annuelle'}`:''}`);r.append(paymentControls(i));payments.append(r);});const unknown=invoices.filter(i=>!i.paymentStatus||i.paymentStatus==='unknown'||!validDate(i.dueDate));if(unknown.length)payments.append(el('p','briefing-warning',`${unknown.length} facture(s) avec statut ou échéance à préciser dans Factures. Elles ne sont pas comptées comme impayées.`));if(!invoices.length)payments.append(el('p','briefing-empty','Importez vos propres factures et renseignez leur échéance et leur statut. Les exemples du laboratoire sont exclus.'));
    const deadlines=section('deadlines'),deadlineList=el('div');
    b.deadlines.forEach(d=>{const r=row(d.title,`${d.origin} · ${d.date}`);r.append(d.invoice?paymentControls(d.invoice):taskControls(d.task));r.append(button('Reporter',()=>postpone(d.invoice?{...d,invoice:d.invoice}:d.task)),button('Ouvrir la fiche d’origine',()=>d.invoice?navigate('factures'):options.showTaskDetails(d.task)));deadlineList.append(r);});deadlines.append(deadlineList);
    const documents=section('documents');b.documents.forEach(d=>{const r=row(d.name,`Associé à : ${d.task.title} · Contenu masqué`);r.append(button('Télécharger pour consulter',()=>openFile(d.id,d.name)),button('Ajouter un rappel',()=>options.addTask(null,{kind:'reminder',title:`Vérifier le document — ${d.name}`,date,sourceAppointmentId:d.task.id})));documents.append(r);});
    const notes=section('notes');if(!b.notes.length)empty(notes,'Aucune note liée à cette journée.');b.notes.forEach(n=>{const r=row(n.pinned?'Note épinglée':'Note du jour','Contenu masqué dans le briefing');const reveal=button('Consulter',()=>{const body=showModal('Ma note');body.append(el('p','modal-copy',n.text));});r.append(reveal,button('Transformer en tâche',()=>options.addTask(null,{title:n.text.slice(0,160),description:n.text,date,sourceNoteId:n.id})),button('Créer un rappel',()=>options.addTask(null,{title:n.text.slice(0,160),date,kind:'reminder',sourceNoteId:n.id})),button('Ajouter un rendez-vous',()=>options.addTask(null,{title:n.text.slice(0,160),date,kind:'event',sourceNoteId:n.id})),button('Associer à une échéance',()=>linkNote(n)));notes.append(r);});
    const weather=section('weather');empty(weather,'Météo et circulation non connectées. Aucune température ni durée de trajet n’est inventée.');const travel=b.events.filter(t=>t.appointment?.options?.travel?.enabled&&t.appointment?.confirmed?.travel);travel.forEach(t=>{const x=getState().tasks.find(x=>x.sourceAppointmentId===t.id&&x.appointmentAction==='travel'&&!x.cancelled);const r=row(`Déplacement — ${t.title}`,x?`Départ prévu : ${x.date} à ${x.time} · Durée saisie par vous : ${x.duration} min`:'Déplacement à vérifier');r.append(el('p','',`Destination : ${t.appointment.address||t.appointment.place||'Non renseignée'}`),button('Vérifier mon estimation',()=>options.addTask(t)));weather.append(r);});if(!travel.length)empty(weather,'Aucun déplacement confirmé pour cette journée.');
    const suggestions=section('suggestions');if(!preferences.analyses)empty(suggestions,'Les suggestions sont désactivées dans vos préférences.');const visible=b.suggestions.filter(s=>!ignored.includes(s.id));if(!visible.length&&preferences.analyses)empty(suggestions,'Aucune suggestion supplémentaire à partir des données disponibles.');visible.forEach(s=>{const r=row(s.title,s.text);r.append(button(s.action,()=>s.plan?options.plan(date):focusSection(s.section)),button('Planifier',()=>s.plan?options.plan(date):focusSection(s.section)),button('Ignorer',()=>{try{ignored=[...new Set([...ignored,s.id])];localStorage.setItem('varna-test.briefing.ignored.v1',JSON.stringify(ignored));options.refresh();}catch{toast('Préférence non enregistrée.');}}));suggestions.append(r);});
    if(b.overdue.length||b.latePayments.length)suggestions.prepend(el('p','briefing-warning',`${b.overdue.length} élément(s) du planning et ${b.latePayments.length} facture(s) en retard à vérifier.`));
    const dashboard=el('div','briefing-dashboard briefing-five-cards');
    const stack=el('div','briefing-column');
    for(const key of ['agenda','tasks','payments','priorities','suggestions']){
      const card=sectionNodes[key];card.open=true;stack.append(card);
    }
    dashboard.append(stack);content.append(dashboard);
    const back=button('Retour à l’accueil',()=>navigate('accueil'),'secondary-button briefing-return');content.append(back);

    if(!preferences.sections.length)content.append(button('Choisir mes sections',personalize));
    if(preferences.detail==='deep'&&preferences.analyses)content.append(el('p','briefing-method','Priorisation locale : importance choisie, retards, échéances financières et préparation associée. Les conséquences et dépendances non renseignées ne sont pas supposées. Aucun solde bancaire n’est déduit.'));
  }
  function adjustPriority(task){
    const body=showModal('Ajuster la priorité');document.getElementById('modal').dataset.view='appointment';const form=el('form');const priority=selectField('Importance définie par vous',{high:'Prioritaire',normal:'Normale',low:'Souple'},task.priority);const confirm=el('button','primary-button','Confirmer la priorité');confirm.type='submit';form.append(priority.wrapper,confirm);form.onsubmit=e=>{e.preventDefault();options.patchTask(task.id,{priority:priority.input.value});closeModal();};body.append(form);
  }
  function linkNote(note){const body=showModal('Associer la note à une échéance');document.getElementById('modal').dataset.view='appointment';const form=el('form');const day=field('Date de l’échéance',{type:'date',value:note.day||date});const err=el('p','appointment-error');const save=el('button','primary-button','Confirmer l’association');save.type='submit';form.append(day.wrapper,err,save);form.onsubmit=e=>{e.preventDefault();try{options.patchNote(note.id,{day:day.input.value});closeModal();options.refresh();}catch{err.textContent='Association non enregistrée.';}};body.append(form);}
  function scheduleCheck(){
    if(preferences.frequency==='demand'||preferences.notification==='none')return;
    const now=new Date(),day=todayKey(now),time=new Intl.DateTimeFormat('en-GB',{timeZone:'America/Toronto',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);const slots=[preferences.hour,...(preferences.frequency==='twice'?['18:00']:[])];
    for(const slot of slots){if(time<slot)continue;const key=`${day}:${slot}`;try{const seen=JSON.parse(localStorage.getItem(SEEN)||'[]');if(seen.includes(key))continue;localStorage.setItem(SEEN,JSON.stringify([...seen.slice(-20),key]));toast('Votre Briefing du jour est prêt. Ouvrez la carte sur l’accueil.');}catch{} }
  }
  document.querySelectorAll('[data-briefing-section]').forEach(node=>node.addEventListener('click',()=>open(node.dataset.briefingSection)));
  const home=document.querySelector('.day-overview-panel');home?.addEventListener('click',e=>{if(e.target.closest('button,a,input'))return;open();});
  window.addEventListener('varna-data-change',()=>{renderHome();if(options.isOpen())options.refresh();reload();});
  window.addEventListener('storage',e=>{if(e.key===PREFS){try{preferences={...BRIEFING_DEFAULTS,...JSON.parse(e.newValue||'{}')};}catch{}}renderHome();if(options.isOpen())options.refresh();});
  setInterval(()=>{scheduleCheck();renderHome();if(options.isOpen()&&!document.getElementById('modal').open&&!document.activeElement?.matches('input,select,textarea,button,summary'))options.refresh();},60000);
  window.addEventListener('hashchange',stopSpeech);document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSpeech();});
  reload();renderHome();
  return {renderHome,renderPage,open,personalize,stopSpeech,setDate(day){if(validDate(day))date=day;},refresh:reload,focusSection};
}
