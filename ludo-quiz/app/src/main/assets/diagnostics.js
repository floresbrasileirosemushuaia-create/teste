/* Ludo Quiz v1.0.7: private on-device telemetry, copied only on request. */
window.LudoDiag=(function(){
 'use strict';
 const VERSION='1.0.8';
 const LOG_KEY='ludo_quiz_diagnostic_events_107';
 let events=[],initialized=false;
 try{const saved=JSON.parse(localStorage.getItem(LOG_KEY)||'[]');if(Array.isArray(saved))events=saved.slice(-200);}catch(e){}
 function snapshot(game){
  if(!game)return null;
  return {turn:game.turn,current:game.current,currentName:game.players?.[game.current]?.name||null,phase:game.phase,rolled:game.rolled,theme:game.theme||'general',facing:game.facing,winner:game.winner,
    players:(game.players||[]).map(p=>({name:p.name,color:p.color,pieces:[...p.pieces],correct:p.correct,wrong:p.wrong,skipsLeft:p.skipsLeft,cardsLeft:p.cardsLeft,hasPhoto:!!p.photo})),
    pendingMove:game.pendingMove||null,lastCapture:game.lastCapture||null,lastQ:[...(game.lastQ||[])]};
 }
 function log(kind,detail){
  const record={at:new Date().toISOString(),kind,detail:detail||{}};
  events.push(record);if(events.length>200)events=events.slice(-200);
  try{localStorage.setItem(LOG_KEY,JSON.stringify(events));}catch(e){}
 }
 function auditMove(before,after,move){
  const expected=new Set([move.playerIndex+':'+move.pieceIndex,...move.captures.map(v=>v.playerIndex+':'+v.pieceIndex)]);
  const differences=[];const anomalies=[];
  for(let i=0;i<(before?.players||[]).length;i++){
   for(let j=0;j<4;j++){
    const previous=before.players[i].pieces[j],current=after.players[i].pieces[j];
    if(previous===current)continue;
    const item={playerIndex:i,pieceIndex:j,from:previous,to:current};differences.push(item);
    if(!expected.has(i+':'+j))anomalies.push(item);
    if(current===-1&&previous>=0&&!move.captures.some(c=>c.playerIndex===i&&c.pieceIndex===j))anomalies.push({...item,reason:'unexpected-return-to-base'});
   }
  }
  log('move',{turn:after.turn,actor:move.player,playerIndex:move.playerIndex,pieceIndex:move.pieceIndex,from:move.from,to:move.to,dice:move.dice,changes:differences,captures:move.captures,anomalies});
  if(anomalies.length)log('ALERT-unexpected-piece-change',{before,after:snapshot(after),move,anomalies});
 }
 function captureText(c,lang){
  const captured=(c.victims||[]).map(v=>lang==='es'?('ficha '+v.piece+' de '+v.player):('peça '+v.piece+' de '+v.player)).join(', ');
  return lang==='es'?(c.actor+' capturó '+captured+' en la casilla '+c.tile+' (no segura). La ficha volvió a la base.'):(c.actor+' capturou '+captured+' na casa '+c.tile+' (não segura). A peça voltou à base.');
 }
 function diagnostic(game,question,lang){
  let localSave=null;try{localSave=JSON.parse(localStorage.getItem('ludo_quiz_game_v1')||'null');}catch(e){localSave={error:String(e)};}
  return JSON.stringify({app:'Ludo Quiz',version:VERSION,created:new Date().toISOString(),device:{userAgent:navigator.userAgent,language:navigator.language,screen:{width:innerWidth,height:innerHeight,pixelRatio:devicePixelRatio},online:navigator.onLine},language:lang,soundEnabled:(()=>{try{return localStorage.getItem('ludo_quiz_fx_sound_v1')!=='off';}catch(e){return null;}})(),theme:game?.theme||null,game:snapshot(game),savedGame:snapshot(localSave),currentQuestion:question?{ix:question.ix,order:question.order,category:question.category,text:question.text,choices:question.choices,selected:question.selected,correct:question.correct,isCorrect:question.isCorrect,cardValue:question.cardValue||null,eliminated:question.hidden||[]}:null,events:events.slice(-200)},null,2);
 }
 function manualCopy(text,lang){
  const div=document.createElement('div');div.className='diagManual';
  const inner=document.createElement('div');inner.className='diagManualInner';
  const title=document.createElement('strong');title.textContent=lang==='es'?'Selecciona y copia el diagnóstico':'Selecione e copie o diagnóstico';
  const area=document.createElement('textarea');area.readOnly=true;area.value=text;
  const close=document.createElement('button');close.className='primary';close.textContent=lang==='es'?'CERRAR':'FECHAR';close.addEventListener('click',()=>div.remove());
  inner.append(title,area,close);div.append(inner);document.body.append(div);area.focus();area.select();
 }
 async function copy(game,question,lang,status){
  const text=diagnostic(game,question,lang);let success=false;
  if(navigator.clipboard&&navigator.clipboard.writeText){try{await navigator.clipboard.writeText(text);success=true;}catch(e){}}
  if(!success){const area=document.createElement('textarea');area.value=text;area.setAttribute('readonly','');area.style.cssText='position:fixed;left:0;top:0;width:2px;height:2px;opacity:.01;z-index:1000';document.body.append(area);area.focus();area.select();try{success=document.execCommand('copy');}catch(e){}area.remove();}
  if(status)status.textContent=success?(lang==='es'?'¡Diagnóstico copiado!':'Diagnóstico copiado!'):(lang==='es'?'Selecciona el texto para copiar.':'Selecione o texto para copiar.');
  if(!success)manualCopy(text,lang);
  log('diagnostic-copy',{success,bytes:text.length});return success;
 }
 function bindCopyButton(button,getGame,getQuestion,getLang,status){
  if(!button)return;
  button.addEventListener('click',()=>{void copy(getGame(),getQuestion(),getLang(),status);});
 }
 function init(){
  if(initialized)return;initialized=true;
  window.addEventListener('error',e=>log('javascript-error',{message:e.message,source:e.filename,line:e.lineno,column:e.colno,stack:e.error?.stack||''}));
  window.addEventListener('unhandledrejection',e=>log('unhandled-rejection',{reason:String(e.reason),stack:e.reason?.stack||''}));
  log('app-open',{version:VERSION,userAgent:navigator.userAgent});
 }
 return Object.freeze({init,log,snapshot,auditMove,captureText,diagnostic,copy,bindCopyButton});
})();
