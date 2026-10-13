/* Keeps short words glued to the next one, so lines never end on "a", "di", "the"... and never leave a single word alone on the last line */
(function(){
  var SEL='p,li,h1,h2,h3,h4,blockquote,figcaption,dd,.sub,.lead,.page-hero-desc,.prow-body',busy=false,t;
  /* on phones only 1-2 letter words are glued: three-letter words (the, and, per...) would leave notches at the end of short lines */
  var phone=!!(window.screen&&Math.min(screen.width,screen.height)<=600);
  var MORE=phone?'':'|[Tt]he|[Aa]nd|[Ff]or|[Ww]ith|[Nn]on|[Pp]er|[Uu]na|[Gg]li|[Cc]on|[Tt]ra|[Ff]ra';
  var re=new RegExp('(^|[\\s(])([A-Za-z\u00c0-\u00ff]{1,2}'+MORE+') ','g');
  function done(el){return el.__rx!==undefined&&el.__rx===el.textContent}
  function fix(){
    if(busy)return;busy=true;
    var els=document.querySelectorAll(SEL);
    els.forEach(function(el){
      if(done(el))return;
      var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),n;
      while(n=w.nextNode()){
        var v=n.nodeValue,r=v.replace(re,'$1$2\u00a0').replace(re,'$1$2\u00a0');
        if(r!==v)n.nodeValue=r;
      }
    });
    els.forEach(function(el){if(!done(el))widow(el)});
    els.forEach(relax);
    busy=false;
  }
  /* a glued run wider than its box (very small screens) goes back to normal spaces */
  function relax(el){
    if(el.scrollWidth<=el.clientWidth+1)return;
    var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),n;
    while(n=w.nextNode()){if(n.nodeValue.indexOf('\u00a0')>-1)n.nodeValue=n.nodeValue.replace(/\u00a0/g,' ')}
    el.__rx=el.textContent;
  }
  function widow(el){
    var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),n,nodes=[];
    while(n=w.nextNode()){if(n.nodeValue.trim())nodes.push(n)}
    if(!nodes.length)return;
    var last=nodes[nodes.length-1],v=last.nodeValue,m=/^([\s\S]*\S)\s+(\S+)(\s*)$/.exec(v),r;
    if(m){
      r=m[1]+'\u00a0'+m[2]+m[3];
      var trimmed=r.replace(/\s+$/,''),tail=/[^ \t\r\n]+$/.exec(trimmed),fs=parseFloat(getComputedStyle(el).fontSize)||16,bw=el.getBoundingClientRect().width||(el.parentElement?el.parentElement.getBoundingClientRect().width:0);
      if(tail&&bw&&tail[0].length*fs*0.55>bw*0.8){
        /* the glued run at the end is too long: cut it just before the last two words, so those two still stay together */
        var run=tail[0],base=trimmed.length-run.length,lastG=run.lastIndexOf('\u00a0'),prevG=lastG>0?run.lastIndexOf('\u00a0',lastG-1):-1;
        if(prevG<0)return;
        if(run.slice(prevG+1).length*fs*0.55>bw*0.8)return;
        r=r.slice(0,base+prevG)+' '+r.slice(base+prevG+1);
      }
      if(r!==v)last.nodeValue=r;
    }
    else if(nodes.length>1){
      var pv=nodes[nodes.length-2].nodeValue;
      if(/\s$/.test(pv)&&!/\u00a0$/.test(pv)){nodes[nodes.length-2].nodeValue=pv.replace(/\s+$/,'\u00a0')}
    }
  }
  function sched(){clearTimeout(t);t=setTimeout(fix,60)}
  document.addEventListener('DOMContentLoaded',function(){
    fix();new MutationObserver(function(){if(!busy)sched()}).observe(document.body,{childList:true,subtree:true,characterData:true});
    window.addEventListener('resize',sched);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(sched);
  });
})();

/* Browser-tab title and screen-reader labels that live outside the page dictionaries: follow <html lang> */
(function(){
  var T={
    "SIFT \u00b7 Signal-driven account research for B2B teams":"SIFT \u00b7 Ricerca sulle aziende basata sui segnali, per team B2B",
    "Products: ARGUS, LYNX & COLLAB | SIFT":"Prodotti: ARGUS, LYNX e COLLAB | SIFT",
    "How it works: Method & team | SIFT":"Come funziona: metodo e team | SIFT",
    "Contact: Book a call | SIFT":"Contatti: prenota una call | SIFT",
    "ARGUS: Signal-scored lead lists | SIFT":"ARGUS: liste di contatti valutate sui segnali | SIFT",
    "LYNX: Account intelligence & strategic briefs | SIFT":"LYNX: schede aziende e analisi strategiche | SIFT",
    "COLLAB: Your team's shared workspace | SIFT":"COLLAB: lo spazio di lavoro condiviso del tuo team | SIFT"
  };
  var A={"Main":"Principale","SIFT home":"SIFT, pagina iniziale","Language":"Lingua","Products":"Prodotti","Company":"Azienda","Layout of one line of the report":"Layout di una riga del report","Fragments we read":"I frammenti che leggiamo"};
  var en=null;
  function apply(){
    var it=document.documentElement.lang==='it';
    if(en===null)en=document.title;
    document.title=it&&T[en]?T[en]:en;
    document.querySelectorAll('[aria-label]').forEach(function(e){
      var o=e.getAttribute('data-aria-orig');
      if(o===null){o=e.getAttribute('aria-label');if(!A.hasOwnProperty(o))return;e.setAttribute('data-aria-orig',o)}
      e.setAttribute('aria-label',it?A[o]:o);
    });
  }
  document.addEventListener('DOMContentLoaded',function(){
    apply();new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  });
})();
