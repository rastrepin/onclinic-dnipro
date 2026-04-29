# Процес створення та оновлення сторінки · onclinic-web

Версія: 1.1 · Квітень 2026
Зміни в 1.1: додано правило sync MD після hotfix, процес роботи з фото, правило телефону

Суміжні документи:
- `DATABASE.md` — схема Supabase
- `content-standards.md` — стандарти контенту
- `docs/QA-CHECKLIST-onclinic.md` — чеклист перевірки
- `docs/prices-in-content-guideline.md` — плейсхолдери цін
- `docs/image-guidelines-onclinic.md` — робота з фото

---

## Інфраструктура

```
GitHub: rastrepin/onclinic-web
  └── main → Vercel auto-deploy → onclinic.check-up.in.ua
  └── dev  → Vercel preview (тестування перед мержем)

Supabase: apuivrfokciooovrpmgj
  └── onclinic_leads    ← ліди з форм
  └── onclinic_services ← ціни (створити)
  └── clinic_branches   ← філії + tracking_phone

Cowork сесія: /sessions/[id] (тимчасовий контейнер)
Авторизація GitHub: токен через https URL (оновлювати при новій сесії)
```

**Правило git:**
- Всі зміни тільки через `git push` в `dev`
- `dev` → QA → мерж в `main` → автодеплой
- Ніяких змін через Vercel Dashboard

---

## Структура репо

```
onclinic-web/
├── api/leads/onclinic.js     ← Serverless (Telegram webhook)
├── assets/
│   ├── doctors/              ← фото лікарів
│   ├── images/kharkiv/       ← фото операційних, обладнання, клініки
│   └── logo/
├── content/onclinic/
│   ├── cases/                ← MD файли кейсів (джерело правди)
│   └── doctors/              ← MD файли профілів лікарів
├── docs/
│   ├── QA-CHECKLIST-onclinic.md
│   ├── prices-in-content-guideline.md
│   ├── image-guidelines-onclinic.md
│   └── onclinic-site-process.md (цей файл)
├── kharkiv/                  ← HTML сторінки
└── vercel.json
```

---

## Три Cowork чати

| Чат | Роль |
|-----|------|
| Cowork Dev | Верстає сторінки, пушить в `dev` |
| Cowork QA | Перевіряє по чеклисту, дає дозвіл на мерж |
| Cowork Content Check | Звіряє MD з першоджерелами та лайвом |

---

## Повний цикл: від ідеї до продакшну

### Крок 1. Планування (чат архітектури)

- Яка сторінка, який тип (hub/кейс/профіль лікаря)
- Які дані є від клініки, що відсутнє → `[УТОЧНИТИ У КЛІНІКИ]`
- Чи потрібна нова таблиця в Supabase
- Які фото потрібні → додати в Список А для Олени

### Крок 2. Фото (цей чат)

Якщо Олена надала фото:
1. Завантажити фото в цей чат
2. Claude генерує: ім'я файлу, alt-текст, HTML-код, запис для MD
3. Зберегти фото в `assets/images/kharkiv/[папка]/`
4. Додати запис в MD-файл (блок "Фото")

Детально: `docs/image-guidelines-onclinic.md`

### Крок 3. Контент — MD файл

Шапка кожного MD:
```markdown
# [Назва сторінки]
slug: [url-slug]
type: case | hub | doctor_profile
status: draft | review | approved
clinic: onclinic
city: kharkiv
doctor: afanasiev | striukov | both
url: /kharkiv/[slug]
eeat:
  author: Ігор Растрепін
  reviewer: [ПІБ], [спеціалізація]
---
```

Правила:
- Ціни → тільки `[PRICE:case_slug]`, не числа
- `[УТОЧНИТИ У КЛІНІКИ]` → де даних немає
- Фото → блок "Фото" з ім'ям файлу та alt
- Status: approved → тільки після перевірки фактів

### Крок 4. Дані в Supabase

Перед версткою перевірити:
- `onclinic_services` → ціна для нового case_slug
- `clinic_branches` → `tracking_phone` для філії

### Крок 5. Розробка (Cowork Dev)

