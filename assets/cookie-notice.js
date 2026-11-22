/* Avviso cookie: informa che il sito usa solo strumenti tecnici.
   Non chiede consenso perché non ci sono cookie da accettare.
   Ricorda la chiusura nella memoria locale del browser (strumento tecnico, elencato nella cookie policy). */
(function(){
  var KEY='sift-cookie-ok';
  try{ if(localStorage.getItem(KEY)==='1') return; }catch(e){}
  var T={
    it:{t:'Questo sito usa solo strumenti tecnici: niente cookie di profilazione, di marketing o di statistica.',l:'Cookie policy',b:'Ho capito',a:'Avviso sui cookie'},
    en:{t:'This site only uses technical tools: no profiling, marketing or analytics cookies.',l:'Cookie policy',b:'Got it',a:'Cookie notice'}
  };
  function lang(){ return (document.documentElement.lang||'en').slice(0,2)==='it'?'it':'en'; }
  var css='.ck{position:fixed;left:24px;bottom:24px;z-index:9999;max-width:560px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;background:#0A5143;border:6px solid #0F7A64;border-radius:14px;padding:16px 18px;color:#F7FCFA;font:400 15px/1.5 Inter,system-ui,sans-serif}'+
    '.ck p{margin:0;flex:1 1 260px;color:#F7FCFA}'+
    '.ck a{color:#F7FCFA;text-decoration:underline;text-underline-offset:3px;white-space:nowrap}'+
    '.ck button{flex:0 0 auto;min-height:44px;padding:0 22px;border:0;border-radius:999px;background:#5CF2B4;color:#003D32;font:600 15px/1 Sora,sans-serif;cursor:pointer}'+
    '.ck a:focus-visible,.ck button:focus-visible{outline:2px solid #F7FCFA;outline-offset:3px}'+
    '@media(max-width:600px){.ck{left:16px;right:16px;bottom:16px;max-width:none;border-width:4px;padding:14px}.ck button{width:100%}}'+
    '@media print{.ck{display:none}}';
  function build(){
    var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
    var box=document.createElement('div'); box.className='ck'; box.setAttribute('role','region');
    var p=document.createElement('p'), txt=document.createElement('span'), a=document.createElement('a'), b=document.createElement('button');
    a.href='/cookie.html'; b.type='button';
    p.appendChild(txt); p.appendChild(document.createTextNode(' ')); p.appendChild(a);
    box.appendChild(p); box.appendChild(b);
    function paint(){ var s=T[lang()]; txt.textContent=s.t; a.textContent=s.l; b.textContent=s.b; box.setAttribute('aria-label',s.a); }
    paint();
    new MutationObserver(paint).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    b.addEventListener('click',function(){ try{ localStorage.setItem(KEY,'1'); }catch(e){} box.remove(); });
    document.body.appendChild(box);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',build); else build();
})();
