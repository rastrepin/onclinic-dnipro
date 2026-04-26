# QA Checklist — onclinic.check-up.in.ua/kharkiv

**Проект:** onclinic.check-up.in.ua/kharkiv  
**Останнє оновлення:** квітень 2026  
**Автоматизований скрипт:** `python3 qa_onclinic_kharkiv.py` (53 перевірки)

---

## Scope

Перевіряти після кожного релізу, що торкається:
- HTML-сторінок у `/kharkiv/`
- `kharkiv/js/booking.js`
- `api/leads/onclinic.js`

---

## 1. Ціни консультацій

| # | Перевірка | Де шукати | Очікувано |
|---|-----------|-----------|-----------|
| 1.1 | Афанасьєв — ціна консультації | `cred-num` в doc-card на всіх сторінках | 700 грн |
| 1.2 | Стрюков — ціна консультації | `cred-num` в doc-card на всіх сторінках | 700 грн |
| 1.3 | `price-doctors-row` на кейс-сторінках | miomektomiia, gisterektomiia, endometrioz-kista, gisteroskopia | Афанасьєв — 700 · Стрюков — 700 |
| 1.4 | BookingModal summary-card (Афанасьєв) | `booking.js` → `DOCTOR_INFO.afanasiev.price` | 700 грн |
| 1.5 | BookingModal summary-card (обидва) | `booking.js` → inline html | Афанасьєв — 700 / Стрюков — 700 |
| 1.6 | Telegram (preferred_doctor=afanasiev) | `api/leads/onclinic.js` → `DOCTOR_MAP` | (консультація 700 грн) |
| 1.7 | Квіз — рядок результату без рекомендації | mioma-matky, endometrioz | Консультація: 700 грн (НЕ 500–700) |

---

## 2. Ціни операцій

| # | Сторінка | Очікувана ціна | Де |
|---|----------|---------------|-----|
| 2.1 | mioma-laparoskopichna-miomektomiia | 26 690 грн | `price-amount` + `SERVICE_MAP` |
| 2.2 | mioma-laparoskopichna-gisterektomiia | від 28 895 грн | `price-amount` + `SERVICE_MAP` |
| 2.3 | endometrioz-kista-laparoskopia | від 21 745 грн | `price-amount` + `SERVICE_MAP` |
| 2.4 | gisteroskopia | від 11 505 грн | `price-amount` + `SERVICE_MAP` |
| 2.5 | gisteroskopia — варіант 1 | 11 505 грн | `price-variants` |
| 2.6 | gisteroskopia — варіант 2 | 13 395 грн | `price-variants` |
| 2.7 | gisterektomiia — варіант 1 | 28 895 грн | `price-variants` |
| 2.8 | gisterektomiia — варіант 2 | 28 930 грн | `price-variants` |

---

## 3. Синоніми (synonyms-integration)

### mioma-matky

| # | Перевірка | Де |
|---|-----------|-----|
| 3.1 | Hero: "Також відома як: фіброміома матки, лейоміома матки..." | `hero-synonyms` |
| 3.2 | "Що таке міома": "(також — фіброміома, лейоміома)" | перший абзац секції |
| 3.3 | Картка методу h3: "Видалення фіброматозного вузла лапароскопічним методом" | `.method-card h3` |
| 3.4 | Підзаголовок картки: "(лапароскопічна міомектомія)" | `.method-card-sub` |
| 3.5 | GEO: "(фіброміоми, лейоміоми, фіброматозних вузлів)" | geo-block |

### miomektomiia

| # | Перевірка | Де |
|---|-----------|-----|
| 3.6 | "Інші назви: видалення міоматозного вузла..." | `.op-synonyms` перед методом |
| 3.7 | H2 ціни: "Вартість операції" | `price-section h2` |
| 3.8 | `price-service-name`: офіційна назва | під H2 ціни |
| 3.9 | `price-service-sub`: "(лапароскопічна міомектомія)" | під service-name |
| 3.10 | GEO: "(видалення фіброматозного вузла лапароскопічним методом)" | geo-block |

