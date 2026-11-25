/* Ludo Quiz v1.0.5 – efeitos isolados; nenhuma regra de jogo aqui. */
window.LudoFX=(function(){
 'use strict';
 const KEY='ludo_quiz_fx_sound_v1';
 let enabled=true,ctx=null,diceInterval=null;
 try{enabled=localStorage.getItem(KEY)!=='off';}catch(e){}
 function audioContext(){
  if(!enabled)return null;
  if(!ctx){try{const AC=window.AudioContext||window.webkitAudioContext;if(AC)ctx=new AC();}catch(e){return null;}}
  if(ctx&&ctx.state==='suspended'){try{ctx.resume().catch(()=>{});}catch(e){}}
  return ctx;
 }
 function tone(hz,delay,duration,volume=0.065,type='sine'){
  const a=audioContext();if(!a)return;
  try{
   const start=a.currentTime+delay,osc=a.createOscillator(),gain=a.createGain();
   osc.type=type;osc.frequency.setValueAtTime(hz,start);
   gain.gain.setValueAtTime(0.0001,start);
   gain.gain.exponentialRampToValueAtTime(volume,start+0.013);
   gain.gain.exponentialRampToValueAtTime(0.0001,start+duration);
   osc.connect(gain);gain.connect(a.destination);
   osc.start(start);osc.stop(start+duration+0.015);
  }catch(e){}
 }
 function sound(kind){
  if(!enabled)return;
  if(kind==='turn'){tone(420,0,.12,.05);tone(620,.13,.18,.055);}
  if(kind==='correct'){tone(480,0,.12);tone(660,.12,.12);tone(850,.24,.22,.08);}
  if(kind==='wrong'){tone(320,0,.18,.06,'triangle');tone(220,.18,.25,.055,'triangle');}
  if(kind==='dice'){for(let i=0;i<7;i++)tone(280+i*42,i*.085,.07,.04,'triangle');tone(770,.66,.22,.07);}
  if(kind==='move'){for(let i=0;i<3;i++)tone(290+i*70,i*.075,.085,.035);}
  if(kind==='card'){tone(550,0,.08,.06);tone(730,.1,.11,.06);tone(900,.21,.18,.065);}
  if(kind==='devour'){for(let i=0;i<11;i++)tone(920-i*62,i*.07,.13,.065,'sawtooth');tone(150,.7,.5,.095,'triangle');tone(820,.83,.22,.08);}
  if(kind==='capture'){tone(540,0,.10,.07);tone(240,.10,.22,.08,'triangle');tone(700,.24,.20,.05);}
  if(kind==='bonus'){tone(520,0,.10);tone(720,.12,.10);tone(920,.24,.22);}
  if(kind==='win'){[440,554,659,880,1046].forEach((v,i)=>tone(v,i*.13,.31,.055));}
  if(kind==='tap')tone(520,0,.10,.045);
 }
 function rotate(flag){
  document.documentElement.classList.toggle('facing-reverse',Boolean(flag));
 }
 function translate(getLang){
  const es=typeof getLang==='function'&&getLang()==='es';
  for(const id of ['soundBtn','turnSoundBtn']){
   const b=document.getElementById(id);if(!b)continue;
   b.textContent=enabled?'♪':'♪̸';
   b.setAttribute('aria-label',es?(enabled?'Desactivar sonidos':'Activar sonidos'):(enabled?'Desativar sons':'Ativar sons'));
   b.setAttribute('aria-pressed',String(enabled));
   b.title=b.getAttribute('aria-label');
   b.classList.toggle('muted',!enabled);
  }
 }
 function init(getLang){
  const toggle=()=>{
   enabled=!enabled;
   try{localStorage.setItem(KEY,enabled?'on':'off');}catch(e){}
   translate(getLang);
   if(enabled)sound('tap');
  };
  for(const id of ['soundBtn','turnSoundBtn']){
   const b=document.getElementById(id);if(b)b.addEventListener('click',toggle);
  }
  document.addEventListener('pointerdown',function firstAudioTouch(){audioContext();},{once:true,capture:true,passive:true});
  translate(getLang);
 }
 function handoff(){
  const content=document.querySelector('#turnOverlay .turnContent');
  if(!content)return;
  content.classList.remove('fx-handoff');
  void content.offsetWidth;
  content.classList.add('fx-handoff');
 }
 function animateDice(holder,result,drawDice){
  if(diceInterval!==null){clearInterval(diceInterval);diceInterval=null;}
  if(!holder||!drawDice)return;
  holder.classList.remove('fx-rolling');
  void holder.offsetWidth;
  holder.classList.add('fx-rolling');
  let count=0;
  holder.innerHTML=drawDice(1+Math.floor(Math.random()*6));
  diceInterval=setInterval(()=>{
   count++;
   if(count>=8){
    clearInterval(diceInterval);diceInterval=null;
    holder.innerHTML=drawDice(result);
    holder.classList.remove('fx-rolling');
   }else{holder.innerHTML=drawDice(1+Math.floor(Math.random()*6));}
  },88);
 }
 function clearDice(){
  if(diceInterval!==null){clearInterval(diceInterval);diceInterval=null;}
 }
 function animateMove(previousRect,newEl,captured){
  if(!newEl||!previousRect)return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(typeof newEl.animate!=='function')return;
  const r=newEl.getBoundingClientRect(),flipped=document.documentElement.classList.contains('facing-reverse');
  let dx=previousRect.left+previousRect.width/2-r.left-r.width/2;
  let dy=previousRect.top+previousRect.height/2-r.top-r.height/2;
  if(flipped){dx=-dx;dy=-dy;}
  try{
   newEl.animate([
    {transform:'translate('+dx+'px,'+dy+'px) scale(1.03)',opacity:'.75',filter:'brightness(1.2)'},
    {transform:'translate(0,0) scale(1.23)',opacity:'1',filter:'brightness(1.3)',offset:.7},
    {transform:'translate(0,0) scale(1)',opacity:'1',filter:'none'}
   ],{duration:1850,easing:'cubic-bezier(.2,.8,.2,1)'});
   if(captured)newEl.animate([{boxShadow:'0 0 0 0px #fff'},{boxShadow:'0 0 0 9px #fff0'}],{duration:650,easing:'ease-out'});
  }catch(e){}
 }
 return {init,translate,rotate,handoff,animateDice,clearDice,animateMove,sound};
})();
