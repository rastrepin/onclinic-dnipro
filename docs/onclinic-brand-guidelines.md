# onclinic-brand-guidelines.md
## ОН Клінік Харків — Brand Guidelines для Cowork

Версія: 2.0 · Квітень 2026
Зміни в 2.0: шрифтовий стек змінено на Source Serif 4 + Fixel (A/B тест підтверджено на /kharkiv/kolporafia). Додано sticky CTA мобільна, carousel паттерн, правила форми.

---

## Кольори

```css
--blue-deep: #0B4F9A;      /* primary — кнопки, hero, заголовки */
--blue-mid:  #1a6bc7;      /* secondary — hover, акценти */
--blue-light: #dbeafe;     /* selected state, backgrounds */
--gold:      #C49A1A;      /* accent — CTA кнопки, ціни, іконки */
--gold2:     #e8b820;      /* gold hover, H1 accent */
--gold-bg:   #fffbeb;      /* callout backgrounds */
--bg:        #f8fafc;      /* сторінка background */
--white:     #ffffff;
--text:      #0f172a;
--muted:     #64748b;
--border:    #e2e8f0;
--radius:    12px;
```

**Заборонено:**
- `#005485`, `#04D3D9` — кольори платформи check-up.in.ua
- `#05121e` — dark theme платформи
- Pill кнопки `border-radius: 40px`

---

## Шрифти

**Новий стек (з квітня 2026, підтверджено на кольпорафії):**

```
H1 Hero:    Source Serif 4 — основний + italic акцент
H2, H3:     Fixel Display
Body, UI:   Fixel Text
```

Google Fonts підключення:
```html
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&family=Fixel+Display:wght@600;700&family=Fixel+Text:wght@400;500;600&display=swap" rel="stylesheet">
```

### Використання

**H1 (тільки в Hero):**
```css
font-family: 'Source Serif 4', serif;
font-weight: 600;
font-size: clamp(28px, 6vw, 56px);
line-height: 1.18;
letter-spacing: -0.02em;
color: white;
```

**H1 акцентне слово (em або span):**
```css
font-style: italic;
color: var(--gold2);
```

**H2:**
```css
font-family: 'Fixel Display', sans-serif;
font-weight: 700;
font-size: clamp(22px, 4vw, 28px);
line-height: 1.25;
letter-spacing: -0.01em;
```

**H3:**
```css
font-family: 'Fixel Display', sans-serif;
font-weight: 600;
font-size: 18px;
line-height: 1.3;
```

**Body, параграфи:**
```css
font-family: 'Fixel Text', sans-serif;
font-weight: 400;
font-size: 16px;
line-height: 1.6;
color: var(--text);
```

**Кнопки, labels, FAQ, ціни, факти:**
```css
font-family: 'Fixel Text', sans-serif;
```

**Заборонено:**
- Onest — замінено на Fixel Text/Display
- Cormorant Garamond — замінено на Source Serif 4
- Inter
- Source Serif 4 для цифр, цін, фактів

---

## Кнопки

```css
/* Primary (золота) — головний CTA */
.btn-primary {
  background: var(--gold);
  color: white;
  padding: 14px 32px;
  border-radius: 8px;
  font-family: 'Fixel Text', sans-serif;
  font-weight: 700;
  font-size: 15px;
  border: none;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.btn-primary:hover { background: var(--gold2); }

/* Outline — secondary CTA на темному фоні */
.btn-outline {
  background: transparent;
  color: white;
  padding: 14px 28px;
  border-radius: 8px;
  font-family: 'Fixel Text', sans-serif;
  font-weight: 600;
  font-size: 15px;
  border: 1.5px solid rgba(255,255,255,0.35);
}

/* Outline — на світлому фоні */
.btn-outline-dark {
  border: 2px solid var(--blue-deep);
  color: var(--blue-deep);
  border-radius: 8px;
  font-family: 'Fixel Text', sans-serif;
}
```

---

## Sticky CTA — мобільна (новий паттерн)

З'являється при скролі коли Hero CTA виходить з viewport. Зникає коли повертається.

```css
.sticky-cta {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid var(--border);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  z-index: 100;
  box-shadow: 0 -4px 16px rgba(11,79,154,0.08);
}

@media (min-width: 769px) {
  .sticky-cta { display: none !important; }
}
```

**Вміст:**
- Ліворуч: ім'я лікаря + "Консультація — 700 грн"
- Праворуч: кнопка "ЗАПИСАТИСЬ" (var(--gold))
- Відкриває BookingModal з prefilled лікарем і операцією поточної сторінки

**На сторінках з одним лікарем:** prefilled лікар.
**На сторінках з двома лікарями:** без prefilled лікаря.

---

## Форма запису

```
Поля: border 1px solid var(--border), border-radius 8px, Fixel Text
Focus: border-color var(--blue-deep)
CTA кнопка: var(--gold), full-width, font-weight 700
Honeypot: поле website (display:none)
```

