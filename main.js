/* Les Jardins de JES — interactions (aucune dépendance) */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.remove('no-js');

  /* barre de progression + en-tête */
  var bar = d.getElementById('progress'), hdr = d.querySelector('.hdr');
  function onScroll() {
    var h = root.scrollHeight - root.clientHeight;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
    if (hdr) hdr.classList.toggle('is-scrolled', window.scrollY > 24);
    var p = d.querySelectorAll('[data-parallax]');
    for (var i = 0; i < p.length; i++) {
      var r = p[i].getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) continue;
      var k = parseFloat(p[i].getAttribute('data-parallax')) || 0.06;
      p[i].style.transform = 'translateY(' + ((r.top + r.height / 2 - window.innerHeight / 2) * -k).toFixed(1) + 'px)';
    }
  }
  var tick = false;
  window.addEventListener('scroll', function () {
    if (!tick) { tick = true; requestAnimationFrame(function () { onScroll(); tick = false; }); }
  }, { passive: true });
  onScroll();

  /* menu mobile */
  var burger = d.querySelector('.burger'), nav = d.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var o = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
  }

  /* apparitions au scroll */
  /* Les .rv-img (photos en arche) sont entièrement coupées par clip-path tant qu'elles
     n'ont pas la classe "in" : on observe donc leur parent, sinon elles restent invisibles. */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target;
        if (t.classList.contains('rv-img')) {
          t.classList.add('in');
        } else {
          t.classList.add('in');
          t.querySelectorAll('.rv-img').forEach(function (img) { img.classList.add('in'); });
        }
        io.unobserve(t);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    d.querySelectorAll('.rv,.rv-img,.chips,.ring-box').forEach(function (t) {
      io.observe(t.classList.contains('rv-img') ? (t.parentElement || t) : t);
    });
  } else {
    d.querySelectorAll('.rv,.rv-img,.chips,.ring-box').forEach(function (t) { t.classList.add('in'); });
  }
  /* filet de sécurité : tout ce qui est déjà à l'écran s'affiche quoi qu'il arrive */
  setTimeout(function () {
    var vh = window.innerHeight || d.documentElement.clientHeight;
    d.querySelectorAll('.rv-img,.rv').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add('in');
    });
  }, 1500);

  /* compteur de note */
  d.querySelectorAll('[data-count]').forEach(function (el) {
    var end = parseFloat(el.getAttribute('data-count')), done = false;
    function run() {
      if (done) return; done = true;
      var t0 = performance.now();
      (function step(t) {
        var k = Math.min(1, (t - t0) / 1600), v = end * (1 - Math.pow(1 - k, 3));
        el.textContent = v.toFixed(1).replace('.', ',');
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { run(); o.disconnect(); } }, { threshold: 0.4 }).observe(el);
    } else run();
  });

  /* comparateurs avant / après */
  function bindBA(ba) {
    var inp = ba.querySelector('input[type=range]');
    if (!inp) return;
    function set() { ba.style.setProperty('--p', inp.value + '%'); inp.setAttribute('aria-valuetext', 'Après visible à ' + (100 - inp.value) + ' %'); }
    inp.addEventListener('input', set); set();
  }
  d.querySelectorAll('.ba').forEach(bindBA);

  /* vitrine avant/après (accueil) */
  var show = d.getElementById('showcase');
  if (show) {
    var data = JSON.parse(show.getAttribute('data-items'));
    var ba = show.querySelector('.ba'), imgB = ba.querySelector('.before'), imgA = ba.querySelector('.after'),
        ttl = show.querySelector('[data-t]'), txt = show.querySelector('[data-x]'), pills = show.querySelectorAll('.pill'), rng = ba.querySelector('input');
    pills.forEach(function (pl, i) {
      pl.addEventListener('click', function () {
        var it = data[i];
        pills.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
        pl.setAttribute('aria-pressed', 'true');
        ba.style.opacity = '.0'; ba.style.transition = 'opacity .25s';
        setTimeout(function () {
          imgB.src = it.b; imgA.src = it.a; imgB.alt = it.alt + ' avant travaux'; imgA.alt = it.alt + ' après travaux';
          ba.classList.toggle('portrait', !!it.p);
          ttl.textContent = it.t; txt.textContent = it.x;
          rng.value = 50; ba.style.setProperty('--p', '50%');
          ba.style.opacity = '1';
        }, 220);
      });
    });
  }

  /* filtres galerie + visionneuse */
  var gal = d.querySelector('.gal');
  if (gal) {
    var fb = d.querySelectorAll('.filters .pill'), items = gal.querySelectorAll('.item');
    fb.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-f');
        fb.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        items.forEach(function (it) {
          var show = f === 'all' || it.getAttribute('data-c') === f;
          if (show) { it.hidden = false; requestAnimationFrame(function () { it.classList.remove('out'); }); }
          else { it.classList.add('out'); setTimeout(function () { if (it.classList.contains('out')) it.hidden = true; }, 380); }
        });
        try { history.replaceState(null, '', '#' + f); } catch (e) {}
      });
    });
    var h = (location.hash || '').replace('#', '');
    if (h) { var tb = d.querySelector('.filters .pill[data-f="' + h + '"]'); if (tb) tb.click(); }
  }
  var lb = d.getElementById('lb');
  if (lb) {
    var shots = [].slice.call(d.querySelectorAll('.shot')), cur = 0, lbi = lb.querySelector('img'), cap = lb.querySelector('p'), last = null;
    function vis() { return shots.filter(function (s) { return !s.closest('.item').hidden; }); }
    function open(i) { var v = vis(); cur = (i + v.length) % v.length; lbi.src = v[cur].getAttribute('data-full'); lbi.alt = v[cur].getAttribute('data-alt'); cap.textContent = v[cur].getAttribute('data-alt'); lb.classList.add('open'); lb.querySelector('.x').focus(); }
    function close() { lb.classList.remove('open'); if (last) last.focus(); }
    shots.forEach(function (s) { s.addEventListener('click', function () { last = s; open(vis().indexOf(s)); }); });
    lb.querySelector('.x').addEventListener('click', close);
    lb.querySelector('.pv').addEventListener('click', function () { open(cur - 1); });
    lb.querySelector('.nx').addEventListener('click', function () { open(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    d.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') open(cur - 1); if (e.key === 'ArrowRight') open(cur + 1);
    });
  }

  /* formulaire (test : rien n'est envoyé) */
  var form = d.getElementById('devis');
  if (form) {
    var sel = form.querySelector('select[name=prestation]'), other = form.querySelector('.other-wrap');
    if (sel && other) sel.addEventListener('change', function () { other.hidden = sel.value !== 'Autre'; });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[data-req]').forEach(function (f) {
        var inp = f.querySelector('input,select,textarea'), err = f.querySelector('.err');
        if (!inp || (f.hidden || (f.closest('[hidden]')))) return;
        var v = (inp.type === 'checkbox') ? inp.checked : inp.value.trim(), bad = !v;
        if (!bad && inp.type === 'email') bad = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
        if (!bad && inp.name === 'telephone') bad = v.replace(/\D/g, '').length < 9;
        f.classList.toggle('bad', bad);
        if (err) err.textContent = bad ? (inp.type === 'checkbox' ? 'Votre accord est nécessaire pour être rappelé(e).' : 'Merci de vérifier ce champ.') : '';
        if (bad) { if (ok) inp.focus(); ok = false; }
      });
      if (form.querySelector('.hp input').value) return; /* anti-spam */
      if (!ok) return;
      form.querySelector('.ok').classList.add('show');
      form.querySelector('button[type=submit]').disabled = true;
    });
  }
})();

