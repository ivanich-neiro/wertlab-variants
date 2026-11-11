if(!/static/.test(location.search))document.documentElement.classList.add("js");
const U=id=>'https://images.unsplash.com/photo-'+id+'?auto=format&fit=crop&w=1800&q=80';
const themes=[
 {id:'red',name:'Графит и красный',dot:'#e10600',hero:'split',img:U('1542906042-f41e62496963'),pos:'50% 100%',alt:'Чёрный BMW 5 серии, вид сзади',
  h1:'Премиум-сервис<br>для <em>BMW</em>',lead:'Сервис премиум-класса в Ижевске. Также обслуживаем Porsche, Range Rover, Li Auto и Zeekr'},
 {id:'violet',name:'Чёрный и фиолетовый',dot:'#8a2eff',hero:'split',img:U('1714434087907-c584172d0c80'),pos:'40% 60%',alt:'Чёрный BMW 5 серии G30',
  h1:'Сервис<br><em>премиум-класса</em>',lead:'Обслуживание и ремонт BMW, Porsche, Range Rover, Li Auto и Zeekr в Ижевске'},
 {id:'blue',name:'Ночь и синий',dot:'#2f6bff',hero:'split',img:U('1632239524459-5c3137fcdae9'),pos:'50% 45%',alt:'BMW в ночном паркинге',
  h1:'Точная диагностика<br><em>и честный ремонт</em>',lead:'Сервис премиум-класса для BMW, Porsche, Range Rover, Li Auto и Zeekr в Ижевске'},
 {id:'orange',name:'Уголь и оранжевый',dot:'#ff5b14',hero:'split',img:U('1634131519161-ca82f1681210'),pos:'45% 55%',alt:'BMW 5 серии на закате',
  h1:'Мастерская<br><em>премиум-класса</em>',lead:'Двигатели, коробки передач, подвеска и плановое ТО для BMW, Porsche, Range Rover, Li Auto и Zeekr'},
 {id:'gold',name:'Чёрный и золото',dot:'#c9a66b',hero:'center',img:'assets/porsche.jpg',pos:'center 35%',alt:'Porsche Panamera',
  h1:'Внимание к деталям<br><em>вашего автомобиля</em>',lead:'Сервис премиум-класса для BMW, Porsche, Range Rover, Li Auto и Zeekr в Ижевске'}
];
const map='https://2gis.ru/izhevsk/firm/70000001037240729';
const groups=[
{id:'maintenance',name:'Техническое обслуживание',intro:'Плановое ТО с учётом модели и пробега.',when:'Подошёл срок ТО, купили автомобиль с пробегом или собираетесь в дальнюю поездку.',items:[['Замена моторного масла и фильтра',1990],['Замена воздушного фильтра',790],['Замена салонного фильтра',990],['Замена свечей зажигания',2490],['Замена антифриза',2990],['Замена тормозной жидкости',2490],['Замена приводного ремня',2990]]},
{id:'suspension',name:'Подвеска и рулевое',intro:'Проверка ходовой и замена изношенных деталей.',when:'Стуки, люфт руля, вибрация, автомобиль хуже держит дорогу.',items:[['Диагностика ходовой части',1490],['Замена рычага подвески',2990],['Замена сайлентблока',2490],['Замена шаровой опоры',1990],['Замена рулевого наконечника',1990],['Замена амортизатора',4490],['Замена ступичного подшипника',4990]]},
{id:'brakes',name:'Тормозная система',intro:'Колодки, диски, суппорты и жидкость.',when:'Скрип или биение, увеличился ход педали, загорелся индикатор износа.',items:[['Замена тормозных колодок',2490],['Замена дисков и колодок',4990],['Обслуживание суппорта',2990],['Замена тормозного шланга',1990],['Прокачка тормозной системы',1990]]},
{id:'engine',name:'Двигатель',intro:'Объём ремонта определяем по результатам диагностики.',when:'Двигатель работает неровно, расходует масло, перегревается или теряет мощность.',items:[['Диагностика двигателя',2490],['Замена цепи ГРМ',29990],['Замена ремня ГРМ',11990],['Устранение течи масла',4990],['Замена термостата',4990],['Ремонт ГБЦ',24990],['Капитальный ремонт двигателя',69990]]},
{id:'transmission',name:'КПП и сцепление',intro:'АКПП, МКПП, раздаточная коробка и приводы.',when:'Рывки, задержки переключения, пробуксовка, гул или вибрации.',items:[['Диагностика коробки передач',2490],['Замена масла в АКПП',5990],['Ремонт АКПП',39990],['Ремонт МКПП',24990],['Замена сцепления',21990],['Замена маховика при снятой КПП',4990],['Замена масла в раздаточной коробке',2490],['Замена ШРУСа',4990]]},
{id:'diagnostics',name:'Диагностика и электрика',intro:'Ищем причину неисправности, а не меняем всё подряд.',when:'Горит ошибка, не работает оборудование или нужна проверка перед покупкой.',items:[['Компьютерная диагностика',2490],['Поиск неисправности электрики',2990],['Проверка датчика',1490],['Диагностика системы зажигания',2490],['Проверка АКБ и зарядки',990],['Проверка перед покупкой',7990]]},
{id:'tires',name:'Шиномонтаж',intro:'Цена зависит от диаметра диска и типа шины.',when:'Сезонная смена шин или вибрация на скорости.',items:[['Шиномонтаж 4 колёс R17',3990],['Шиномонтаж 4 колёс R18',4490],['Шиномонтаж 4 колёс R19–R20',5990],['Балансировка колеса',790],['Снятие и установка колеса',490]]},
{id:'alignment',name:'Сход-развал',intro:'Проверка и регулировка углов установки колёс.',when:'Автомобиль уводит, руль стоит криво, шины изнашиваются неравномерно.',items:[['Проверка углов установки',1990],['Сход-развал передней оси',2990],['Сход-развал двух осей',4490]]}
];
const tiles=[
 {cat:'maintenance',img:'interior-7.jpg',name:'Плановое обслуживание',text:'Масло, фильтры, свечи и технические жидкости по регламенту вашей модели.'},
 {cat:'engine',img:'workshop-enhanced.jpg',name:'Двигатель и трансмиссия',text:'ГРМ, течи, ремонт ГБЦ, АКПП и сцепление — после точной диагностики.'},
 {cat:'suspension',img:'interior-5.jpg',name:'Ходовая и сход-развал',text:'Подвеска, рулевое управление, тормоза и геометрия колёс.'},
 {cat:'diagnostics',img:'interior-2.jpg',name:'Диагностика и электрика',text:'Компьютерная диагностика, поиск неисправностей, проверка перед покупкой.'}
];
const money=n=>new Intl.NumberFormat('ru-RU').format(n).replace(/\s/g,' ')+' ₽';
const minPrice=g=>Math.min(...g.items.map(i=>i[1]));
const G=id=>groups.find(g=>g.id===id);
const find=name=>{for(const g of groups)for(const i of g.items)if(i[0]===name)return i;return null};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const site=document.querySelector('#site');
let t=0,active='maintenance';

