// Single source of truth for the site and the Telegram bot.
// Prices are preliminary (see concepts/PRICES-AND-PHOTOS.md) and must be confirmed by WERTlab.

export const company = {
  name: 'WERTlab',
  phone: '+79068977924',
  phoneText: '+7 906 897-79-24',
  telegram: 'https://t.me/+79068977924',
  bot: 'https://t.me/vertlab_bot',
  city: 'Ижевск',
  street: 'ул. Буммашевская, 3а',
  address: 'Ижевск, ул. Буммашевская, 3а',
  lat: 56.882068,
  lon: 53.226512,
  map2gis: 'https://2gis.ru/izhevsk/firm/70000001037240729',
  mapYandex: 'https://yandex.ru/maps/?rtext=~56.882068%2C53.226512&rtt=auto',
  // Monday = 1 ... Sunday = 7; Izhevsk time is UTC+4
  hours: { 1: [9, 19], 2: [9, 19], 3: [9, 19], 4: [9, 19], 5: [9, 19] },
  hoursText: 'Пн–Пт 9:00–19:00',
  tzOffset: 4,
  rating: { value: '4,9', count: 20, source: '2ГИС' },
  brands: ['BMW', 'Porsche', 'Range Rover', 'Li Auto', 'Zeekr'],
};

export const groups = [
  { id: 'maintenance', name: 'Техническое обслуживание', short: 'ТО', intro: 'Плановое ТО с учётом модели и пробега.', when: 'Подошёл срок ТО, купили автомобиль с пробегом или собираетесь в дальнюю поездку.',
    items: [['Замена моторного масла и фильтра', 1990], ['Замена воздушного фильтра', 790], ['Замена салонного фильтра', 990], ['Замена свечей зажигания', 2490], ['Замена антифриза', 2990], ['Замена тормозной жидкости', 2490], ['Замена приводного ремня', 2990]] },
  { id: 'diagnostics', name: 'Диагностика и электрика', short: 'Диагностика', intro: 'Ищем причину неисправности, а не меняем всё подряд.', when: 'Горит ошибка, не работает оборудование или нужна проверка перед покупкой.',
    items: [['Компьютерная диагностика', 2490], ['Поиск неисправности электрики', 2990], ['Проверка датчика', 1490], ['Диагностика системы зажигания', 2490], ['Проверка АКБ и зарядки', 990], ['Проверка перед покупкой', 7990]] },
  { id: 'engine', name: 'Двигатель', short: 'Двигатель', intro: 'Объём ремонта определяем по результатам диагностики.', when: 'Двигатель работает неровно, расходует масло, перегревается или теряет мощность.',
    items: [['Диагностика двигателя', 2490], ['Замена цепи ГРМ', 29990], ['Замена ремня ГРМ', 11990], ['Устранение течи масла', 4990], ['Замена термостата', 4990], ['Ремонт ГБЦ', 24990], ['Капитальный ремонт двигателя', 69990]] },
  { id: 'transmission', name: 'КПП и сцепление', short: 'КПП', intro: 'АКПП, МКПП, раздаточная коробка и приводы.', when: 'Рывки, задержки переключения, пробуксовка, гул или вибрации.',
    items: [['Диагностика коробки передач', 2490], ['Замена масла в АКПП', 5990], ['Ремонт АКПП', 39990], ['Ремонт МКПП', 24990], ['Замена сцепления', 21990], ['Замена маховика при снятой КПП', 4990], ['Замена масла в раздаточной коробке', 2490], ['Замена ШРУСа', 4990]] },
  { id: 'suspension', name: 'Подвеска и рулевое', short: 'Подвеска', intro: 'Проверка ходовой и замена изношенных деталей.', when: 'Стуки, люфт руля, вибрация, автомобиль хуже держит дорогу.',
    items: [['Диагностика ходовой части', 1490], ['Замена рычага подвески', 2990], ['Замена сайлентблока', 2490], ['Замена шаровой опоры', 1990], ['Замена рулевого наконечника', 1990], ['Замена амортизатора', 4490], ['Замена ступичного подшипника', 4990]] },
  { id: 'brakes', name: 'Тормозная система', short: 'Тормоза', intro: 'Колодки, диски, суппорты и жидкость.', when: 'Скрип или биение, увеличился ход педали, загорелся индикатор износа.',
    items: [['Замена тормозных колодок', 2490], ['Замена дисков и колодок', 4990], ['Обслуживание суппорта', 2990], ['Замена тормозного шланга', 1990], ['Прокачка тормозной системы', 1990]] },
  { id: 'tires', name: 'Шиномонтаж', short: 'Шиномонтаж', intro: 'Цена зависит от диаметра диска и типа шины.', when: 'Сезонная смена шин или вибрация на скорости.',
    items: [['Шиномонтаж 4 колёс R17', 3990], ['Шиномонтаж 4 колёс R18', 4490], ['Шиномонтаж 4 колёс R19–R20', 5990], ['Балансировка колеса', 790], ['Снятие и установка колеса', 490]] },
  { id: 'alignment', name: 'Сход-развал', short: 'Сход-развал', intro: 'Проверка и регулировка углов установки колёс.', when: 'Автомобиль уводит, руль стоит криво, шины изнашиваются неравномерно.',
    items: [['Проверка углов установки', 1990], ['Сход-развал передней оси', 2990], ['Сход-развал двух осей', 4490]] },
];