### gisterektomiia

| # | Перевірка | Де |
|---|-----------|-----|
| 3.11 | "Інші назви: екстирпація матки лапароскопічним методом..." | `.op-synonyms` |
| 3.12 | H2 ціни: "Вартість операції" | `price-section h2` |
| 3.13 | Варіанти містять "(лапароскопічна гістеректомія)" | `price-variants li` |
| 3.14 | Блок "З придатками чи без — як приймається рішення" | `.decision-block` |
| 3.15 | GEO: "(екстирпацію матки лапароскопічним методом)" | geo-block |

---

## 4. Сторінка Гістероскопії (`/kharkiv/gisteroskopia`)

| # | Перевірка |
|---|-----------|
| 4.1 | Сторінка відкривається (не 404) |
| 4.2 | `data-case-slug="gisteroskopia"` на `<body>` |
| 4.3 | Hero: H1 "Гістероскопія", metrics: 1 день / 2–3 дні / 15–45 хв |
| 4.4 | Показання — 12 пунктів; Протипоказання — 7 пунктів |
| 4.5 | Маршрут пацієнта — 5 кроків |
| 4.6 | Блок "Діагностична чи оперативна — як приймається рішення" присутній |
| 4.7 | У блоці — 2 нейтральні картки (11 505 / 13 395) |
| 4.8 | Метод: preview присутній, кнопка expand є |
| 4.9 | "Karl Storz" є в DOM (SEO: `curl URL \| grep "Karl Storz"` → є збіг) |
| 4.10 | H2 ціни: "Вартість процедури" |
| 4.11 | `price-amount`: від 11 505 грн |
| 4.12 | `price-variants`: 11 505 / 13 395 з офіційними назвами |
| 4.13 | FAQ — 8 питань |
| 4.14 | Альтернативи: 3 посилання (міомектомія, гістеректомія, лапароскопія придатків) |
| 4.15 | GEO і E-E-A-T присутні |

---

## 5. Сторінки лікарів

| # | Перевірка | Afanasiev | Striukov |
|---|-----------|-----------|---------|
| 5.1 | Логотип | `logo-horizontal.png` | `logo-horizontal.png` |
| 5.2 | Немає `id="context-block"` в HTML | ✓ | ✓ |
| 5.3 | Немає `CASE_CONTEXTS` JS | ✓ | ✓ |
| 5.4 | Заголовок секції операцій | "Лікар Афанасьєв І.В. виконує операції" | "Лікар Стрюков Д.В. виконує операції" |
| 5.5 | CSS spec-grid 2 колонки | `grid-template-columns:1fr 1fr` в `@media(min-width:768px)` | — |
| 5.6 | JS mobile collapse | `initSpecCards` | — |
| 5.7 | Картка Гістероскопії — без badge "Скоро" | ✓ | ✓ |
| 5.8 | Картка Гістероскопії — "Детальніше →" веде на `/kharkiv/gisteroskopia` | ✓ | ✓ |
| 5.9 | Картка Гістероскопії — `prefilledCase='gisteroskopia'` | ✓ | ✓ |

---

## 6. Квіз (mioma-matky)

| # | Сценарій | Очікуваний результат |
|---|----------|---------------------|
| 6.1 | Q1=submucous, Q2=small/medium | `prefilledCase='gisteroskopia'`, екран "Гістероскопія / від 11 505 грн" |
| 6.2 | Q1=submucous, Q2=large | `prefilledCase=null`, два варіанти (Гістероскопія + Міомектомія) |
| 6.3 | Q1=intramural/subserous, Q2=small/medium | `prefilledCase='mioma-laparoskopichna-miomektomiia'` |
| 6.4 | Q1=intramural/subserous, Q2=large, Q3=no | два варіанти (Міомектомія + Гістеректомія) |
| 6.5 | Q1=unknown | no_recommendation → консультація 700 грн |
| 6.6 | Рядок результату: немає "500–700 грн" ніде | у mioma-matky і endometrioz |