const logo=()=>`<svg viewBox="0 0 244 62" role="img" aria-label="WERTlab" class="wordmark"><text x="0" y="44" class="wert">WERT</text><g class="lab-blocks"><path d="M143 6 173 10 173 59 143 55Z"/><path d="M177 11 207 15 207 62 177 58Z"/><path d="M211 15 242 19 242 62 211 62Z"/></g><g class="lab-text"><text x="151" y="46">l</text><text x="181" y="50">a</text><text x="214" y="53">b</text></g></svg>`;
const arrow='<svg class="arr" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 4.5 16.5 10 11 15.5"/></svg>';
const pin='<svg class="ico" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 18s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10Z"/><circle cx="10" cy="8" r="2.2"/></svg>';
const btn=(label,cls='',attrs='data-go="booking"',ico=true)=>`<button class="btn ${cls}" ${attrs}><span>${label}</span>${ico?arrow:''}</button>`;
const lnk=(label,href,cls='',ext=false)=>`<a class="btn ${cls}" href="${href}" ${ext?'target="_blank" rel="noopener"':''}><span>${label}</span></a>`;

function header(){return `<header class="nav"><div class="wrap nav-in"><a href="#top" class="brand" aria-label="WERTlab">${logo()}</a>
<nav class="nav-links"><a href="#services">Услуги</a><a href="#prices">Цены</a><a href="#studio">Сервис</a><a href="#booking">Контакты</a></nav>
${btn('Записаться','btn-sm')}</div></header>`}