export const money = n => new Intl.NumberFormat('ru-RU').format(n).replace(/\s/g, ' ') + ' ₽';
export const minPrice = g => Math.min(...g.items.map(i => i[1]));
export const findWork = name => { for (const g of groups) for (const i of g.items) if (i[0] === name) return { group: g, name: i[0], price: i[1] }; return null; };

// Working-day helpers in Izhevsk time
export function localNow(d = new Date()) { return new Date(d.getTime() + company.tzOffset * 3600e3); } // use getUTC* on the result
export function isoDow(d) { return ((d.getUTCDay() + 6) % 7) + 1; }
export function openState(d = new Date()) {
  const n = localNow(d), h = n.getUTCHours() + n.getUTCMinutes() / 60, today = company.hours[isoDow(n)];
  if (today && h >= today[0] && h < today[1]) return { open: true, text: `Открыто до ${today[1]}:00` };
  for (let i = 0; i < 8; i++) {
    const x = new Date(n.getTime() + i * 864e5), w = company.hours[isoDow(x)];
    if (!w || (i === 0 && h >= w[0])) continue;
    const day = i === 0 ? 'сегодня' : i === 1 ? 'завтра' : ['в понедельник', 'во вторник', 'в среду', 'в четверг', 'в пятницу', 'в субботу', 'в воскресенье'][isoDow(x) - 1];
    return { open: false, text: `Откроемся ${day} в ${w[0]}:00` };
  }
  return { open: false, text: company.hoursText };
}
// Next N working days as {iso:'2026-11-17', label:'Пн, 17 ноября', short:'Пн 17.11'}
export function workingDays(n = 6, d = new Date()) {
  const out = [], now = localNow(d), M = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'], W = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const lateToday = now.getUTCHours() >= 17;
  for (let i = lateToday ? 1 : 0; out.length < n && i < 30; i++) {
    const x = new Date(now.getTime() + i * 864e5), dow = isoDow(x);
    if (!company.hours[dow]) continue;
    const dd = x.getUTCDate(), mm = x.getUTCMonth();
    out.push({ iso: x.toISOString().slice(0, 10), label: `${i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : W[dow - 1]}, ${dd} ${M[mm]}`, short: `${W[dow - 1]} ${String(dd).padStart(2, '0')}.${String(mm + 1).padStart(2, '0')}` });
  }
  return out;
}
export const timeSlots = [['morning', '9:00–12:00'], ['day', '12:00–15:00'], ['evening', '15:00–19:00']];
