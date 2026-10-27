/* SIFT · onda al tocco dei tasti.
   Scrive solo --rx/--ry e la classe .rip sul tasto (mai nodi nuovi), cosi non disturba wrap.js ne il cambio lingua. */
(function(){
  var mq=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):null;
  var SEL='.btn,.nav-cta,.alt-chip,.link-more,.tour-exit,.f-li';
  function go(b,x,y){
    var r=b.getBoundingClientRect();
    b.style.setProperty('--rx',x-r.left+'px');
    b.style.setProperty('--ry',y-r.top+'px');
    b.classList.remove('rip');void b.offsetWidth;b.classList.add('rip');
  }
  document.addEventListener('pointerdown',function(e){
    if(e.button>0||(mq&&mq.matches))return;
    var t=e.target,b=t&&t.closest?t.closest(SEL):null;
    if(b)go(b,e.clientX,e.clientY);
  },{passive:true});
  document.addEventListener('click',function(e){
    if(e.detail!==0||(mq&&mq.matches))return;
    var t=e.target,b=t&&t.closest?t.closest(SEL):null;
    if(!b)return;
    var r=b.getBoundingClientRect();
    go(b,r.left+r.width/2,r.top+r.height/2);
  },true);
  document.addEventListener('animationend',function(e){
    if(e.animationName==='btn-rip'&&e.target.classList)e.target.classList.remove('rip');
  },true);
})();