function heroBar(){const ic={
 scan:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M8 12h8M12 8v8"/></svg>',
 doc:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v4h4M9 12h6M9 16h4"/></svg>',
 tool:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8V20h3.2l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.3-.7-.7-2.3Z"/></svg>'};
 return `<div class="hero-bar wrap"><ul class="feats"><li>${ic.scan}<span><b>Диагностика</b>до начала ремонта</span></li><li>${ic.doc}<span><b>Смета</b>согласуем заранее</span></li><li>${ic.tool}<span><b>10+ лет</b>опыта команды</span></li></ul><a class="hb-addr" href="${map}" target="_blank" rel="noopener">${pin}Ижевск, Буммашевская, 3а</a></div>`}

function hero(){const th=themes[t];const acts=`<div class="actions">${btn('Записаться на сервис')}${lnk('Цены на работы','#prices',th.id==='red'||th.id==='orange'?'btn-white':'btn-ghost')}</div>`;
 return `<section class="hero hero-stage" id="top"><div class="stage-bg" aria-hidden="true"><span class="ghost">WERTlab</span><i class="beam b1"></i><i class="beam b2"></i></div><div class="wrap stage-grid">
 <div class="hero-copy"><h1 class="rv">${th.h1}</h1><p class="lead rv">${th.lead}</p>${acts}</div>
 <figure class="hero-photo"><img src="assets/hero-car.jpg" alt="Чёрный BMW 5 серии" width="1200" height="1500" fetchpriority="high">${th.id==='violet'?'<span class="plate" role="img" aria-label="Номерной знак WERTLAB 18"><span class="pl-main">WERTLAB</span><span class="pl-reg"><b>18</b><small>RUS<i></i></small></span></span>':''}</figure>
 </div>${heroBar()}</section>`}

function intro(){return `<section class="intro section"><div class="wrap intro-grid">
 <p class="statement rv">WERTlab — сервис, где <em>BMW</em> — основная специализация. Мы также обслуживаем Porsche, Range Rover, Li Auto и Zeekr и знаем, как устроены эти автомобили.</p>
 <div class="intro-side rv">
 <dl class="facts"><div><dt>10+ лет</dt><dd>опыта команды в ремонте автомобилей</dd></div><div><dt>5 марок</dt><dd>в постоянной работе, BMW — основная</dd></div></dl></div></div></section>`}

function services(){return `<section class="section" id="services"><div class="wrap">
 <div class="head rv"><h2>Чем мы <em>занимаемся</em></h2><p>Каждое направление начинается с диагностики. Работы и запчасти согласуем заранее.</p></div>
 <div class="tiles">${tiles.map((x,i)=>`<button class="tile t${i} rv" data-cat="${x.cat}" data-go="prices"><figure class="ph"><img src="assets/${x.img}" alt="" loading="lazy"></figure>
 <div class="tile-body"><h3>${x.name}</h3><p>${x.text}</p><span class="tile-foot"><b>от ${money(minPrice(G(x.cat)))}</b><i>${arrow}</i></span></div></button>`).join('')}</div></div></section>`}

function priceBody(){const g=G(active);return `<div class="pl-head"><h3>${g.name}</h3><p>${g.intro}</p></div>
<ul class="pl-rows">${g.items.map(([n,p])=>`<li><button class="pl-row" data-work="${esc(n)}" data-go="booking"><span class="pl-name">${n}</span><span class="pl-price">от ${money(p)}</span><i>${arrow}</i></button></li>`).join('')}</ul>
<p class="pl-when"><b>Когда обращаться.</b> ${g.when}</p>`}

function prices(){return `<section class="section prices-sec" id="prices"><div class="wrap">
 <div class="head rv"><h2>Стоимость <em>работ</em></h2><p>Цена за работу, без учёта запчастей. Итоговую сумму называем до начала ремонта.</p></div>
 <div class="pl rv"><div class="pl-tabs" role="tablist">${groups.map(g=>`<button role="tab" class="pl-tab ${g.id===active?'on':''}" data-cat="${g.id}" aria-selected="${g.id===active}">${g.name}</button>`).join('')}</div>
 <div class="pl-body" id="pl">${priceBody()}</div></div></div></section>`}

function band(){return `<section class="band"><div class="band-media ph"><img src="assets/interior-6.jpg" alt="" loading="lazy"></div>
 <div class="wrap band-in"><ol class="steps rv"><li><h3>Диагностика</h3><p>Находим причину и показываем, что требует внимания.</p></li><li><h3>Смета</h3><p>Согласуем список работ, запчасти и итоговую сумму.</p></li><li><h3>Ремонт</h3><p>Выполняем только то, о чём договорились.</p></li></ol></div></section>`}

function studio(){return `<section class="section" id="studio"><div class="wrap">
 <div class="head rv"><h2>Сервис <em>изнутри</em></h2><p>Пока идёт работа, можно подождать в клиентской зоне.</p></div>
 <div class="mosaic"><figure class="ph m1 rv"><img src="assets/lounge-enhanced.jpg" alt="Клиентская зона" loading="lazy"><figcaption>Клиентская зона</figcaption></figure>
 <figure class="ph m2 rv"><img src="assets/workshop-real.jpg" alt="Рабочие посты" loading="lazy"><figcaption>Рабочие посты</figcaption></figure>
 <figure class="ph m3 rv"><img src="assets/interior-3.jpg" alt="Зона ожидания" loading="lazy"><figcaption>Зона ожидания</figcaption></figure>
 <figure class="ph m4 rv"><img src="assets/main-branch.jpg" alt="Фасад WERTlab" loading="lazy"><figcaption>Буммашевская, 3а</figcaption></figure></div></div></section>`}

function booking(){return `<section class="section book" id="booking"><div class="wrap book-grid">
 <div class="book-info rv"><h2>Записаться<br><em>на сервис</em></h2><p class="lead">Оставьте заявку — мастер свяжется, уточнит задачу и предложит удобное время.</p>
 <dl class="contact"><div><dt>Адрес</dt><dd><a href="${map}" target="_blank" rel="noopener">Ижевск, ул. Буммашевская, 3а</a></dd></div><div><dt>Обслуживаем</dt><dd>BMW, Porsche, Range Rover, Li Auto, Zeekr</dd></div></dl>
 ${lnk('Построить маршрут',map,'btn-ghost',true)}</div>
 <form class="form rv" id="form" novalidate><div class="row2"><label><span>Имя</span><input name="name" autocomplete="name" required></label><label><span>Телефон</span><input name="phone" type="tel" autocomplete="tel" placeholder="+7" required></label></div>
 <label><span>Автомобиль</span><select name="brand"><option>BMW</option><option>Porsche</option><option>Range Rover</option><option>Li Auto</option><option>Zeekr</option></select></label>
 <label><span>Что нужно сделать</span><textarea name="work" rows="3" placeholder="Например, ТО на 60 000 км или стук в подвеске"></textarea></label>
 <div id="est"></div>${btn('Отправить заявку','btn-wide','type="submit"')}<p class="form-note">Макет: заявка никуда не отправляется.</p></form></div></section>`}

function footer(){return `<footer class="foot"><div class="wrap"><div class="foot-grid"><a href="#top" class="brand foot-logo" aria-label="WERTlab">${logo()}</a>
 <div><h4>Адрес</h4><p><a href="${map}" target="_blank" rel="noopener">Ижевск, Буммашевская, 3а</a></p></div>
 <div><h4>Разделы</h4><p><a href="#services">Услуги</a><a href="#prices">Цены</a><a href="#studio">Сервис</a><a href="#booking">Запись</a></p></div>
 <div><h4>Марки</h4><p>BMW, Porsche, Range Rover, Li Auto, Zeekr</p></div></div>
 <div class="foot-base"><span>© WERTlab</span><span>Цены на сайте предварительные</span></div></div></footer>`}

function setCat(id){active=id;document.querySelectorAll('.pl-tab').forEach(b=>{const on=b.dataset.cat===id;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});const pl=document.querySelector('#pl');pl.innerHTML=priceBody();pl.classList.remove('swap');void pl.offsetWidth;pl.classList.add('swap')}
function setWork(w){const f=document.querySelector('#form');f.work.value=w;const e=find(w);document.querySelector('#est').innerHTML=e?`<div class="est"><span>${esc(e[0])}</span><b>от ${money(e[1])}</b></div>`:''}

let io;function reveal(){io?.disconnect();io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});document.querySelectorAll('.rv,.ph').forEach(el=>io.observe(el))}

