(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Fixed CTA (mobile) ---------- */
  var fixedCta = document.getElementById('fixedCta');
  var fv = document.querySelector('.fv');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (fixedCta && fv) fixedCta.classList.toggle('is-show', y > fv.offsetHeight - 200);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.querySelector('.hd__menuTxt').textContent = open ? 'CLOSE' : 'MENU';
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });
  }

  /* ---------- Split letters ---------- */
  document.querySelectorAll('.split').forEach(function (el) {
    var text = el.textContent;
    el.setAttribute('aria-label', text);
    el.textContent = '';
    Array.prototype.forEach.call(text, function (ch, i) {
      var s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch === ' ' ? ' ' : ch;
      s.style.transitionDelay = (i * 40) + 'ms';
      s.setAttribute('aria-hidden', 'true');
      el.appendChild(s);
    });
  });

  /* ---------- Reveal ---------- */
  var targets = document.querySelectorAll('.reveal, .split');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Hero bowls: 写真を順に注ぎ替える ---------- */
  var bowls = document.querySelectorAll('[data-bowl]');
  if (bowls.length && !reduce) {
    bowls.forEach(function (bowl, bi) {
      var imgs = bowl.querySelectorAll('img');
      if (imgs.length < 2) return;
      var idx = 0;
      function next() {
        var cur = imgs[idx];
        idx = (idx + 1) % imgs.length;
        var nx = imgs[idx];
        cur.classList.remove('is-on'); cur.classList.add('is-out');
        nx.classList.remove('is-out'); nx.classList.add('is-on');
        setTimeout(function () { cur.classList.remove('is-out'); }, 1000);
      }
      setTimeout(function () {
        next();
        setInterval(next, 5200);
      }, 3200 + bi * 900);
    });
  }

  /* ---------- Supporters wall ---------- */
  var wall = document.getElementById('wall');
  var wallCount = document.getElementById('wallCount');
  if (wall && wallCount) {
    var names = wall.querySelectorAll('li:not(.wall__empty)');
    wallCount.textContent = names.length;
    var empty = wall.querySelector('.wall__empty');
    if (empty && names.length > 0) empty.remove();
    if (names.length === 0) wallCount.parentNode.hidden = true;
  }

  /* ---------- Guest modal ---------- */
  var modal = document.getElementById('modal');
  var dataEl = document.getElementById('guestData');
  var guests = {}, lastTrigger = null;
  try { guests = JSON.parse(dataEl.textContent); } catch (e) { guests = {}; }
  function openModal(key) {
    var g = guests[key]; if (!g || !modal) return;
    var photo = document.getElementById('modalPhoto');
    photo.src = g.photo; photo.alt = g.name;
    document.getElementById('modalTag').textContent = g.tag || '';
    document.getElementById('modalName').textContent = g.name || '';
    document.getElementById('modalOrg').textContent = g.org || '';
    document.getElementById('modalBio').textContent = g.bio || '';
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var c = modal.querySelector('.modal__close'); if (c) c.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
  }
  document.querySelectorAll('[data-guest]').forEach(function (btn) {
    btn.addEventListener('click', function () { lastTrigger = btn; openModal(btn.getAttribute('data-guest')); });
  });
  if (modal) {
    modal.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', closeModal); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  }
})();
