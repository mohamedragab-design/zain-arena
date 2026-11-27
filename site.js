(function(){
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]});}
  function safeUrl(u){u=String(u||'');return /^(https?:|\/|assets\/|#)/.test(u)?u:'#';}
  fetch('content.json?t='+Date.now()).then(function(r){return r.json()}).then(function(c){
    var IG='https://www.instagram.com/zain_arena',YT='https://www.youtube.com/@zain-arena',DL='https://2.31.182.159/download';
    if(c.videos){var st=document.querySelector('.vid-stack');if(st){st.innerHTML=c.videos.filter(function(v){return v.visible!==false}).map(function(v){
      return '<div class="vid-wrap"><div class="vid-title">'+esc(v.title)+'</div><video class="vid-v" src="'+esc(safeUrl(v.src))+'" controls playsinline preload="metadata"></video><div class="vid-links"><a href="'+IG+'" target="_blank" rel="noopener">انستجرام</a><a href="'+YT+'" target="_blank" rel="noopener">يوتيوب</a><a href="'+DL+'">حمّل التطبيق</a></div></div>';}).join('');}}
    if(c.plans){var pl=document.querySelector('.plans');if(pl){pl.innerHTML=c.plans.map(function(p){
      return '<div class="plan in'+(p.popular?' popular':'')+'">'+(p.tag?'<div class="pop-tag">'+esc(p.tag)+'</div>':'')+'<h3>'+esc(p.name)+'</h3><div class="price"><b>'+esc(p.price)+'</b> '+esc(p.unit)+'</div><ul>'+(p.features||[]).map(function(f){return '<li>'+esc(f)+'</li>'}).join('')+'</ul><a href="'+DL+'" class="btn '+(p.popular?'btn-lime':'btn-ghost')+'">'+esc(p.cta)+'</a></div>';}).join('');}}
    if(c.links){var cols=document.querySelectorAll('.links-col');function card(l){var ext=/^https?:/.test(l.url)&&l.url.indexOf('2.31.182.159')<0;return '<a class="link-card" href="'+esc(safeUrl(l.url))+'"'+(ext?' target="_blank" rel="noopener"':'')+'><span class="lk-ico">'+esc(l.icon)+'</span><span class="lk-t"><b>'+esc(l.title)+'</b><small>'+esc(l.sub)+'</small></span><span class="lk-go">←</span></a>';}
      if(cols[0]&&c.links.app)cols[0].innerHTML='<h3>زين أرينا</h3>'+c.links.app.map(card).join('');
      if(cols[1]&&c.links.me)cols[1].innerHTML='<h3>محمد رجب</h3>'+c.links.me.map(card).join('');}
    if(c.faq){var fl=document.getElementById('faq-list');if(fl)fl.innerHTML=c.faq.map(function(x){return '<details class="faq-item"><summary>'+esc(x.q)+'</summary><p>'+esc(x.a)+'</p></details>'}).join('');}
  }).catch(function(){});
  var t=document.getElementById('to-top');
  if(t){window.addEventListener('scroll',function(){t.classList.toggle('show',scrollY>900)},{passive:true});t.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});}
})();
