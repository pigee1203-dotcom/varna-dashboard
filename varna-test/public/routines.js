import { todayKey } from './planning.js';
const KEY = 'varna-test.routines.v2';
function read() {
  try { const value = JSON.parse(localStorage.getItem(KEY)); if (value && Array.isArray(value.definitions) && value.logs) return value; } catch {}
  const data = { definitions:[], logs:{} };
  try {
    const legacy = JSON.parse(localStorage.getItem('varna-test.routines.v1') || '{}');
    for (const [key, done] of Object.entries(legacy)) {
      const day = key.slice(0,10), title = key.slice(11); if (!/^\d{4}-\d{2}-\d{2}:/.test(key) || !title) continue;
      let def = data.definitions.find(r=>r.title===title);
      if (!def) { def = { id:`legacy-${data.definitions.length}`,title,time:'',days:[0,1,2,3,4,5,6],steps:[{id:'step',title:'Routine terminée'}] }; data.definitions.push(def); }
      data.logs[`${day}:${def.id}`] = { done:done?['step']:[],started:false };
    }
  } catch {}
  return data;
}
function write(data) { localStorage.setItem(KEY,JSON.stringify(data)); window.dispatchEvent(new CustomEvent('varna-data-change')); }
export function routinesForDay(day=todayKey()) {
  const data=read(), weekday=new Date(`${day}T12:00:00Z`).getUTCDay();
  return data.definitions.filter(r=> r.days.includes(weekday) || Object.entries(data.logs).some(([key,log])=>key.endsWith(`:${r.id}`)&&log.postponedTo===day)).filter(r=>!data.logs[`${day}:${r.id}`]?.postponedTo).map(r=>{
    const log=data.logs[`${day}:${r.id}`]||{done:[],started:false};
    return {...r,done:log.done||[],started:log.started===true,complete:r.steps.length>0&&r.steps.every(s=>log.done?.includes(s.id))};
  });
}
export function updateRoutine(day,id,action,step) {
  const data=read(),r=data.definitions.find(r=>r.id===id); if(!r) throw Error('Routine introuvable');
  const key=`${day}:${id}`,log=data.logs[key]||{done:[],started:false};
  if(action==='start') log.started=true;
  if(action==='step') {log.started=true;log.done=log.done.includes(step)?log.done.filter(s=>s!==step):[...log.done,step];}
  if(action==='complete') {log.started=true;log.done=r.steps.map(s=>s.id);}
  if(action==='postpone') log.postponedTo=step;
  data.logs[key]=log;write(data);
}
export function renderRoutinesWorkspace(content, options) {
  const {element:el,field,showModal,closeModal,refresh,toast}=options;
  const day=options.getDay?.()||todayKey();
  const button=(text,action)=>{const b=el('button','secondary-button',text);b.type='button';b.onclick=action;return b;};
  content.append(button('+ Ajouter une routine',()=>{
    const body=showModal('Ajouter une routine');document.getElementById('modal').dataset.view='appointment';
    const form=el('form');const title=field('Nom de la routine');const time=field('Heure prévue (facultatif)',{type:'time',required:false});const steps=field('Étapes — une par ligne',{type:'textarea',maxLength:2000});
    const days=el('fieldset','routine-days');days.append(el('legend','','Jours prévus'));const checks=[];
    ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'].forEach((name,i)=>{const label=el('label');const c=el('input');c.type='checkbox';c.checked=true;checks.push(c);label.append(c,el('span','',name));days.append(label);});
    const error=el('p','appointment-error');error.setAttribute('role','alert');const save=el('button','primary-button','Confirmer la routine');save.type='submit';
    form.append(title.wrapper,time.wrapper,steps.wrapper,days,error,save);form.onsubmit=e=>{e.preventDefault();const names=steps.input.value.split('\n').map(s=>s.trim()).filter(Boolean);const selected=checks.flatMap((c,i)=>c.checked?[i]:[]);if(!title.input.value.trim()||!names.length||!selected.length){error.textContent='Précisez le nom, au moins une étape et un jour.';return;}try{const data=read();data.definitions.push({id:crypto.randomUUID(),title:title.input.value.trim(),time:time.input.value,days:selected,steps:names.map(title=>({id:crypto.randomUUID(),title}))});write(data);closeModal();refresh();}catch{error.textContent='Impossible de conserver cette routine dans le navigateur.';}};body.append(form);
  }));
  const routines=routinesForDay(day);if(!routines.length)content.append(el('p','page-empty','Aucune routine prévue pour cette journée. Ajoutez vos propres habitudes.'));
  routines.forEach(r=>{const card=el('section','panel workspace-panel briefing-item');card.append(el('h3','',r.title),el('p','',`${r.time||'Heure non précisée'} · ${r.done.length}/${r.steps.length} étapes`));
    r.steps.forEach(step=>{const label=el('label','routine-step');const c=el('input');c.type='checkbox';c.checked=r.done.includes(step.id);c.onchange=()=>{try{updateRoutine(day,r.id,'step',step.id);refresh();}catch{c.checked=!c.checked;toast('Stockage indisponible.');}};label.append(c,el('span','',step.title));card.append(label);});content.append(card);});
}