---

## 7. BookingModal

| # | Перевірка |
|---|-----------|
| 7.1 | `prefilledCase='gisteroskopia'` → Summary-card показує обидві офіційні назви |
| 7.2 | `prefilledCase='mioma-laparoskopichna-miomektomiia'` → service-name коректно |
| 7.3 | `prefilledDoctor='afanasiev'` → картка з фото + ціна 700 грн |
| 7.4 | `prefilledDoctor=null` → список обох лікарів, обидва 700 грн |
| 7.5 | Без `prefilledCase` → показується dropdown "Мета запису" |
| 7.6 | Submit → лід з'являється в Supabase `onclinic_leads` |
| 7.7 | Submit → Telegram отримує повідомлення з правильними даними |

---

## 8. Посилання (не 404)

| # | URL | Статус |
|---|-----|--------|
| 8.1 | `/kharkiv/gisteroskopia` | ✓ |
| 8.2 | `/kharkiv/mioma-laparoskopichna-miomektomiia` | ✓ |
| 8.3 | `/kharkiv/mioma-laparoskopichna-gisterektomiia` | ✓ |
| 8.4 | `/kharkiv/endometrioz-kista-laparoskopia` | ✓ |
| 8.5 | `/kharkiv/mioma-matky` | ✓ |
| 8.6 | `/kharkiv/endometrioz` | ✓ |
| 8.7 | `/kharkiv/doctors/afanasiev` | ✓ |
| 8.8 | `/kharkiv/doctors/striukov` | ✓ |
| 8.9 | `/kharkiv/gisteroskopia-polipektomia` | має повертати 404 (стара сторінка видалена) |

---

## 9. Регресія — що НЕ має змінитись

| # | Перевірка |
|---|-----------|
| 9.1 | `≈ 500 грн` для гістологічного дослідження — залишається (це НЕ ціна консультації) |
| 9.2 | `≈ 500 грн` для передопераційних аналізів — залишається |
| 9.3 | `/kharkiv/endometrioz` і `/kharkiv/endometrioz-kista-laparoskopia` — верстка не змінена |
| 9.4 | Шрифти: Onest + Cormorant Garamond — не змінено |
| 9.5 | API endpoint `/api/leads/onclinic` — повертає `{ok: true, leadId}` |

---

## 10. Supabase

```sql
-- Унікальні case_slug від реальних лідів (мають відповідати SERVICE_MAP)
SELECT case_slug, COUNT(*) FROM onclinic_leads GROUP BY case_slug ORDER BY count DESC;

-- Ліди з невалідним preferred_doctor
SELECT id, preferred_doctor, created_at FROM onclinic_leads
WHERE preferred_doctor NOT IN ('afanasiev', 'striukov') AND preferred_doctor IS NOT NULL;

-- Ліди де Telegram не відправився
SELECT id, name, preferred_doctor, created_at FROM onclinic_leads
WHERE telegram_sent = false ORDER BY created_at DESC LIMIT 20;
```

---

## 11. Smoke-тести після деплою

1. Хаб міоми → квіз → Q1=субмукозний, Q2=до 3 см → результат "Гістероскопія / від 11 505 грн" → "Обрати хірурга" → Афанасьєв → BookingModal → submit → Supabase + Telegram ✓
2. Сторінка гістероскопії → Hero CTA → BookingModal з `prefilledCase='gisteroskopia'` → Summary-card показує обидва варіанти → submit → Telegram ✓
3. Сторінка лікаря Афанасьєва → картка Гістероскопії → "Детальніше →" → відкривається `/kharkiv/gisteroskopia` ✓

---

## Автоматизований скрипт

```bash
python3 qa_onclinic_kharkiv.py
```

Покриває 53 перевірки з розділів 1–5 автоматично. Розділи 6–11 — ручне тестування.
