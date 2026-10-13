/* Keeps short words glued to the next one, so lines never end on "a", "di", "the"... */
(function(){
  var SEL='p,li,h1,h2,h3,h4,blockquote,figcaption,dd,.sub,.lead,.page-hero-desc,.prow-body',busy=false,t;
  var re=/(^|[\s(])([A-Za-zÀ-ÿ]{1,2}|[Tt]he|[Aa]nd|[Ff]or|[Ww]ith|[Nn]on|[Pp]er|[Ll]a|[Ll]e|[Uu]n|[Uu]na|[Ii]l|[Ll]o|[Gg]li|[Cc]on|[Ss]u|[Tt]ra|[Ff]ra) /g;
  function fix(){
    if(busy)return;busy=true;
    document.querySelectorAll(SEL).forEach(function(el){
      var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),n;
      while(n=w.nextNode()){
        var v=n.nodeValue,r=v.replace(re,'$1$2 ').replace(re,'$1$2 ');
        if(r!==v)n.nodeValue=r;
      }
    });
    busy=false;
  }
  function sched(){clearTimeout(t);t=setTimeout(fix,60)}
  document.addEventListener('DOMContentLoaded',function(){
    fix();new MutationObserver(function(){if(!busy)sched()}).observe(document.body,{childList:true,subtree:true,characterData:true});
  });
})();
