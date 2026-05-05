# Onclinic Харків · Single Source of Truth
## Версія: 2.0 · Травень 2026 | Оновлювати після кожної значної зміни

---

## 1. Ідентифікація проекту

```
Піддомен:     onclinic.check-up.in.ua
Репо:         github.com/rastrepin/onclinic-web (раніше onclinic-dnipro)
Preview:      onclinic-web-git-dev-rastrepins-projects.vercel.app
Продакшн:     onclinic.check-up.in.ua
Стек:         Статичний HTML + Vercel Serverless (/api/) + Supabase
Гілки:        main → продакшн (auto-deploy), dev → preview
Папка ref:    C:\Users\irast\COWORK\CLAUDE CHAT\Check-up 3.0\CASES - clinics\ONCLINIC-web-ref\
Bypass токен: зберігається в Bitwarden → "vercel-bypass-onclinic"
```

**Важливо:** репо — статичний HTML, не Next.js. Немає `/app/`, немає React компонентів.

---

## 2. Карта сторінок

| URL | Назва операції (офіційна) | Статус |
|-----|--------------------------|--------|
| /kharkiv | ОН Клінік Харків — хаб клініки | ❌ не створено |
| /kharkiv/mioma-matky | Міома матки — огляд методів лікування | ✅ live |
| /kharkiv/mioma-laparoskopichna-miomektomiia | Видалення фіброматозного вузла лапароскопічним методом | ✅ live |
| /kharkiv/mioma-laparoskopichna-gisterektomiia | Екстирпація матки лапароскопічним методом | ✅ live |
| /kharkiv/endometrioz | Ендометріоз — огляд методів лікування | ✅ live |
| /kharkiv/endometrioz-kista-laparoskopia | Лапароскопія на придатках | ✅ live |
| /kharkiv/gisteroskopia | Гістероскопія (діагностична + з поліпектомією) | ✅ live |
| /kharkiv/kolporafia | Кольпорафія (опущення, випадіння матки) | ✅ live |
| /kharkiv/doctors/afanasiev | Афанасьєв Ігор Володимирович | ✅ live |
| /kharkiv/doctors/striukov | Стрюков Дмитро Владиславович | ✅ live |

**Правило Hub:** Hub-сторінка існує тільки якщо є 2+ методи лікування одного захворювання.
- Міома → Hub виправданий (міомектомія + гістеректомія + гістероскопія)
- Ендометріоз → Hub є (ендометріоз + лапароскопія придатків)

---

## 3. Офіційний прайс (незмінний)

| Операція | Ціна |
|----------|------|
| Діагностична гістероскопія | 11 505 грн |
| Гістероскопія з поліпектомією ендоскопічним методом | 13 395 грн |
| Кольпорафія (опущення, випадіння матки) | 25 525 грн |
| Видалення фіброматозного вузла лапароскопічним методом | 26 690 грн |
| Екстирпація матки з придатками лапароскопічним методом | 28 930 грн |
| Екстирпація матки без придатків лапароскопічним методом | 28 895 грн |
| Лапароскопія на придатках (видалення кіст яєчників, ендометріоз) | 21 745 грн |
| Консультація хірурга (обидва лікарі) | 700 грн |

**Правило:** Будь-яка ціна на сайті — тільки з цієї таблиці. Ніяких округлень, припущень, змін без підтвердження клініки.

---

## 4. Лікарі

### Афанасьєв Ігор Володимирович
- Спеціальність: акушер-гінеколог, оперуючий гінеколог
- Категорія: вища кваліфікаційна
- Ступінь: кандидат медичних наук (2008)
- Досвід: 34 роки (з 1992)
- Спеціалізація «Ендоскопія»: з 2006
- Асистент кафедри акушерства і гінекології №2 ХНМУ: з 2019
- Консультація: 700 грн
- Slug: afanasiev

### Стрюков Дмитро Владиславович
- Спеціальність: акушер-гінеколог, оперуючий гінеколог
- Категорія: вища кваліфікаційна (2019)
- Ступінь: кандидат медичних наук (2010)
- Досвід: 24 роки (з 2001)
- Спеціалізація «Ендоскопічна хірургія»: 2016
- Асистент кафедри акушерства і гінекології №2 ХНМУ: з 2019
- Консультація: 700 грн
- Slug: striukov

