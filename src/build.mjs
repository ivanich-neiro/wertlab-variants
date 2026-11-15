// Builds index.html from data.mjs. Run: node src/build.mjs   (WL_API=https://... to set the booking endpoint)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { company as C, groups, money, minPrice } from './data.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'src', 'config.json'), 'utf8'));
const API = process.env.WL_API ?? cfg.api ?? '';
const SITE = cfg.site;
const v = Date.now().toString(36);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const G = id => groups.find(g => g.id === id);

const logo = (cls = '') => `<svg viewBox="0 0 244 62" role="img" aria-label="WERTlab" class="wordmark ${cls}"><text x="0" y="44" class="wert">WERT</text><g class="lab-blocks"><path d="M143 6 173 10 173 59 143 55Z"/><path d="M177 11 207 15 207 62 177 58Z"/><path d="M211 15 242 19 242 62 211 62Z"/></g><g class="lab-text"><text x="151" y="46">l</text><text x="181" y="50">a</text><text x="214" y="53">b</text></g></svg>`;
const I = {
  arrow: '<svg class="arr" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 4.5 16.5 10 11 15.5"/></svg>',
  pin: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11.7A7 7 0 0 0 5 9.3C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  phone: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5h2.8l1.4 4.2-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4.2 1.4v2.8a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/></svg>',
  clock: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  tg: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 4.5 3.5 11.3l5.6 2 2 6.2 3.2-3.8 4.9 3.6L21 4.5Z"/><path d="m9.1 13.3 8-6.3"/></svg>',
  star: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8Z"/></svg>',
  scan: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M8 12h8M12 8v8"/></svg>',
  doc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v4h4M9 12h6M9 16h4"/></svg>',
  tool: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8V20h3.2l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.3-.7-.7-2.3Z"/></svg>',
  search: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
};
const pic = (name, widths, alt, sizes, { lazy = true, cls = '' } = {}) => {
  const [a, b] = widths;
  return `<img src="img/${name}-${a}.webp" srcset="img/${name}-${a}.webp ${a}w, img/${name}-${b}.webp ${b}w" sizes="${sizes}" alt="${esc(alt)}" ${lazy ? 'loading="lazy" decoding="async"' : 'fetchpriority="high"'} ${cls ? `class="${cls}"` : ''}>`;
};

const tiles = [
  { cat: 'maintenance', img: 'service-maintenance', name: 'Плановое обслуживание', text: 'Масло, фильтры, свечи и технические жидкости по регламенту вашей модели.', alt: 'Мастер обслуживает BMW 5 серии на подъёмнике' },
  { cat: 'engine', img: 'service-engine', name: 'Двигатель и трансмиссия', text: 'ГРМ, течи, ремонт ГБЦ, АКПП и сцепление после точной диагностики.', alt: 'Автомобили BMW на постах ремонта' },
  { cat: 'suspension', img: 'service-suspension', name: 'Ходовая и сход-развал', text: 'Подвеска, рулевое управление, тормоза и геометрия колёс.', alt: 'Стенд сход-развала' },
  { cat: 'diagnostics', img: 'service-diagnostics', name: 'Диагностика и электрика', text: 'Компьютерная диагностика, поиск неисправностей, проверка перед покупкой.', alt: 'Диагностика автомобиля на подъёмнике' },
];

const nav = [['#services', 'Услуги'], ['#prices', 'Цены'], ['#process', 'Как работаем'], ['#studio', 'Сервис'], ['#contacts', 'Контакты']];

const priceGroup = (g, i) => `<div class="pl-group" id="pl-${g.id}" role="tabpanel" aria-labelledby="tab-${g.id}" data-group="${g.id}" ${i ? 'hidden' : ''}>
<div class="pl-head"><h3>${g.name}</h3><p>${g.intro}</p></div>
<ul class="pl-rows">${g.items.map(([n, p]) => `<li><button type="button" class="pl-row" data-work="${esc(n)}" data-price="${p}" data-group-name="${esc(g.short)}"><span class="pl-name">${n}</span><span class="pl-price">от ${money(p)}</span>${I.arrow}</button></li>`).join('')}</ul>
<p class="pl-when"><b>Когда обращаться.</b> ${g.when}</p></div>`;

const ld = {
  '@context': 'https://schema.org', '@type': 'AutoRepair', name: C.name, url: SITE, image: SITE + 'img/og.jpg', telephone: C.phone,
  address: { '@type': 'PostalAddress', streetAddress: 'ул. Буммашевская, 3а', addressLocality: 'Ижевск', addressRegion: 'Удмуртская Республика', addressCountry: 'RU' },
  geo: { '@type': 'GeoCoordinates', latitude: C.lat, longitude: C.lon },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '19:00' }],
  priceRange: '₽₽₽', brand: C.brands.map(name => ({ '@type': 'Brand', name })), sameAs: [C.map2gis],
};