Структура промпту:
```
НОВА ЗАДАЧА · onclinic-web · гілка dev

Сторінка: /kharkiv/[slug]
Контент: content/onclinic/cases/[slug].md (attachment)
Паттерн: [еталонна сторінка]

Що зробити:
1. Створити kharkiv/[slug].html
2. Оновити SERVICE_MAP
3. [Суміжні зміни]

Правила:
- Контент ТІЛЬКИ з MD. Не генерувати текст.
- Ціни з Supabase через SERVICE_MAP
- Expand: max-height, не display:none
- GEO-блок: статичний HTML
- Телефон: тільки якщо є tracking_phone в clinic_branches,
  інакше — кнопка CallbackModal
- Push в dev, не в main

Після виконання — preview URL.
```

### Крок 6. QA (Cowork QA)

Preview URL + bypass токен (Bitwarden → `vercel-bypass-onclinic`):
```
[URL]?x-vercel-protection-bypass=[ТОКЕН]
```

Результат: ✅ всі пункти → мерж / ❌ є проблеми → повернути Dev

### Крок 7. Мерж в продакшн

```bash
git checkout main
git merge dev
git push origin main
```

Після деплою:
- [ ] Перевірити production URL
- [ ] Тестова заявка → Supabase + Telegram
- [ ] Google Search Console → запит на індексацію

### Крок 8. ОБОВ'ЯЗКОВО після деплою — sync MD ⚠️

**Це критичний крок який часто пропускають.**

Після кожного релізу або hotfix:
1. Порівняти живу сторінку з MD-файлом (`web_fetch` → порівняти)
2. Якщо є розбіжності → оновити MD в репо
3. Cowork Dev: `git commit -m "content: sync [slug].md with live"`
4. Push в dev → мерж в main

**Чому важливо:** MD-файл є еталоном для наступних сторінок. Якщо він застарів — нові сторінки створюються за неправильним паттерном.

---

## Правила по телефону

Телефон на сторінці → тільки якщо є `tracking_phone` в `clinic_branches`.

| Стан | Що показуємо |
|------|-------------|
| `tracking_phone` є | Телефон + кнопка "Записатись" |
| `tracking_phone` = NULL | Тільки CallbackModal (кнопка "Замовити дзвінок") |
| Заглушка `000-00-00` | ❌ Заборонено — сторінка не деплоїться в main |

---

## Оновлення існуючої сторінки

### Оновлення тексту
1. Відредагувати MD → Cowork Dev оновлює HTML → QA → мерж
2. Після мержу: sync MD з лайвом (крок 8)

### Оновлення цін
1. Оновити в Supabase (`onclinic_services`)
2. MD не чіпати — плейсхолдери залишаються
3. Тригернути редеплой:
```bash
git commit --allow-empty -m "chore: reprice [дата]"
git push origin main
```

### Додавання фото
1. Олена надає фото → Claude обробляє (крок 2)
2. Зберегти в `assets/images/kharkiv/`
3. Оновити MD-файл (блок "Фото")
4. Cowork Dev вставляє в HTML

---

## Поточний стан сторінок Харків

| Сторінка | URL | Статус |
|----------|-----|--------|
| Hub міоми | /kharkiv/mioma-matky | ✅ live |
| Міомектомія | /kharkiv/mioma-laparoskopichna-miomektomiia | ✅ live |
| Гістеректомія | /kharkiv/mioma-laparoskopichna-gisterektomiia | ✅ live |
| Ендометріоз hub | /kharkiv/endometrioz | ✅ live |
| Лапароскопія придатків | /kharkiv/endometrioz-kista-laparoskopia | ✅ live |
| Гістероскопія | /kharkiv/gisteroskopia | 🔧 dev (QA) |
| Профіль Афанасьєв | /kharkiv/doctors/afanasiev | ✅ live |
| Профіль Стрюков | /kharkiv/doctors/striukov | ✅ live |
| Хаб клініки | /kharkiv | ❌ не створено |

---

## Технічний борг

- [ ] Створити `onclinic_services` в Supabase
- [ ] Додати `tracking_phone` в `clinic_branches` (міграція)
- [ ] Реалізувати CallbackModal
- [ ] Sync MD для 7 існуючих сторінок (розсинхронізація після hotfix)
- [ ] Мігрувати захардкоджені ціни → `[PRICE:slug]`
- [ ] Ротувати Resend API key (потрапив в git history МЕД ОК)
- [ ] Структура `assets/images/kharkiv/` — створити папки в репо

---

## Наступні етапи

**Філії Харків:**
- /kharkiv/levada
- /kharkiv/palats-sportu
- /kharkiv/yaroslava-mudroho

**Дніпро:** окрема папка `dnipro/`, уролог + ЛОР, окремі ціни в `onclinic_services` з `city_slug = 'dnipro'`