function render(){const th=themes[t];document.body.className=th.id;
 site.innerHTML=header()+hero()+intro()+services()+prices()+band()+studio()+booking()+footer();
 document.querySelectorAll('.switcher-tabs button').forEach((b,i)=>{b.classList.toggle('on',i===t);b.setAttribute('aria-pressed',i===t)});document.title='WERTlab — '+th.name;reveal()}

document.querySelector('.switcher-tabs').innerHTML=themes.map((th,i)=>`<button data-theme="${i}" aria-pressed="false"><i style="background:${th.dot}"></i>${th.name}</button>`).join('');
document.addEventListener('click',e=>{const th=e.target.closest('[data-theme]');if(th){t=+th.dataset.theme;history.replaceState(null,'','#v'+(t+1));render();scrollTo({top:0,behavior:'instant'});return}
 const el=e.target.closest('[data-cat],[data-work],[data-go]');if(!el)return;
 if(el.dataset.cat)setCat(el.dataset.cat);if(el.dataset.work)setWork(el.dataset.work);
 if(el.dataset.go&&el.type!=='submit'){e.preventDefault();document.getElementById(el.dataset.go).scrollIntoView({behavior:'smooth'});if(el.dataset.go==='booking')setTimeout(()=>document.querySelector('#form [name=name]').focus({preventScroll:true}),600)}});
document.addEventListener('submit',e=>{if(e.target.id!=='form')return;e.preventDefault();const f=e.target;let ok=true;['name','phone'].forEach(n=>{const bad=!f[n].value.trim();f[n].closest('label').classList.toggle('err',bad);if(bad)ok=false});
 if(!ok){f.querySelector('.err input').focus();return}f.innerHTML=`<div class="done"><h3>Заявка принята</h3><p>В рабочей версии мастер перезвонит, чтобы подтвердить время. Сейчас это демонстрация.</p></div>`});
document.addEventListener('input',e=>{if(e.target.closest('.err'))e.target.closest('.err').classList.remove('err')});
const m=location.hash.match(/^#v([1-5])$/)||location.search.match(/[?&]v=([1-5])\b/);t=m?+m[1]-1:0;render();
try{const tg=window.Telegram&&Telegram.WebApp;if(tg&&tg.initData!==undefined){tg.ready();tg.expand();tg.setHeaderColor&&tg.setHeaderColor('#0b0b0e');tg.setBackgroundColor&&tg.setBackgroundColor('#0b0b0e')}}catch(e){}