**Правило:** Обидві картки лікарів мають однакові поля. dc-tag однакового кольору для обох — `var(--blue-deep)`.

---

## 5. Адреса і контакти

```
Назва:    ОН Клінік Харків Левада
Адреса:   вул. Молочна, 48
Метро:    м. Левада (не Гагаріна)
Графік:   Пн-Пт 8:00–18:00, Сб 8:00–17:00, Нд 8:30–14:00
Телефон:  [уточнити у клініки — tracking_phone в clinic_branches]
```

**Правило телефону:** показувати тільки якщо є `tracking_phone` в Supabase `clinic_branches`. Якщо NULL → показувати кнопку CallbackModal замість номера. Заглушка `000-00-00` заборонена.

---

## 6. Бренд і дизайн

Детальні brand guidelines: `docs/onclinic-brand-guidelines.md` (v2.0)

### Кольори (CSS variables з assets/css/brand-tokens.css)
```css
--blue-deep: #0B4F9A;    /* primary — кнопки nav, hero bg */
--blue-mid:  #1a6bc7;    /* hover */
--blue-light: #dbeafe;   /* selected state */
--gold:      #C49A1A;    /* accent CTA border */
--gold2:     #e8b820;    /* gold hover, H1 accent */
--gold-light: #fffbeb;   /* кнопка лікаря bg */
--gold-mid:  #C49A1A;    /* кнопка лікаря border */
--bg:        #f8fafc;
--text:      #0f172a;
--muted:     #64748b;
--border:    #e2e8f0;
```

**Заборонено:** `#005485`, `#04D3D9`, `#05121e` (кольори платформи check-up.in.ua)

### Шрифти (v2.0 — оновлено квітень 2026)

| Роль | Шрифт |
|------|-------|
| Body & UI | Fixel Text |
| H1 / H2 / H3 / H4 / кнопки / eyebrows / імена лікарів | Fixel Display |
| H1 italic accent слово + великі цифри-факти | Source Serif 4 italic |

**Заборонено:** Onest, Cormorant Garamond, Inter, будь-який четвертий шрифт без погодження.

### Єдине джерело CSS токенів
```
assets/css/brand-tokens.css — підключено в <head> всіх 20 HTML файлів
Inline :root {} в <style> — заборонено (видалено рефакторингом квітень 2026)
```

---

## 7. Структура Hero

```
Desktop: grid 1.1fr / 0.9fr
Ліва колонка:
  - eyebrow (Fixel Display uppercase 11px, gold, лінія ::before)
  - H1 (line1: Fixel Display uppercase white) + (em: Source Serif 4 italic gold)
  - subtitle (Fixel Text 15px, rgba white 0.7)
  - facts (Fixel Display 700 для звичайних цифр; Source Serif 4 italic для великих)
  - кнопки (primary + ghost)

Права колонка: hero-roadmap (вертикальний таймлайн)
```

**Заборонено:** різнокольорові іконки в roadmap, центрування тексту Hero.

---

## 8. Facts bar

- Розміщення: під hero, не всередині hero
- Кількість: 4 факти
- Дублювання: рівно один раз на сторінці

---

## 9. Trust bar

Три факти про клініку — не перелік імен лікарів:
```
• Два хірурги к.м.н. — вища кваліфікаційна категорія
• Karl Storz (Німеччина) — обладнання класу A для лапароскопії
• Стаціонар під наглядом лікаря після кожної операції
```

---

## 10. Картки лікарів

```css
.doctor-card {
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 34px;
  background: white;
}
.dc-tag {
  height: 4px;
  background: var(--blue-deep); /* однаковий для ВСІХ карток */
}
```

---

## 11. Sticky CTA — мобільна (новий паттерн v2.0)

З'являється при скролі коли Hero CTA виходить з viewport. На десктопі прихований.

