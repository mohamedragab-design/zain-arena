// ZAIN ARENA site effects
(function(){
  "use strict";

  // Preloader
  window.addEventListener('load', function(){
    setTimeout(function(){ document.getElementById('preloader').classList.add('done'); }, 1400);
  });

  // Lenis smooth scroll
  var lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  // Anchor links via Lenis
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if (id.length > 1) {
        var el = document.querySelector(id);
        if (el) { e.preventDefault(); lenis ? lenis.scrollTo(el, {offset:-80}) : el.scrollIntoView({behavior:'smooth'}); }
      }
    });
  });

  // Progress bar + FAB
  var pg=document.querySelector('#progress span'), fab=document.getElementById('fab');
  window.addEventListener('scroll',function(){var s=document.documentElement;pg.style.width=(scrollY/(s.scrollHeight-innerHeight)*100)+'%';if(fab)fab.classList.toggle('show',scrollY>700);},{passive:true});
  // Nav scroll state
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function(){ nav.classList.toggle('scrolled', window.scrollY > 40); }, {passive:true});

  // Custom cursor
  var dot = document.querySelector('.cursor-dot'), glow = document.querySelector('.cursor-glow');
  var mx = innerWidth/2, my = innerHeight/2, gx = mx, gy = my;
  document.addEventListener('mousemove', function(e){
    mx = e.clientX; my = e.clientY;
    if (dot) dot.style.transform = 'translate(' + (mx-4) + 'px,' + (my-4) + 'px)';
  });
  (function cursorLoop(){
    gx += (mx-gx)*0.12; gy += (my-gy)*0.12;
    if (glow) glow.style.transform = 'translate(' + (gx-170) + 'px,' + (gy-170) + 'px)';
    requestAnimationFrame(cursorLoop);
  })();

  // Particles (stadium dust)
  var cv = document.getElementById('particles'), ctx = cv.getContext('2d');
  var P = [];
  function resize(){ cv.width = innerWidth; cv.height = innerHeight; }
  resize(); window.addEventListener('resize', resize);
  for (var i=0;i<70;i++) P.push({x:Math.random()*innerWidth, y:Math.random()*innerHeight, r:Math.random()*1.8+.4, s:Math.random()*.35+.08, o:Math.random()*.5+.15, drift:Math.random()*.4-.2});
  (function drawP(){
    ctx.clearRect(0,0,cv.width,cv.height);
    P.forEach(function(p){
      p.y -= p.s; p.x += p.drift;
      if (p.y < -5){ p.y = cv.height+5; p.x = Math.random()*cv.width; }
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7);
      ctx.fillStyle = 'rgba(61,255,106,'+p.o+')'; ctx.fill();
    });
    requestAnimationFrame(drawP);
  })();

  // Hero phone tilt
  var phone = document.getElementById('hero-phone');
  var hv = document.querySelector('.hero-visual');
  if (phone && hv && matchMedia('(hover:hover)').matches){
    hv.addEventListener('mousemove', function(e){
      var r = hv.getBoundingClientRect();
      var rx = ((e.clientY - r.top)/r.height - .5) * -14;
      var ry = ((e.clientX - r.left)/r.width - .5) * 14;
      phone.style.transform = 'rotateX('+rx+'deg) rotateY('+ry+'deg)';
    });
    hv.addEventListener('mouseleave', function(){ phone.style.transform = 'rotateX(0) rotateY(0)'; });
  }

  // Small tilt on cards
  if (matchMedia('(hover:hover)').matches){
    document.querySelectorAll('.tilt-sm').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var rx = ((e.clientY - r.top)/r.height - .5) * -10;
        var ry = ((e.clientX - r.left)/r.width - .5) * 10;
        el.style.transform = 'perspective(700px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-6px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
    });
  }

  // Spotlight cards
  document.querySelectorAll('.spotlight').forEach(function(el){
    el.addEventListener('mousemove', function(e){
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
      el.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
    });
  });

  // Magnetic buttons
  if (matchMedia('(hover:hover)').matches){
    document.querySelectorAll('.magnetic').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width/2)*.25;
        var y = (e.clientY - r.top - r.height/2)*.35;
        el.style.transform = 'translate('+x+'px,'+y+'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform=''; });
    });
  }

  // GSAP reveals + counters
  if (window.gsap){
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) lenis.on('scroll', ScrollTrigger.update);
    // Hero reveals play on load, not on scroll
    gsap.to('#hero .reveal', {opacity:1, y:0, duration:1, ease:'power3.out', stagger:.12, delay:1.5});
    document.querySelectorAll('.reveal').forEach(function(el, i){
      if (el.closest('#hero')) return;
      gsap.to(el, {opacity:1, y:0, duration:.9, ease:'power3.out',
        scrollTrigger:{trigger:el, start:'top 88%'}, delay:(i%4)*.06});
    });
    document.querySelectorAll('[data-count]').forEach(function(el){
      var end = parseInt(el.dataset.count,10);
      ScrollTrigger.create({trigger:el, start:'top 90%', once:true, onEnter:function(){
        gsap.fromTo(el, {innerText:0}, {innerText:end, duration:1.6, snap:{innerText:1}, ease:'power2.out',
          onUpdate:function(){ el.innerText = Math.round(parseFloat(el.innerText)); }});
      }});
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.style.opacity=1; el.style.transform='none'; });
  }

  // Safety net: never leave content invisible
  setTimeout(function(){
    document.querySelectorAll('.reveal').forEach(function(el){
      if (parseFloat(getComputedStyle(el).opacity) < 0.05 && el.getBoundingClientRect().top < innerHeight){
        el.style.opacity = 1; el.style.transform = 'none';
      }
    });
  }, 5000);

  // Video hover preview + modal
  var modal = document.getElementById('vid-modal');
  var vmv = document.getElementById('vm-video');
  document.querySelectorAll('.vid').forEach(function(v){
    var vid = v.querySelector('video');
    v.addEventListener('mouseenter', function(){ vid.play().catch(function(){}); });
    v.addEventListener('mouseleave', function(){ vid.pause(); });
    v.addEventListener('click', function(){
      vmv.src = v.dataset.src; modal.classList.add('open'); vmv.play().catch(function(){});
      if (lenis) lenis.stop();
    });
  });
  function closeModal(){ modal.classList.remove('open'); vmv.pause(); vmv.src=''; if (lenis) lenis.start(); }
  modal.querySelector('.vm-backdrop').addEventListener('click', closeModal);
  modal.querySelector('.vm-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });
})();
