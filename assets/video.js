/* SIFT · pagine video. Legge /data/video.json e disegna la pagina.
   Il settore sta solo nell'indirizzo: nessuna richiesta verso terzi, nessun cookie, nessun salvataggio nel browser. */
(function(){
  var page=document.body.getAttribute('data-page'), settore=document.body.getAttribute('data-settore');
  var root=document.getElementById('v-content');
  var NOMI={manifatturiero:'Manifatturiero',startup:'Startup',servizi:'Servizi'};
  function el(tag,attrs,text){var e=document.createElement(tag);for(var k in (attrs||{}))e.setAttribute(k,attrs[k]);if(text)e.textContent=text;return e;}
  function player(v){
    var box=el('div',{'class':'v-player'});
    if(!v||!v.src){box.appendChild(el('div',{'class':'v-soon',role:'img','aria-label':'Video in arrivo'},'In arrivo'));return box;}
    var vid=el('video',{controls:'',preload:'none',playsinline:'',poster:v.poster||'', 'aria-label':v.titolo});
    vid.appendChild(el('source',{src:v.src,type:'video/mp4'}));
    if(v.sottotitoli)vid.appendChild(el('track',{kind:'subtitles',src:v.sottotitoli,srclang:'it',label:'Italiano','default':''}));
    box.appendChild(vid);return box;
  }
  fetch('/data/video.json').then(function(r){return r.json();}).then(function(list){
    if(page==='settore'){
      var v=list.filter(function(x){return x.tipo==='settore'&&x.settore===settore;})[0];
      var prodPronti=list.some(function(x){return x.tipo==='prodotto'&&x.src;});
      if(v){root.querySelector('h1').textContent=v.titolo;}
      root.querySelector('.v-slot').appendChild(player(v));
      if(v&&v.src&&v.descrizione)root.querySelector('.v-slot').appendChild(el('p',{'class':'v-desc'},v.descrizione));
      if(!prodPronti){var b=root.querySelector('.v-block');if(b)b.hidden=true;}
    }
    if(page==='prodotti'){
      var slot=root.querySelector('.v-slot');
      list.filter(function(x){return x.tipo==='prodotto';}).forEach(function(v){
        var item=el('section',{'class':'v-item','aria-labelledby':'t-'+v.id});
        item.appendChild(el('h2',{id:'t-'+v.id},v.titolo));
        item.appendChild(el('p',{'class':'v-desc'},v.descrizione));
        item.appendChild(player(v));slot.appendChild(item);
      });
    }
  }).catch(function(){var s=root.querySelector('.v-slot');if(s&&!s.firstChild)s.appendChild(player(null));});
})();
