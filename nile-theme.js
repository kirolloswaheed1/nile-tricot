/* ============================================================
   NILE TRICOT — Global behaviours (loaded site-wide, deferred)
   Scroll progress · nav scroll state · sticky CTA · mobile menu
   · reveal-on-scroll · count-up.
   Every block is GUARDED, so it is safe to load now — before the
   header/sections that own these elements exist. No console errors.
   ============================================================ */
(function(){
  'use strict';

  /* ── Scroll progress bar (#spb) ── */
  var spb = document.getElementById('spb');
  function updBar(){
    if(!spb) return;
    var h = document.body.scrollHeight - window.innerHeight;
    if(h > 0) spb.style.width = (window.scrollY / h * 100).toFixed(1) + '%';
  }

  /* ── Nav scroll state (#nav gets .on after 55px) ── */
  var nav = document.getElementById('nav');
  function updNav(){ if(nav) nav.classList.toggle('on', window.scrollY > 55); }

  /* ── Sticky CTA reveal (#scta gets .on after 480px) ── */
  var scta = document.getElementById('scta');
  function updCta(){ if(scta) scta.classList.toggle('on', window.scrollY > 480); }

  window.addEventListener('scroll', function(){ updBar(); updNav(); updCta(); }, {passive:true});
  updNav(); updBar(); updCta();

  /* ── Mobile menu toggle (#burger + #mob) ── */
  var burger = document.getElementById('burger');
  var mob    = document.getElementById('mob');
  if(burger && mob){
    burger.addEventListener('click', function(){
      var open = burger.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      mob.classList.toggle('open', open);
    });
    mob.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded','false');
        mob.classList.remove('open');
      });
    });
  }

  /* ── Reveal-on-scroll (.rv → .in) ── */
  var rvEls = document.querySelectorAll('.rv');
  if(rvEls.length){
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, {rootMargin:'0px 0px -7% 0px', threshold:0.04});
      rvEls.forEach(function(el){ io.observe(el); });
    } else {
      rvEls.forEach(function(el){ el.classList.add('in'); });
    }
  }

  /* ── Count-up numbers ([data-count], optional [data-sfx] suffix) ── */
  var countEls = document.querySelectorAll('[data-count]');
  if(countEls.length && 'IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.dataset.count, 10) || 0;
        var sfx = el.dataset.sfx || '';
        var t0 = performance.now(), dur = 1300;
        function step(t){
          var p = Math.min((t - t0) / dur, 1);
          var v = Math.round((1 - Math.pow(1 - p, 3)) * target);
          el.textContent = v.toLocaleString() + sfx;
          if(p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, {threshold:0.4});
    countEls.forEach(function(el){ cio.observe(el); });
  }

})();
