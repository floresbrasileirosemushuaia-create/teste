/* Ludo Quiz v1.0.7: the opponent can read but never answer from this side. */
window.LudoDual=(function(){
 'use strict';
 const node=id=>document.getElementById(id);
 function sync(q,game,lang,answered,ui){
  if(!q||!game)return;
  const player=game.players[game.current];
  node('mirrorTag').textContent=lang==='es'?'SOLO OBSERVAR':'SOMENTE OBSERVAR';
  node('mirrorWho').textContent=ui('turnOf')+' '+player.name;
  node('mirrorCategory').textContent=q.category;
  node('mirrorQuestion').textContent=q.text;
  const answers=node('mirrorAnswers');answers.replaceChildren();
  q.choices.forEach((v,i)=>{
   const row=document.createElement('div');row.className='mirrorAnswer';
   if(answered){if(q.order[i]===2)row.classList.add('correct');else if(i===q.selected)row.classList.add('wrong');}
   const letter=document.createElement('span');letter.className='mirrorLetter';letter.textContent='ABCD'[i];
   const text=document.createElement('span');text.textContent=v;
   row.append(letter,text);answers.append(row);
  });
  const result=node('mirrorResult');result.hidden=!answered;
  if(answered)result.textContent=q.isCorrect?ui('correctFeedback'):ui('wrongFeedback')+' '+q.correct+'. '+ui('loseTurn');
  // Read-only duplicate intentionally contains no buttons, onclick or data-answer elements.
 }
 return Object.freeze({sync});
})();