/* gestion des cookies (test : rien n'est chargé) */
(function(){
  var d=document, ck=d.getElementById('ck'), op=d.getElementById('ck-open'); if(!ck) return;
  var KEY='jes-cookies';
  function show(){ck.hidden=false; var f=ck.querySelector('button'); if(f) f.focus();}
  function hide(){ck.hidden=true; if(op) op.focus();}
  function save(m,p){try{localStorage.setItem(KEY,JSON.stringify({mesure:m,pub:p}));}catch(e){} hide();}
  if(op) op.addEventListener('click',function(){
    try{var s=JSON.parse(localStorage.getItem(KEY)||'null'); if(s){ck.querySelector('[name=mesure]').checked=!!s.mesure; ck.querySelector('[name=pub]').checked=!!s.pub;}}catch(e){}
    show();
  });
  d.getElementById('ck-no').addEventListener('click',function(){ck.querySelector('[name=mesure]').checked=false;ck.querySelector('[name=pub]').checked=false;save(false,false);});
  d.getElementById('ck-ok').addEventListener('click',function(){save(ck.querySelector('[name=mesure]').checked,ck.querySelector('[name=pub]').checked);});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!ck.hidden)hide();});
})();

/* créneau d'appel (test : rien n'est envoyé) */
(function(){
  var d=document, box=d.getElementById('days'); if(!box) return;
  var sel=null, today=new Date(), n=0, i=1;
  while(n<7){
    var dt=new Date(today.getFullYear(),today.getMonth(),today.getDate()+i); i++;
    if(dt.getDay()===0) continue; n++;
    (function(dt){
      var b=d.createElement('button'); b.type='button'; b.className='day'; b.setAttribute('aria-pressed','false');
      b.textContent=dt.toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'});
      b.addEventListener('click',function(){
        box.querySelectorAll('.day').forEach(function(o){o.setAttribute('aria-pressed','false');});
        b.setAttribute('aria-pressed','true'); sel=dt.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
      });
      box.appendChild(b);
    })(dt);
  }
  d.getElementById('book-go').addEventListener('click',function(){
    var f=d.getElementById('b-tel'), t=d.getElementById('b-t'), err=f.querySelector('.err'), msg=d.getElementById('book-msg'), ok=d.getElementById('book-ok');
    var bad=t.value.replace(/\D/g,'').length<9;
    f.classList.toggle('bad',bad); err.textContent=bad?'Merci d\u2019indiquer un numéro valide.':'';
    if(bad){t.focus();return;}
    if(!sel){box.querySelector('.day').focus();msg.textContent='Choisissez d\u2019abord un jour.';ok.classList.add('show');return;}
    msg.innerHTML='Créneau noté : '+sel+' à '+d.getElementById('b-h').value+'. Je vous appelle.<br><small style="font-weight:600;opacity:.85">Version test : rien n\u2019est envoyé.</small>';
    ok.classList.add('show');
  });
})();

/* carte de zone : survol d'une commune (puce ou point) */
(function () {
  var d = document, box = d.querySelector('.zmap-box');
  if (!box) return;
  var pts = {};
  box.querySelectorAll('.pt').forEach(function (p) { pts[p.getAttribute('data-c')] = p; });
  d.querySelectorAll('.chips .chip').forEach(function (c) {
    var name = c.textContent.trim();
    if (!pts[name]) return;
    c.setAttribute('tabindex', '0');
    function on() { pts[name].classList.add('on'); }
    function off() { pts[name].classList.remove('on'); }
    c.addEventListener('mouseenter', on); c.addEventListener('mouseleave', off);
    c.addEventListener('focus', on); c.addEventListener('blur', off);
    pts[name].addEventListener('mouseenter', function () { c.classList.add('hl'); on(); });
    pts[name].addEventListener('mouseleave', function () { c.classList.remove('hl'); off(); });
  });
})();