**Правила форми:**
- Summary-card: показувати `officialName` з прайсу, не SEO-назву
- Дропдаун "Мета консультації": завжди видимий, prefilled slug поточної сторінки
- Варіанти в дропдауні: всі операції що є на сайті + "Інше / не визначилась"
- Бажаний день: тільки "Завтра", "Цього тижня", "Інший день" — без "Сьогодні"
- Телефон: тільки якщо є `tracking_phone` в `clinic_branches`, інакше `data-phone-placeholder`

---

## Carousel паттерн — мобільний

Для блоків з кількома картками на мобільному:

```css
.cards-scroll {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 12px;
  padding-bottom: 16px;
  scrollbar-width: none;
}
.cards-scroll::-webkit-scrollbar { display: none; }
.cards-scroll .card {
  flex: 0 0 85%;
  scroll-snap-align: start;
}
```

Dots-індикатор під блоком: активна — `var(--blue-deep)`, неактивна — `var(--border)`.

На десктопі (768px+): grid замість carousel.

**Застосовувати до блоків:**
- Обладнання операційної
- Таймлайн відновлення
- Альтернативні методи

---

## Hero

```css
background: linear-gradient(135deg, #0B4F9A 0%, #0a3d7a 60%, #07295c 100%);
padding: 70px 24px 80px;
text-align: center;
```

---

## Facts Bar

```
Layout: 4 колонки на desktop, 2×2 на мобайлі
Числа: Fixel Text, font-weight 800, color: var(--blue-deep)
Label: Fixel Text, font-size 13px, color: var(--muted)
```

---

## Header / Nav

```
Фон: white
Border-bottom: 1px solid var(--border)
Position: sticky, top: 0, z-index: 50
Nav links: Fixel Text 13px, color: var(--muted)
CTA в nav: background var(--gold), border-radius 6px
```

---

## Картки лікарів

```
Header картки: gradient(135deg, var(--blue-deep) 0%, #073878 100%)
Ім'я: Fixel Display, font-weight 700, color: var(--text)
Спеціальність: Fixel Text 13px, color: var(--blue-mid)
Статистика: число — Fixel Text 800, var(--blue-deep); label — 12px, var(--muted)
CTA: var(--gold), border-radius 8px
```

---

## Блок ціни (sidebar)

```
Ціна: Fixel Text, font-size 28px, font-weight 800, color: var(--blue-deep)
CTA: var(--gold), full-width, border-radius 8px
Position sticky: top 24px (desktop)
На мобайлі: статичний блок перед FAQ
```

---

## Callout блоки

```css
.callout-info {
  background: var(--blue-light);
  border-left: 4px solid var(--blue-deep);
  border-radius: 8px;
  padding: 16px 20px;
}
.callout-warning {
  background: var(--gold-bg);
  border-left: 4px solid var(--gold);
  border-radius: 8px;
  padding: 16px 20px;
}
```

---

## GEO-блок

```
Фон: var(--bg) = #f8fafc
Border-top: 1px solid var(--border)
H2: Fixel Display, font-weight 700
Параграф: Fixel Text, щільний текст
Рендериться як статичний HTML — НЕ в JS-табах, НЕ в accordion
```

---

## Маршрут пацієнта

```
Нумерація: круг bg var(--blue-deep), white text, Fixel Text
Назва кроку: Fixel Display, font-weight 700
Текст: Fixel Text, color var(--muted)
```

---

## Зображення

```
Тільки реальні фото від клініки — без стоку
Шляхи: тільки абсолютні /assets/... (не ../assets/)
Фото операційної: aspect-ratio 3/2, object-fit cover
loading="lazy" decoding="async" для всіх крім першого
Обгортати в <picture> з WebP + JPG fallback
```

---

## Mobile-first правила

- 80% трафіку — мобайл
- Sticky CTA знизу при скролі (золота кнопка)
- Carousel для блоків з кількома картками
- Facts bar: 2×2 сітка
- Sidebar ціни: статичний блок на мобайлі
- Кнопки: full-width на мобайлі

---

## Системні вимоги для кожної сторінки

Cowork перевіряє перед кожним комітом:
- [ ] FAQ expand: `max-height` transition, не `display:none`
- [ ] `MedicalWebPage` schema в JSON-LD
- [ ] Шляхи зображень: тільки `/assets/...`
- [ ] Breadcrumb: без href якщо сторінка не існує
- [ ] Телефон: `data-phone-placeholder` якщо немає `tracking_phone`
- [ ] `<body data-case-slug="[slug]">`
- [ ] Sticky CTA на мобільному
- [ ] CSS grep перед новим селектором

---

## Що НЕ використовувати

- Onest, Inter, Cormorant Garamond
- `#005485`, `#04D3D9`, `#05121e`
- Pill кнопки `border-radius: 40px`
- Стокові фото
- `display:none` для FAQ expand
- Відносні шляхи `../assets/`
- "Сьогодні" у формі бажаного дня
- Заглушка `000-00-00` для телефону
