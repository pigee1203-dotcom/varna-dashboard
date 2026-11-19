import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBriefing, unpaidInvoices, BRIEFING_SECTIONS } from '../public/briefing-model.js';
import { normalizeTask } from '../public/planning.js';
const day='2026-11-20', now=new Date('2026-11-20T15:00:00Z'); // 10:00 in Toronto.
const task=(id,extra={})=>normalizeTask({id,title:id,date:day,time:'',duration:30,...extra});
const build=(tasks=[],invoices=[],extra={})=>buildBriefing({state:{name:'Alex',tasks,notes:[]},invoices,day,now,...extra});

test('briefing uses actual records and excludes demonstration data and unknown payments',()=>{
 const result=build([task('demo-1'),task('fake-reminder',{sourceBillId:'hydro'}),task('actual')],[{id:'unknown',dueDate:day,amount:90},{id:'paid',dueDate:day,paymentStatus:'paid',amount:80},{id:'unpaid',dueDate:day,paymentStatus:'unpaid',amount:25}]);
 assert.equal(result.todos.length,1);assert.equal(result.todos[0].id,'actual');assert.equal(result.payments.length,1);assert.equal(result.payments[0].amount,25);assert.equal(result.summary.includes('1 facture'),true);
 assert.deepEqual(unpaidInvoices([{paymentStatus:'unpaid',dueDate:'2026-02-30'}]),[]);
});
test('upcoming event is an appointment later today, not a task or past appointment',()=>{
 const b=build([task('earlier',{kind:'event',time:'09:00'}),task('todo',{time:'10:15'}),task('next',{kind:'event',time:'10:30'}),task('cancelled',{kind:'event',time:'10:10',cancelled:true})]);
 assert.equal(b.upcoming.id,'next');assert.equal(b.events.length,2);
 const late=build([task('past',{kind:'event',time:'08:00'})]);assert.equal(late.upcoming,undefined);
});
test('priorities explain real importance and overdue dates without inventing consequences',()=>{
 const b=build([task('normal'),task('high',{priority:'high'}),task('late',{date:'2026-11-19'})],[{id:'bill',title:'Électricité',dueDate:'2026-11-19',paymentStatus:'unpaid'}]);
 assert.equal(b.priorities.length,3);assert.equal(b.priorities[0].kind,'invoice');assert.equal(b.urgent,2);assert.equal(b.priorities.find(p=>p.id==='high').reasons.includes('Importance définie par vous'),true);
 assert.equal(b.priorities.some(p=>p.id==='normal'),false);
});
test('conflicts and overload produce local suggestions only when analyses are enabled',()=>{
 const items=[task('one',{time:'09:00',duration:300}),task('two',{time:'10:00',duration:300})];
 assert.equal(build(items).conflicts.length,1);assert.equal(build(items).suggestions.some(s=>s.plan),true);
 const disabled=build(items,[],{analyses:false});assert.equal(disabled.suggestions.length,0);assert.equal(disabled.conflicts.length,1);
});
test('only relevant appointment documents and date-linked notes are included',()=>{
 const event=task('event',{kind:'event',appointment:{category:'medical',confirmed:{documents:true},documents:[{id:'file',name:'Ordonnance.pdf'}],options:{}}});
 const state={name:'Alex',tasks:[event],notes:[{id:'today',day,text:'secret',date:now.toISOString()},{id:'past',day:'2026-01-01',text:'hidden',date:'2026-01-01T12:00:00Z'},{id:'pin',pinned:true,text:'private',date:'2026-01-01T12:00:00Z'}]};
 const b=buildBriefing({state,day,now});assert.equal(b.documents.length,1);assert.deepEqual(b.notes.map(n=>n.id),['today','pin']);assert.equal(b.summary.includes('secret'),false);
});
test('deadlines use source identities and no duplicate invoice rows',()=>{
 const b=build([task('reminder',{kind:'reminder'})],[{id:'invoice',paymentStatus:'unpaid',dueDate:day}]);
 assert.equal(b.deadlines.length,2);assert.equal(new Set(b.deadlines.map(d=>d.id)).size,2);assert.equal(b.deadlines[0].invoice?.id==='invoice'||b.deadlines[1].invoice?.id==='invoice',true);
 assert.equal(Object.keys(BRIEFING_SECTIONS).includes('weather'),true);
});
test('started state, cancellation and source links persist through task normalization',()=>{
 const t=normalizeTask(task('started',{started:true,cancelled:true,sourceNoteId:'note',deadline:day,dependsOn:['other']}));
 assert.equal(t.started,true);assert.equal(t.cancelled,true);assert.equal(t.sourceNoteId,'note');assert.deepEqual(t.dependsOn,['other']);
});