```css
.sticky-cta {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: white;
  border-top: 1px solid var(--border);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 100;
}
@media (min-width: 769px) { .sticky-cta { display: none !important; } }
```

**Вміст:**
- Ліворуч: ім'я лікаря + "Консультація — 700 грн"
- Праворуч: кнопка "ЗАПИСАТИСЬ" (gold outline)
- Відкриває BookingModal з prefilled лікарем і операцією поточної сторінки
- На сторінках з одним лікарем: prefilled лікар
- На сторінках з двома лікарями: без prefilled лікаря

---

## 12. Carousel паттерн — мобільний (новий паттерн v2.0)

Для блоків з кількома картками на мобільному:

```css
.cards-scroll {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 12px;
  scrollbar-width: none;
}
.cards-scroll .card {
  flex: 0 0 85%;
  scroll-snap-align: start;
}
```

Dots-індикатор: активна — `var(--blue-deep)`, неактивна — `var(--border)`.

**Застосовувати до блоків:** Обладнання операційної, Таймлайн відновлення, Альтернативні методи.

---

## 13. Маршрут пацієнта

**Крок "День операції" містить тільки:**
- Госпіталізація (час)
- Анестезія — пацієнтка спить
- Після операції — відпочинок під наглядом
- Тривалість операції (цифра)

**Заборонено:** дії хірурга, назви інструментів, Karl Storz, проколи.

---

## 14. Sidebar ціни

```css
.price-sidebar { max-width: 380px; position: sticky; top: 24px; }
@media (max-width: 768px) { .price-sidebar { position: static; } }
```

---

## 15. GEO-блок

**Обов'язковий** на кожній сторінці. **Статичний HTML** — не в JS, не в accordion.

Формула H2: `"[Операція] в Харкові — ОН Клінік, ціна, хірурги"`

---

## 16. E-E-A-T блок

```html
<div class="eeat-block">
  <div class="eeat-row">
    <span class="eeat-label">Автор</span>
    <span>Ігор Растрепін, засновник check-up.in.ua</span>
  </div>
  <div class="eeat-row">
    <span class="eeat-label">Рецензент</span>
    <span>Афанасьєв І.В., оперуючий гінеколог, к.м.н., вища категорія</span>
  </div>
  <div class="eeat-row">
    <span class="eeat-label">Оновлено</span>
    <span>квітень 2026</span>
  </div>
  <div class="eeat-row">
    <span class="eeat-label">Джерела</span>
    <span>Mayo Clinic Family Health Book, 5th Ed.; МОЗ України, 2023</span>
  </div>
</div>
```

**Автор завжди:** "Ігор Растрепін, засновник check-up.in.ua".

---

## 17. Форми та ліди

### Поля форми (видимі)
```
name     — text, required
phone    — tel, required, маска +380
contact  — radio: Дзвінок / Telegram / Viber
day      — radio: Завтра / Цього тижня / Інший день (БЕЗ "Сьогодні")
purpose  — dropdown: мета консультації (prefilled slug поточної сторінки)
consent  — checkbox, required
website  — hidden, honeypot
```

### Summary-card у формі
- Показувати `officialName` з прайсу, не SEO-назву
- Dropdown "Мета консультації" завжди видимий, prefilled поточним slug
- Варіанти: всі операції що є на сайті + "Інше / не визначилась"

### Архітектура запису
```
Form submit → POST /api/leads/onclinic
  ├─ Валідація (honeypot, phone, consent)
  ├─ INSERT в Supabase через SUPABASE_SERVICE_ROLE_KEY
  ├─ fetch(Telegram sendMessage) — fire-and-forget
  └─ Response { ok: true, leadId }
```

---

## 18. Зображення

```
Тільки реальні фото від клініки — без стоку
Шляхи: тільки абсолютні /assets/... (не ../assets/)
Єдине джерело CSS: assets/css/brand-tokens.css
Фото операційної: aspect-ratio 3/2, object-fit cover
loading="lazy" decoding="async" для всіх крім першого
Обгортати в <picture> з WebP + JPG fallback
```

---

## 19. Інтервали