const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>WERTlab — сервис BMW премиум-класса в Ижевске</title>
<meta name="description" content="Обслуживание и ремонт BMW, Porsche, Range Rover, Li Auto и Zeekr в Ижевске. Диагностика до начала ремонта, смета согласуется заранее. Буммашевская, 3а.">
<meta name="theme-color" content="#09090c">
<meta name="color-scheme" content="dark">
<link rel="canonical" href="${SITE}">
<meta property="og:type" content="website"><meta property="og:locale" content="ru_RU"><meta property="og:site_name" content="WERTlab">
<meta property="og:title" content="WERTlab — сервис премиум-класса в Ижевске"><meta property="og:description" content="BMW, Porsche, Range Rover, Li Auto и Zeekr. Диагностика, ТО и ремонт. Запись онлайн и в Telegram.">
<meta property="og:url" content="${SITE}"><meta property="og:image" content="${SITE}img/og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="img/icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Jost:wght@600&display=swap">
<link rel="preload" as="image" href="img/hero-1200.webp" imagesrcset="img/hero-600.webp 600w, img/hero-1200.webp 1200w" imagesizes="(max-width:1100px) 100vw, 560px" fetchpriority="high">
<link rel="stylesheet" href="site.css?v=${v}">
<script>if(!/[?&]static\b/.test(location.search))document.documentElement.classList.add('js');if(/tgWebApp/.test(location.hash+location.search)){document.documentElement.classList.add('tg');document.write('<script src="https://telegram.org/js/telegram-web-app.js"><\\/script>')}</script>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<a class="skip" href="#main">Перейти к содержанию</a>
<header class="nav" id="nav"><div class="wrap nav-in">
<a href="#top" class="brand" aria-label="WERTlab, на главную">${logo()}</a>
<nav class="nav-links" aria-label="Основное меню">${nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>
<a class="nav-phone" href="tel:${C.phone}">${I.phone}<span>${C.phoneText}</span></a>
<a class="btn btn-sm nav-cta" href="#booking"><span>Записаться</span></a>
<button class="burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu">${I.menu}</button>
</div></header>

<div class="menu" id="menu" hidden><div class="menu-in">
<div class="menu-top">${logo()}<button class="burger" type="button" data-close aria-label="Закрыть меню">${I.close}</button></div>
<nav aria-label="Мобильное меню">${nav.map(([h, t]) => `<a href="${h}" data-close>${t}</a>`).join('')}</nav>
<div class="menu-foot"><a class="btn btn-wide" href="#booking" data-close><span>Записаться на сервис</span>${I.arrow}</a><a class="btn btn-ghost btn-wide" href="tel:${C.phone}"><span>${C.phoneText}</span></a><p>${C.address}<br>${C.hoursText}</p></div>
</div></div>

<main id="main">
<section class="hero" id="top"><div class="wrap hero-grid">
<div class="hero-copy">
<p class="status rv" data-status><i></i><span>${C.hoursText}</span></p>
<h1 class="rv">Сервис<br><em>премиум-класса</em></h1>
<p class="lead rv">Обслуживание и ремонт BMW, Porsche, Range Rover, Li Auto и Zeekr в Ижевске</p>
<div class="actions rv"><a class="btn" href="#booking"><span>Записаться на сервис</span>${I.arrow}</a><a class="btn btn-ghost" href="#prices"><span>Цены на работы</span></a></div>
</div>
<figure class="hero-photo">${pic('hero', [600, 1200], 'Чёрный BMW 5 серии с номером WERTLAB 18', '(max-width:1100px) 100vw, 560px', { lazy: false })}<span class="plate" aria-hidden="true"><span class="pl-main">WERTLAB</span><span class="pl-reg"><b>18</b><small>RUS<i></i></small></span></span></figure>
</div>
<div class="wrap hero-bar"><ul class="feats">
<li>${I.scan}<span><b>Диагностика</b>до начала ремонта</span></li>
<li>${I.doc}<span><b>Смета</b>согласуем заранее</span></li>
<li>${I.tool}<span><b>10+ лет</b>опыта команды</span></li></ul>
<a class="hb-addr" href="${C.map2gis}" target="_blank" rel="noopener">${I.pin}${C.city}, Буммашевская, 3а</a></div>
</section>

<section class="intro section"><div class="wrap intro-grid">
<p class="statement rv">WERTlab — сервис, где <em>BMW</em> — основная специализация. Мы также обслуживаем Porsche, Range Rover, Li Auto и Zeekr и знаем, как устроены эти автомобили.</p>
<dl class="facts rv"><div><dt>10+ лет</dt><dd>опыта команды в ремонте автомобилей</dd></div><div><dt>5 марок</dt><dd>в постоянной работе, BMW — основная</dd></div><div><dt>${C.rating.value}</dt><dd><a href="${C.map2gis}" target="_blank" rel="noopener">рейтинг на ${C.rating.source}</a> по ${C.rating.count} отзывам</dd></div></dl>
</div>
<div class="wrap brands rv" aria-label="Марки на обслуживании">${C.brands.map((b, i) => `<span class="${i ? '' : 'main'}">${b}</span>`).join('')}</div>
</section>

<section class="section" id="services"><div class="wrap">
<div class="head rv"><h2>Чем мы <em>занимаемся</em></h2><p>Каждое направление начинается с диагностики. Работы и запчасти согласуем заранее.</p></div>
<div class="tiles">${tiles.map((x, i) => `<a class="tile t${i} rv" href="#prices" data-cat="${x.cat}"><figure class="ph">${pic(x.img, [720, 1440], x.alt, i % 3 === 0 ? '(max-width:760px) 100vw, (max-width:1100px) 50vw, 58vw' : '(max-width:760px) 100vw, (max-width:1100px) 50vw, 42vw')}</figure>
<div class="tile-body"><h3>${x.name}</h3><p>${x.text}</p><span class="tile-foot"><b>от ${money(minPrice(G(x.cat)))}</b><span class="tile-go"><span>Цены и запись</span><i>${I.arrow}</i></span></span></div></a>`).join('')}</div>
</div></section>

<section class="section prices-sec" id="prices"><div class="wrap">
<div class="head rv"><h2>Стоимость <em>работ</em></h2><p>Цена за работу, без учёта запчастей. Итоговую сумму называем до начала ремонта. Нажмите на работу, чтобы записаться.</p></div>
<div class="pl rv">
<div class="pl-side">
<label class="pl-search">${I.search}<input type="search" id="pl-q" placeholder="Найти работу" autocomplete="off" aria-label="Поиск по прайсу"></label>
<div class="pl-tabs" role="tablist" aria-label="Категории работ">${groups.map((g, i) => `<button type="button" role="tab" class="pl-tab" id="tab-${g.id}" data-cat="${g.id}" aria-controls="pl-${g.id}" aria-selected="${!i}" tabindex="${i ? -1 : 0}">${g.name}</button>`).join('')}</div>
</div>
<div class="pl-body" id="pl">${groups.map(priceGroup).join('')}
<div class="pl-group pl-results" id="pl-results" hidden><div class="pl-head"><h3>Результаты поиска</h3><p data-count></p></div><ul class="pl-rows"></ul><p class="pl-empty" hidden>Такой работы нет в прайсе. Опишите задачу в заявке, и мастер назовёт цену.</p></div>
</div></div>
</div></section>

<section class="section process" id="process"><div class="wrap">
<div class="head rv"><h2>Как мы <em>работаем</em></h2><p>Вы заранее знаете, что будет сделано и сколько это стоит.</p></div>
<ol class="steps">
<li class="rv"><span class="step-ico">${I.scan}</span><h3>Диагностика</h3><p>Находим причину и показываем, что требует внимания.</p></li>
<li class="rv"><span class="step-ico">${I.doc}</span><h3>Смета</h3><p>Согласуем список работ, запчасти и итоговую сумму.</p></li>
<li class="rv"><span class="step-ico">${I.tool}</span><h3>Ремонт</h3><p>Выполняем только то, о чём договорились.</p></li></ol>
</div></section>

<section class="section" id="studio"><div class="wrap">
<div class="head rv"><h2>Сервис <em>изнутри</em></h2><p>Пока идёт работа, можно подождать в клиентской зоне с кофе и Wi-Fi.</p></div>
<div class="mosaic">
<figure class="ph m1 rv">${pic('studio-lounge', [720, 1440], 'Клиентская зона WERTlab', '(max-width:760px) 100vw, 58vw')}<figcaption>Клиентская зона</figcaption></figure>
<figure class="ph m2 rv">${pic('studio-workshop', [600, 1080], 'Рабочие посты с подъёмниками', '(max-width:760px) 50vw, 42vw')}<figcaption>Рабочие посты</figcaption></figure>
<figure class="ph m3 rv">${pic('studio-waiting', [720, 1440], 'Зона ожидания', '(max-width:760px) 50vw, 42vw')}<figcaption>Зона ожидания</figcaption></figure>
<figure class="ph m4 rv">${pic('studio-facade', [720, 1440], 'Здание WERTlab на Буммашевской, 3а', '(max-width:760px) 50vw, 58vw')}<figcaption>Буммашевская, 3а</figcaption></figure>
</div></div></section>

<section class="section book" id="booking"><div class="wrap book-grid">
<div class="book-info rv"><h2>Записаться<br><em>на сервис</em></h2>
<p class="lead">Оставьте заявку, и мастер перезвонит, уточнит задачу и подтвердит время.</p>
<ul class="book-alt">
<li><a href="tel:${C.phone}">${I.phone}<span><b>${C.phoneText}</b>позвонить</span></a></li>
<li><a href="${C.bot}" target="_blank" rel="noopener">${I.tg}<span><b>@vertlab_bot</b>запись в Telegram</span></a></li>
</ul></div>
<form class="form rv" id="form" novalidate>
<div class="row2"><label><span>Имя</span><input name="name" autocomplete="name" required maxlength="60"></label>
<label><span>Телефон</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required></label></div>
<div class="row2"><label><span>Марка</span><select name="brand">${C.brands.map(b => `<option>${b}</option>`).join('')}<option>Другая марка</option></select></label>
<label><span>Модель и год <i>необязательно</i></span><input name="model" maxlength="60" placeholder="Например, X5 G05, 2021"></label></div>
<label><span>Что нужно сделать</span><textarea name="work" rows="3" maxlength="800" placeholder="Например, ТО на 60 000 км или стук в подвеске"></textarea></label>
<div id="est" aria-live="polite"></div>
<fieldset class="days"><legend>Удобный день</legend><div class="chips" data-days></div></fieldset>
<fieldset class="days"><legend>Время</legend><div class="chips" data-slots></div></fieldset>
<input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn btn-wide" type="submit"><span>Отправить заявку</span>${I.arrow}</button>
<p class="form-note">Нажимая кнопку, вы соглашаетесь на обработку имени и телефона для связи по заявке.</p>
<p class="form-msg" role="status" aria-live="polite"></p>
</form></div></section>

<section class="section contacts" id="contacts"><div class="wrap contacts-grid">
<div class="contact-card rv">
<h2>Как <em>добраться</em></h2>
<dl class="contact">
<div>${I.pin}<dt>Адрес</dt><dd>${C.address}</dd></div>
<div>${I.clock}<dt>Режим работы</dt><dd>${C.hoursText}<small data-status-text></small></dd></div>
<div>${I.phone}<dt>Телефон</dt><dd><a href="tel:${C.phone}">${C.phoneText}</a></dd></div>
</dl>
<div class="actions"><a class="btn" href="${C.mapYandex}" target="_blank" rel="noopener"><span>Маршрут в Яндекс Картах</span>${I.arrow}</a><a class="btn btn-ghost" href="${C.map2gis}" target="_blank" rel="noopener"><span>Открыть в 2ГИС</span></a></div>
</div>
<div class="map rv" id="map"><button type="button" class="map-load" data-map><span class="map-pin">${I.pin}</span><b>Показать карту</b><small>Загрузится карта Яндекса</small></button></div>
</div></section>
</main>

<footer class="foot"><div class="wrap"><div class="foot-grid">
<a href="#top" class="brand foot-logo" aria-label="WERTlab, наверх">${logo()}</a>
<div><h4>Контакты</h4><p><a href="tel:${C.phone}">${C.phoneText}</a><a href="${C.map2gis}" target="_blank" rel="noopener">${C.city}, Буммашевская, 3а</a><span>${C.hoursText}</span></p></div>
<div><h4>Разделы</h4><p>${nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</p></div>
<div><h4>Марки</h4><p>${C.brands.join(', ')}</p></div></div>
<div class="foot-base"><span>© ${new Date().getFullYear()} WERTlab</span><span>Цены на сайте предварительные и не являются публичной офертой</span></div></div></footer>

<div class="dock" id="dock"><a class="btn btn-ghost" href="tel:${C.phone}">${I.phone}<span>Позвонить</span></a><a class="btn" href="#booking"><span>Записаться</span></a></div>
<script>window.WL={api:${JSON.stringify(API)},groups:${JSON.stringify(groups.map(g => ({ id: g.id, short: g.short, name: g.name })))},hours:${JSON.stringify(C.hours)},tz:${C.tzOffset}}</script>
<script src="site.js?v=${v}" defer></script>
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log('index.html', html.length, 'bytes; api =', API || '(none)');
