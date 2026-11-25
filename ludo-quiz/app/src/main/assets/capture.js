/* Animação visual de captura sem alterar as regras do jogo. */
window.LudoCapture=(function(){'use strict';
 function fly(from,to,color,name){
  if(!from||!to)return;const ghost=document.createElement('div');ghost.className='eatenGhost';
  ghost.style.cssText='position:fixed;left:'+from.left+'px;top:'+from.top+'px;width:'+from.width+'px;height:'+from.height+'px;background:'+color+';';
  ghost.textContent='✕';ghost.setAttribute('aria-label',name||'Peça capturada');
  document.body.append(ghost);
  if(typeof ghost.animate==='function'){
   const dx=to.left+to.width/2-from.left-from.width/2,dy=to.top+to.height/2-from.top-from.height/2;
   const a=ghost.animate([
     {transform:'translate(0,0) scale(1)',opacity:1,filter:'brightness(1)'},
     {transform:'translate(0,0) scale(1.7) rotate(30deg)',opacity:1,filter:'brightness(2)',offset:.24},
     {transform:'translate('+dx*.43+'px,'+dy*.43+'px) scale(.9) rotate(450deg)',opacity:.95,offset:.54},
     {transform:'translate('+dx+'px,'+dy+'px) scale(.3) rotate(760deg)',opacity:0}
   ],{duration:2400,easing:'cubic-bezier(.25,.85,.35,1)'});a.onfinish=()=>ghost.remove();
  }else setTimeout(()=>ghost.remove(),2400);
 }
 function announce(text){const e=document.createElement('div');e.className='captureFlash';e.textContent=text;document.body.append(e);setTimeout(()=>e.remove(),1900);}
 return Object.freeze({fly,announce});
})();
