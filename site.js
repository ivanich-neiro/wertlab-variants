(() => {
'use strict';
const WL = window.WL || {}, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => new Intl.NumberFormat('ru-RU').format(n).replace(/\s/g, ' ') + ' ₽';
const from = n => (n ? 'от ' + money(n) : 'по запросу');
const ARR = '<svg class="arr" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 4.5 16.5 10 11 15.5"/></svg>';
const tg = window.Telegram && Telegram.WebApp && Telegram.WebApp.initData !== undefined ? Telegram.WebApp : null;
const haptic = t => { try { tg && tg.HapticFeedback && (t === 'ok' ? tg.HapticFeedback.notificationOccurred('success') : tg.HapticFeedback.impactOccurred('light')); } catch (e) {} };

/* Telegram Mini App */
if (tg) {
  try { tg.ready(); tg.expand(); tg.setHeaderColor && tg.setHeaderColor('#09090c'); tg.setBackgroundColor && tg.setBackgroundColor('#09090c'); tg.disableVerticalSwipes && tg.disableVerticalSwipes(); } catch (e) {}
  // keep internal links inside the app; external links via Telegram
  document.addEventListener('click', e => { const a = e.target.closest('a[target=_blank]'); if (!a) return; e.preventDefault(); /t\.me\//.test(a.href) ? tg.openTelegramLink(a.href) : tg.openLink(a.href); });
}

/* Izhevsk time */
const local = () => new Date(Date.now() + (WL.tz || 4) * 3600e3);
const dow = d => ((d.getUTCDay() + 6) % 7) + 1;
function openState() {
  const n = local(), h = n.getUTCHours() + n.getUTCMinutes() / 60, t = WL.hours[dow(n)];
  if (t && h >= t[0] && h < t[1]) return { open: true, text: `Сейчас открыто до ${t[1]}:00` };
  for (let i = 0; i < 8; i++) {
    const x = new Date(n.getTime() + i * 864e5), w = WL.hours[dow(x)];
    if (!w || (i === 0 && h >= w[0])) continue;
    const day = i === 0 ? 'сегодня' : i === 1 ? 'завтра' : ['в понедельник', 'во вторник', 'в среду', 'в четверг', 'в пятницу', 'в субботу', 'в воскресенье'][dow(x) - 1];
    return { open: false, text: `Сейчас закрыто, откроемся ${day} в ${w[0]}:00` };
  }
  return { open: false, text: '' };
}
function paintStatus() {
  const s = openState();
  $$('[data-status]').forEach(el => { el.classList.toggle('open', s.open); el.querySelector('span').textContent = s.text; });
  $$('[data-status-text]').forEach(el => { el.textContent = s.text; el.classList.toggle('open', s.open); });
}
paintStatus(); setInterval(paintStatus, 60e3);

/* nav */
const nav = $('#nav'), dock = $('#dock');
let ticking = false;
function onScroll() {
  ticking = false;
  const y = scrollY;
  nav.classList.toggle('scrolled', y > 24);
  if (dock) {
    const b = $('#booking').getBoundingClientRect(), inBook = b.top < innerHeight && b.bottom > 0;
    dock.classList.toggle('show', y > innerHeight * .7 && !inBook);
  }
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();
// highlight current section
const links = $$('.nav-links a');
const secIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
links.forEach(a => { const s = $(a.hash); s && secIO.observe(s); });

/* mobile menu */
const menu = $('#menu'), burger = $('.nav .burger');
function setMenu(open) {
  menu.hidden = !open; burger.setAttribute('aria-expanded', open); document.body.style.overflow = open ? 'hidden' : '';
  if (open) $('a', menu).focus({ preventScroll: true }); else burger.focus({ preventScroll: true });
}
burger.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', e => { if (e.target.closest('[data-close]')) setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
matchMedia('(min-width:1101px)').addEventListener('change', e => e.matches && !menu.hidden && setMenu(false));

/* reveal */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv,.ph').forEach(el => io.observe(el));
} else $$('.rv,.ph').forEach(el => el.classList.add('in'));

/* prices */
let tabs = $$('.pl-tab'); const q = $('#pl-q'), results = $('#pl-results');
function setCat(id, focus, quiet) {
  tabs.forEach(b => { const on = b.dataset.cat === id; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; if (on && !quiet) { focus && b.focus(); b.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' }); } });
  $$('.pl-group[data-group]').forEach(g => { const on = g.dataset.group === id; g.hidden = !on; if (on) { g.classList.remove('swap'); void g.offsetWidth; g.classList.add('swap'); } });
  results.hidden = true; if (q.value) q.value = '';
}
$('.pl-tabs').addEventListener('click', e => { const b = e.target.closest('.pl-tab'); b && setCat(b.dataset.cat); });
$('.pl-tabs').addEventListener('keydown', e => {
  const i = tabs.findIndex(b => b.getAttribute('aria-selected') === 'true'), k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (k) { e.preventDefault(); setCat(tabs[(i + k + tabs.length) % tabs.length].dataset.cat, true); }
});
$$('.tile[data-cat]').forEach(t => t.addEventListener('click', () => setCat(t.dataset.cat)));
let allRows = $$('.pl-group[data-group] .pl-row').map(b => ({ name: b.dataset.work, price: +b.dataset.price, group: b.dataset.groupName }));
const norm = s => s.toLowerCase().replace(/ё/g, 'е');
q.addEventListener('input', () => {
  const v = norm(q.value.trim());
  if (!v) { results.hidden = true; const cur = tabs.find(b => b.getAttribute('aria-selected') === 'true'); $$('.pl-group[data-group]').forEach(g => g.hidden = g.dataset.group !== cur.dataset.cat); return; }
  const words = v.split(/\s+/), hits = allRows.filter(r => words.every(w => norm(r.name + ' ' + r.group).includes(w)));
  $$('.pl-group[data-group]').forEach(g => g.hidden = true); results.hidden = false;
  $('[data-count]', results).textContent = hits.length ? `Найдено работ: ${hits.length}` : '';
  $('.pl-empty', results).hidden = !!hits.length;
  const rx = new RegExp('(' + words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
  $('.pl-rows', results).innerHTML = hits.map(r => `<li><button type="button" class="pl-row" data-work="${esc(r.name)}" data-price="${r.price}"><span class="pl-name">${esc(r.name).replace(rx, '<mark>$1</mark>')}<small>${esc(r.group)}</small></span><span class="pl-price">${from(r.price)}</span>${ARR}</button></li>`).join('');
});
$('#pl').addEventListener('click', e => { const r = e.target.closest('.pl-row'); if (!r) return; setWork(r.dataset.work, +r.dataset.price); haptic(); $('#booking').scrollIntoView({ behavior: 'smooth' }); setTimeout(() => form.name.focus({ preventScroll: true }), 700); });

/* live prices: services and prices edited in the bot admin panel */
function applyContent(c) {
  const gs = (c && c.groups || []).filter(g => g && g.id && Array.isArray(g.items));
  if (!gs.length) return;
  const cur = (tabs.find(b => b.getAttribute('aria-selected') === 'true') || { dataset: {} }).dataset.cat;
  $('.pl-tabs').innerHTML = gs.map(g => `<button type="button" role="tab" class="pl-tab" id="tab-${esc(g.id)}" data-cat="${esc(g.id)}" aria-controls="pl-${esc(g.id)}" aria-selected="false" tabindex="-1">${esc(g.name)}</button>`).join('');
  $$('.pl-group[data-group]').forEach(el => el.parentNode.removeChild(el));
  results.insertAdjacentHTML('beforebegin', gs.map(g => `<div class="pl-group" id="pl-${esc(g.id)}" role="tabpanel" aria-labelledby="tab-${esc(g.id)}" data-group="${esc(g.id)}" hidden><div class="pl-head"><h3>${esc(g.name)}</h3>${g.intro ? `<p>${esc(g.intro)}</p>` : ''}</div>
<ul class="pl-rows">${g.items.map(([n, p]) => `<li><button type="button" class="pl-row" data-work="${esc(n)}" data-price="${+p || 0}" data-group-name="${esc(g.short)}"><span class="pl-name">${esc(n)}</span><span class="pl-price">${from(+p)}</span>${ARR}</button></li>`).join('')}</ul>
${g.when ? `<p class="pl-when"><b>Когда обращаться.</b> ${esc(g.when)}</p>` : ''}</div>`).join(''));
  tabs = $$('.pl-tab');
  allRows = $$('.pl-group[data-group] .pl-row').map(b => ({ name: b.dataset.work, price: +b.dataset.price, group: b.dataset.groupName }));
  setCat(gs.some(g => g.id === cur) ? cur : gs[0].id, false, true);
  $$('.tile[data-cat]').forEach(t => {
    const g = gs.find(x => x.id === t.dataset.cat), el = $('.tile-foot b', t); if (!el) return;
    const p = g ? g.items.map(i => +i[1]).filter(Boolean) : [];
    el.textContent = from(p.length ? Math.min(...p) : 0);
  });
  const sel = $('#form select[name=brand]');
  if (sel && Array.isArray(c.brands) && c.brands.length) {
    const v = sel.value;
    sel.innerHTML = [...c.brands, 'Другая марка'].map(b => `<option>${esc(b)}</option>`).join('');
    if ([...sel.options].some(o => o.value === v)) sel.value = v;
  }
}
if (WL.api) {
  const ctl = 'AbortController' in window ? new AbortController() : null;
  if (ctl) setTimeout(() => ctl.abort(), 5000);
  fetch(WL.api.replace(/\/$/, '') + '/api/content', ctl ? { signal: ctl.signal } : {})
    .then(r => (r.ok ? r.json() : null)).then(c => { if (c && c.custom) applyContent(c); }).catch(() => {});
}

/* booking form */
const form = $('#form'), est = $('#est');
function setWork(name, price) {
  form.work.value = name;
  est.innerHTML = `<div class="est"><span>${esc(name)}<small>предварительная стоимость работы</small></span><b>${from(price)}</b><button type="button" aria-label="Убрать работу" data-clear>✕</button></div>`;
}
est.addEventListener('click', e => { if (e.target.closest('[data-clear]')) { est.innerHTML = ''; form.work.value = ''; form.work.focus(); } });
form.work.addEventListener('input', () => { if (est.innerHTML) est.innerHTML = ''; });

// days & slots
function days(n = 6) {
  const out = [], now = local(), M = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'], W = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  for (let i = now.getUTCHours() >= 17 ? 1 : 0; out.length < n && i < 30; i++) {
    const x = new Date(now.getTime() + i * 864e5), d = dow(x); if (!WL.hours[d]) continue;
    out.push({ iso: x.toISOString().slice(0, 10), label: (i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : W[d - 1]) + ', ' + x.getUTCDate() + ' ' + M[x.getUTCMonth()].slice(0, 3) + (M[x.getUTCMonth()].length > 4 ? '' : ''), full: (i === 0 ? 'сегодня' : i === 1 ? 'завтра' : W[d - 1]) + ', ' + x.getUTCDate() + ' ' + M[x.getUTCMonth()] });
  }
  return out;
}
const chip = (name, value, label, checked) => `<label class="chip"><input type="radio" name="${name}" value="${esc(value)}" ${checked ? 'checked' : ''}><span>${esc(label)}</span></label>`;
$('[data-days]').innerHTML = chip('day', '', 'Любой день', true) + days().map(d => chip('day', d.iso + '|' + d.full, d.label)).join('');
$('[data-slots]').innerHTML = chip('slot', '', 'Любое', true) + [['9:00–12:00', 'Утро, 9–12'], ['12:00–15:00', 'День, 12–15'], ['15:00–19:00', 'Вечер, 15–19']].map(([v, l]) => chip('slot', v, l)).join('');
form.addEventListener('change', e => { if (e.target.type === 'radio') haptic(); });

// phone mask +7 (XXX) XXX-XX-XX
const ph = form.phone;
function fmtPhone(v) {
  let d = v.replace(/\D/g, ''); if (!d) return '';
  if (d[0] === '8') d = '7' + d.slice(1); else if (d[0] !== '7') d = '7' + d;
  d = d.slice(0, 11); const p = d.slice(1);
  let s = '+7'; if (p.length) s += ' (' + p.slice(0, 3); if (p.length >= 3) s += ')'; if (p.length > 3) s += ' ' + p.slice(3, 6); if (p.length > 6) s += '-' + p.slice(6, 8); if (p.length > 8) s += '-' + p.slice(8, 10);
  return s;
}
ph.addEventListener('input', e => { if (e.inputType && e.inputType.startsWith('delete')) return; ph.value = fmtPhone(ph.value); });
ph.addEventListener('focus', () => { if (!ph.value) ph.value = '+7 '; });
ph.addEventListener('blur', () => { if (ph.value.replace(/\D/g, '').length <= 1) ph.value = ''; else ph.value = fmtPhone(ph.value); });
if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) form.name.value = [tg.initDataUnsafe.user.first_name].filter(Boolean).join(' ');

function fieldErr(input, msg) { const l = input.closest('label'); l.classList.toggle('err', !!msg); $('span', l).dataset.err = msg ? '— ' + msg : ''; return !msg; }
form.addEventListener('input', e => { const l = e.target.closest('.err'); l && l.classList.remove('err'); });
form.addEventListener('submit', async e => {
  e.preventDefault();
  const msg = $('.form-msg', form); msg.textContent = '';
  const okName = fieldErr(form.name, form.name.value.trim().length < 2 ? 'укажите имя' : '');
  const digits = ph.value.replace(/\D/g, ''), okPhone = fieldErr(ph, digits.length !== 11 ? 'проверьте номер' : '');
  if (!okName || !okPhone) { (okName ? ph : form.name).focus(); haptic(); return; }
  const day = (form.day.value || '').split('|'), data = {
    name: form.name.value.trim(), phone: '+' + digits, brand: form.brand.value, model: form.model.value.trim(), work: form.work.value.trim(),
    date: day[0] || '', dateText: day[1] || '', slot: form.slot.value, company: form.company.value, source: tg ? 'miniapp' : 'site', initData: tg ? tg.initData : '',
  };
  const btn = $('button[type=submit]', form); btn.setAttribute('aria-busy', 'true'); $('span', btn).textContent = 'Отправляем…';
  try {
    if (!WL.api) throw new Error('no api');
    const r = await fetch(WL.api.replace(/\/$/, '') + '/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) throw new Error(j.error || 'send failed');
    haptic('ok'); done(j.id, data);
  } catch (err) {
    btn.removeAttribute('aria-busy'); $('span', btn).textContent = 'Отправить заявку';
    msg.innerHTML = `Не получилось отправить заявку. Позвоните нам: <a href="tel:+79068977924"><b>+7 906 897-79-24</b></a> или запишитесь в <a href="https://t.me/vertlab_bot" target="_blank" rel="noopener"><b>Telegram-боте</b></a>.`;
  }
});
function done(id, d) {
  const when = [d.dateText, d.slot].filter(Boolean).join(', ');
  form.innerHTML = `<div class="done"><div class="done-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></div><h3>Заявка принята</h3>
  <p>${id ? `Номер заявки <span class="num">${esc(id)}</span>. ` : ''}Мастер перезвонит на ${esc(fmtPhone(d.phone))}${when ? ` и подтвердит время: ${esc(when)}` : ', чтобы подобрать удобное время'}.</p>
  ${tg ? '' : `<div class="actions"><a class="btn btn-ghost" href="https://t.me/vertlab_bot" target="_blank" rel="noopener"><span>Следить за заявкой в Telegram</span></a></div>`}</div>`;
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* map: load only on demand */
$('[data-map]').addEventListener('click', function () {
  const f = document.createElement('iframe');
  f.src = 'https://yandex.ru/map-widget/v1/?ll=53.226512%2C56.882068&z=16&pt=53.226512%2C56.882068%2Cpm2vlm&lang=ru_RU';
  f.title = 'WERTlab на карте'; f.loading = 'lazy'; f.allowFullscreen = true;
  this.replaceWith(f);
});
})();
