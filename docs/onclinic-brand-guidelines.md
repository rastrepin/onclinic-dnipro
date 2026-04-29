# onclinic-brand-guidelines.md
## ОН Клінік Харків — Brand Guidelines для Cowork

---

## Кольори

```css
--blue-deep: #0B4F9A;      /* primary — кнопки, hero, заголовки */
--blue-mid:  #1a6bc7;      /* secondary — hover, акценти */
--blue-light: #dbeafe;     /* selected state, backgrounds */
--gold:      #C49A1A;      /* accent — CTA кнопки, ціни, іконки */
--gold2:     #e8b820;      /* gold hover */
--gold-bg:   #fffbeb;      /* callout backgrounds */
--bg:        #f8fafc;      /* сторінка background */
--white:     #ffffff;
--text:      #0f172a;
--muted:     #64748b;
--border:    #e2e8f0;
--radius:    12px;
```

---

## Шрифти

```
Основний:  Onest (замість Inter з прототипу — стандарт платформи)
Accent H1: Cormorant Garamond, italic — тільки акцентне слово в H1
```

Google Fonts підключення:
```html
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
```

Використання:
- body, параграфи, кнопки, факти, FAQ — Onest
- H1 accent слово (em або span) — Cormorant Garamond italic, color: var(--gold2)
- Ніколи Cormorant для цифр, цін, фактів

---

## Кнопки

```css
/* Primary (золота) — головний CTA */
.btn-primary {
  background: var(--gold);
  color: white;
  padding: 14px 32px;
  border-radius: 8px;
  font-family: Onest, sans-serif;
  font-weight: 700;
  font-size: 15px;
  border: none;
}
.btn-primary:hover { background: var(--gold2); }

/* Outline (прозора) — secondary CTA */
.btn-outline {
  background: transparent;
  color: white;
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  border: 1.5px solid rgba(255,255,255,0.35);
}

/* На світлому фоні */
.btn-outline-dark {
  border: 2px solid var(--blue-deep);
  color: var(--blue-deep);
  border-radius: 8px;
}
```

НЕ використовувати pill (border-radius 40px) — це стилістика платформи check-up.in.ua, не клініки.

---

## Header / Nav

```
Фон: white
Border-bottom: 1px solid var(--border)
Position: sticky, top: 0, z-index: 50
Логотип: текстовий або SVG ОН Клінік
Nav links: Onest 13px, color: var(--muted)
Active/hover: color: var(--blue-deep)
CTA в nav: background var(--gold), border-radius 6px
```

---

## Hero

```css
background: linear-gradient(135deg, #0B4F9A 0%, #0a3d7a 60%, #07295c 100%);
padding: 70px 24px 80px;
text-align: center;

/* H1 */
font-family: 'Cormorant Garamond', serif;
font-size: clamp(34px, 6vw, 56px);
color: white;

/* H1 accent слово */
font-style: italic;
color: var(--gold2);

/* Subtitle */
color: rgba(255,255,255,0.7);
font-size: 17px;
font-family: Onest;
```

---

## Facts Bar (4 факти під Hero)

```
Layout: 4 колонки на desktop, 2x2 на мобайлі
Числа: Onest, font-weight 800, color: var(--blue-deep) — на білому фоні
       або white — на темному фоні
Label: Onest, font-size 13px, color: var(--muted)
```

Правило: всі числа однаково стилізовані. Не виділяти одне число кольором.
Label має бути зрозумілим без контексту: "Мікророзрізи: 3 × 0,5–1 см" — не просто "Проколи".

---

## Trust Bar

```
Фон: var(--blue-deep)
Текст: white, Onest 14px
Іконка ✓: var(--gold)
```

---

## Картки методів лікування

```
Фон: white
Border: 1px solid var(--border)
Border-radius: var(--radius) = 12px
Hover shadow: 0 8px 32px rgba(11,79,154,0.12)
Badge "Найчастіше рекомендується": bg var(--gold), white text, border-radius 4px
Ціна: Onest, font-weight 800, color: var(--blue-deep)
```

---

## Картки лікарів

```
Header картки: gradient(135deg, var(--blue-deep) 0%, #073878 100%)
Avatar (якщо немає фото): initials на blue-deep фоні, border-radius 50%
Фото лікаря: border-radius 50% або 12px (узгодити з дизайном)
Ім'я: Onest, font-weight 700, color: var(--text)
Спеціальність: Onest 13px, color: var(--blue-mid)
Статистика: число — Onest 800, var(--blue-deep); label — Onest 12px, var(--muted)
CTA кнопка: var(--gold), border-radius 8px
```

---

## Блок ціни (sidebar sticky на desktop)

```
Фон: white
Border: 1px solid var(--border)
Border-radius: 12px
Ціна: Onest, font-size 28px, font-weight 800, color: var(--blue-deep)
CTA: var(--gold), full-width, border-radius 8px
Position sticky: top 24px (desktop)
На мобайлі: статичний блок перед FAQ
```

---

## Callout блоки

```css
/* Info (синій) — "Міома — не рак" */
.callout-info {
  background: var(--blue-light);
  border-left: 4px solid var(--blue-deep);
  border-radius: 8px;
  padding: 16px 20px;
}

/* Warning (жовтий) — "Коли звернутись терміново" */
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
H2: Onest, font-weight 700, color: var(--text)
Параграф: Onest, щільний текст, color: var(--text)
Рендериться як статичний HTML — не в JS-табах, не в accordion
```

---

## Footer

```
Фон: white
Border-top: 1px solid var(--border)
Логотип + адреса + телефон
Onest, font-size 13–14px, color: var(--muted)
```

---

## Форма запису

```
Поля: border 1px solid var(--border), border-radius 8px, Onest
Focus: border-color var(--blue-deep)
CTA кнопка: var(--gold), full-width, font-weight 700
Honeypot: поле website (display:none)
```

---

## Маршрут пацієнта (steps)

```
Нумерація кроків: круг з номером, bg var(--blue-deep), white text
Назва кроку: Onest, font-weight 700
Текст: Onest, color var(--muted)
Лінія між кроками: var(--border)
```

---

## Таймлайн відновлення

```
Аналогічно маршруту — нумеровані кроки
Або горизонтальний на desktop, вертикальний на мобайлі
```

---

## Mobile-first правила

- 80% трафіку — мобайл
- Картки лікарів: вертикальний layout (фото зверху, текст знизу)
- Facts bar: 2×2 сітка
- Sidebar ціни: статичний блок (не sticky) на мобайлі
- Кнопки: full-width на мобайлі
- Шрифт H1: clamp(28px, 6vw, 56px)

---

## Що НЕ використовувати

- Dark theme (#05121e) — це платформа check-up.in.ua, не клініка
- Pill кнопки (border-radius 40px) — це платформа
- Стокові фото, декоративні ілюстрації, каруселі
- Inter — замінено на Onest
- Navy #005485, Teal #04D3D9 — це кольори платформи, не Онклінік