```css
section { padding: 64px 0; }
section + section { border-top: 1px solid var(--border); }
@media (max-width: 768px) { section { padding: 48px 0; } }
.step-body, .method-text { max-width: 640px; }
```

**Правило CSS селекторів:** перед написанням нового CSS правила — `grep` по HTML на предмет реального класу або тегу. Не писати по класу без перевірки що він існує.

---

## 20. Schema.org

Обов'язковий набір на кожній сторінці кейсу:
- `MedicalWebPage`
- `MedicalProcedure`
- `FAQPage` (якщо є FAQ блок)
- `LocalBusiness`

Перевірка: `curl -s [URL] | grep "FAQPage"` — має знаходити збіг.

---

## 21. Supabase — таблиці проекту

| Таблиця | Призначення |
|---------|-------------|
| `onclinic_leads` | Ліди з усіх форм сайту |
| `clinic_branches` | Філії + `tracking_phone` |
| `patient_criteria` | Критерії вибору з квізу |
| `quiz_configs` | Конфігурації квізів |
| `provider_criteria_data` | Атрибути лікарів/клініки |

**Технічний борг:**
- `onclinic_services` — таблиця цін (не створена, ціни поки в SERVICE_MAP)
- `tracking_phone` в `clinic_branches` — потрібна міграція (CallbackModal залежить)

---

## 22. Список регресій-заборон
### Cowork читає цей розділ ПЕРЕД кожною сесією.

1. **Шрифти** — Fixel Text (body/UI), Fixel Display (H1/H2-H4/кнопки/eyebrows), Source Serif 4 italic (H1 accent + великі цифри). Onest і Cormorant — заборонені.
2. **Ціни** — тільки з розділу 3. Не округляти, не припускати.
3. **Dark theme** — `#005485`, `#04D3D9`, `#05121e` заборонені. Це кольори платформи.
4. **Pill кнопки** — `border-radius: 40px` заборонений. Тільки 8–10px.
5. **Facts bar** — рівно один раз на сторінці, під hero.
6. **Inline :root {}** — заборонено. Тільки `assets/css/brand-tokens.css`.
7. **Відносні шляхи** — `../assets/` заборонено. Тільки `/assets/`.
8. **`[УТОЧНИТИ...]`** — не залишати в живому HTML.
9. **Дії хірурга в маршруті** — заборонено. Тільки що відчуває пацієнтка.
10. **Центрування Hero** — заборонено. Тільки left-align.
11. **Різні кольори dc-tag** — заборонено. Обидві картки `var(--blue-deep)`.
12. **Trust bar з іменами лікарів** — заборонено. Три факти про клініку.
13. **GEO-блок в JS** — заборонено. Тільки статичний HTML.
14. **Суцільна gold кнопка** — заборонено. Тільки gold outline.
15. **Breadcrumbs по центру** — заборонено. `justify-content: flex-start`.
16. **Sidebar без max-width** — `.price-sidebar { max-width: 380px }` завжди.
17. **Різнокольорові іконки в roadmap** — всі white, 14px.
18. **Емодзі в UI** — заборонено. Тільки SVG (Lucide). Емодзі тільки в Telegram.
19. **Контент поза md-файлами** — не генерувати текст. Тільки з `.md` файлів.
20. **"Медичний редактор"** — заборонено. Автор: "Ігор Растрепін, засновник check-up.in.ua".
21. **Станція метро "Гагаріна"** — заборонено. Правильно: "м. Левада".
22. **Клієнтський Supabase INSERT** — заборонено. Тільки через API route з SERVICE_ROLE_KEY.
23. **Телефон-заглушка `000-00-00`** — заборонено. Якщо немає tracking_phone → CallbackModal.
24. **"Сьогодні" у формі** — заборонено. Тільки Завтра / Цього тижня / Інший день.
25. **FAQ через display:none** — заборонено. Тільки max-height transition.
26. **CSS селектор без grep** — заборонено писати CSS по класу без перевірки що клас існує в HTML.

---

*Документ оновлено: травень 2026 · v2.0*
*При кожній зміні правил — оновити цей файл і повідомити Ігоря*
