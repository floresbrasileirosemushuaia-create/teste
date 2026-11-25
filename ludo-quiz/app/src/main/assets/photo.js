/* Fotos voluntárias, processadas somente neste aparelho (v1.0.8). */
window.LudoPhoto=(function(){'use strict';
 const K='ludo_quiz_profiles_108';const drafts={};let saved={};
 try{saved=JSON.parse(localStorage.getItem(K)||'{}')||{};}catch(e){}
 function key(name){return String(name||'').trim().toLocaleLowerCase();}
 function get(i,name){return drafts[i]||saved[key(name)]||'';}
 function mount(row,i,input){
  const label=document.createElement('label');label.className='photoChoice';label.title='Foto / foto';
  const im=document.createElement('img');im.alt='';im.hidden=true;
  const sym=document.createElement('span');sym.textContent='📷';
  const file=document.createElement('input');file.type='file';file.accept='image/*';file.capture='user';file.className='photoFile';file.setAttribute('aria-label','Tirar foto / Tomar foto do jogador '+(i+1));
  label.append(im,sym,file);row.append(label);
  function paint(){const pic=get(i,input.value);im.hidden=!pic;sym.hidden=!!pic;if(pic)im.src=pic;}
  input.addEventListener('input',paint);
  file.addEventListener('change',()=>{
   const f=file.files&&file.files[0];if(!f||!f.type.startsWith('image/'))return;
   const fr=new FileReader();fr.onload=()=>{
    const image=new Image();image.onload=()=>{try{
     const canvas=document.createElement('canvas'),size=160;canvas.width=size;canvas.height=size;
     const ctx=canvas.getContext('2d');if(!ctx) return;
     const side=Math.min(image.naturalWidth,image.naturalHeight);
     ctx.drawImage(image,(image.naturalWidth-side)/2,(image.naturalHeight-side)/2,side,side,0,0,size,size);
     const data=canvas.toDataURL('image/jpeg',.65);if(data.length>60000)throw Error('Imagem muito grande');
     drafts[i]=data;const name=key(input.value);if(name){saved[name]=data;try{localStorage.setItem(K,JSON.stringify(saved));}catch(e){}}
     paint();
    }catch(e){console.warn('Foto não salva',e);}};
    image.src=String(fr.result||'');
   };fr.readAsDataURL(f);file.value='';
  });paint();
 }
 function persist(i,name){const pic=get(i,name);if(pic){saved[key(name)]=pic;try{localStorage.setItem(K,JSON.stringify(saved));}catch(e){}}return pic;}
 function setIcon(node,p,fallback){node.textContent='';if(p&&p.photo){const im=document.createElement('img');im.className='playerPhoto';im.alt='Foto de '+p.name;im.src=p.photo;node.append(im);}else node.innerHTML=fallback;}
 function image(p,cls){if(!p?.photo)return null;const im=document.createElement('img');im.className=cls;im.alt='Foto de '+p.name;im.src=p.photo;return im;}
 return Object.freeze({mount,get,persist,setIcon,image});
})();
