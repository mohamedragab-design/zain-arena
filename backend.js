(function () {
  var URL_ = 'https://ggfszanqfmipjusvmyta.supabase.co';
  var KEY = 'sb_publishable_e9vphZwluitGN0wxdQkEGQ_d9tN4Ikg';
  var SITE = /zain-arena/.test(location.pathname) ? 'zain' : 'portfolio';
  var H = { apikey: KEY, 'Content-Type': 'application/json' };

  function lang() { return SITE === 'zain' ? 'ar' : (localStorage.getItem('mr-lang') || 'en'); }
  var T = {
    en: { h: 'Get in touch', n: 'Your name', e: 'Email (optional)', m: 'Your message', s: 'Send', ok: 'Sent. Thank you!', er: 'Could not send. Try again later.', v: 'Visits' },
    ar: { h: SITE === 'zain' ? 'تواصل معنا' : 'ابعتلي رسالة', n: 'اسمك', e: 'الإيميل (اختياري)', m: 'رسالتك', s: 'ارسال', ok: 'اتبعتت. شكرا ليك!', er: 'مقدرتش ابعت. جرب تاني بعد شوية.', v: 'عدد الزيارات' }
  };

  function rpc(count) {
    return fetch(URL_ + '/rest/v1/rpc/hit', { method: 'POST', headers: H, body: JSON.stringify({ p_site: SITE, p_count: count }) })
      .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  }

  function build() {
    var t = T[lang()], rtl = lang() === 'ar';
    var s = document.getElementById('be-contact');
    if (!s) {
      s = document.createElement('section'); s.id = 'be-contact'; s.className = 'be-' + SITE;
      var f = document.querySelector('footer');
      if (f) f.parentNode.insertBefore(s, f); else document.body.appendChild(s);
    }
    var keep = s.getAttribute('data-l') === lang() ? s.querySelector('.be-count') : null;
    var count = keep ? keep.textContent : '';
    s.setAttribute('data-l', lang()); s.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    s.innerHTML = '<div class="be-box"><h2>' + t.h + '</h2>' +
      '<form id="be-form" novalidate>' +
      '<input name="name" maxlength="100" required placeholder="' + t.n + '" autocomplete="name">' +
      '<input name="email" type="email" maxlength="200" placeholder="' + t.e + '" autocomplete="email">' +
      '<textarea name="message" maxlength="2000" required rows="4" placeholder="' + t.m + '"></textarea>' +
      '<input name="website" tabindex="-1" autocomplete="off" class="be-hp" aria-hidden="true">' +
      '<button type="submit">' + t.s + '</button><p class="be-msg" role="status"></p></form>' +
      '<p class="be-visits">' + t.v + ': <b class="be-count">' + count + '</b></p></div>';
    var form = s.querySelector('form'), msg = s.querySelector('.be-msg');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var d = new FormData(form);
      if (d.get('website')) { msg.textContent = t.ok; return; }
      var name = (d.get('name') || '').trim(), m = (d.get('message') || '').trim(), em = (d.get('email') || '').trim();
      if (!name || m.length < 3) { msg.textContent = t.er; return; }
      var last = +localStorage.getItem('be-last') || 0;
      if (Date.now() - last < 30000) { msg.textContent = t.er; return; }
      form.querySelector('button').disabled = true;
      fetch(URL_ + '/rest/v1/contacts', { method: 'POST', headers: Object.assign({ Prefer: 'return=minimal' }, H),
        body: JSON.stringify({ site: SITE, name: name, email: em || null, message: m }) })
        .then(function (r) {
          if (r.ok) { localStorage.setItem('be-last', Date.now()); msg.textContent = t.ok; form.reset(); }
          else msg.textContent = t.er;
        }).catch(function () { msg.textContent = t.er; })
        .then(function () { form.querySelector('button').disabled = false; });
    });
    if (window.__beCount != null) s.querySelector('.be-count').textContent = window.__beCount;
  }

  function init() {
    build();
    var app = document.getElementById('app');
    if (app) new MutationObserver(function () {
      if (document.getElementById('be-contact').getAttribute('data-l') !== lang()) build();
    }).observe(app, { childList: true });
    var seen = sessionStorage.getItem('be-seen');
    rpc(!seen).then(function (n) {
      if (!seen) sessionStorage.setItem('be-seen', '1');
      if (n != null) { window.__beCount = Number(n).toLocaleString(); var c = document.querySelector('#be-contact .be-count'); if (c) c.textContent = window.__beCount; }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
