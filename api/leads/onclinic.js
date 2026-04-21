// Vercel Serverless Function — /api/leads/onclinic
// POST /api/leads/onclinic
// Validates payload, inserts into Supabase via service role key, fires Telegram webhook

const SERVICE_MAP = {
  'mioma-laparoskopichna-miomektomiia': {
    searchName: 'Лапароскопічна міомектомія',
    officialName: 'Видалення фіброматозного вузла (фіброміома матки) лапароскопічним методом',
    price: '26 690 грн',
  },
  'mioma-laparoskopichna-gisterektomiia': {
    searchName: 'Лапароскопічна гістеректомія',
    officialName: [
      'Екстирпація матки без придатків (фіброміома матки) лапароскопічним методом — 28 895 грн',
      'Екстирпація матки з придатками (фіброміома матки) лапароскопічним методом — 28 930 грн',
    ],
    price: 'від 28 895 грн',
  },
  'endometrioz-kista-laparoskopia': {
    searchName: 'Лапароскопія при ендометріозі та кісті яєчника',
    officialName: 'Лапароскопія на придатках (видалення кіст яєчників, ендометріоз)',
    price: 'від 21 745 грн',
  },
  'gisteroskopia-polipektomia': {
    searchName: 'Гістероскопія (діагностична + з поліпектомією)',
    officialName: [
      'Діагностична гістероскопія — 11 505 грн',
      'Гістероскопія з поліпектомією ендоскопічним методом — 13 395 грн',
    ],
    price: 'від 11 505 грн',
  },
  'prolapс-matky-kolporafia': {
    searchName: 'Кольпорафія',
    officialName: 'Кольпорафія (опущення, випадіння матки)',
    price: '25 525 грн',
  },
  'mioma-matky': {
    searchName: 'Міома матки — консультація',
    officialName: 'Консультація гінеколога-хірурга',
    price: 'від 500 грн',
  },
};

const DOCTOR_MAP = {
  afanasiev: 'Афанасьєв І.В. (консультація 500 грн)',
  striukov:  'Стрюков Д.В. (консультація 700 грн)',
};

const CTA_LABELS = {
  hero:        'Hero блок',
  price:       'Блок ціни',
  doctor_card: 'Картка лікаря',
  cta_banner:  'CTA-банер',
  header:      'Хедер сайту',
  doctor_page: 'Сторінка лікаря',
  quiz_result: 'Після квізу',
};

const CONTACT_LABELS = { call: 'Дзвінок', telegram: 'Telegram', viber: 'Viber' };

const DAY_LABELS = {
  today:     'Сьогодні',
  tomorrow:  'Завтра',
  this_week: 'Цього тижня',
};

function formatDay(preferred_day) {
  if (!preferred_day) return 'Не вказано';
  if (DAY_LABELS[preferred_day]) return DAY_LABELS[preferred_day];
  // ISO date: YYYY-MM-DD → DD.MM.YYYY (День тижня)
  try {
    const d = new Date(preferred_day + 'T00:00:00');
    const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy} (${days[d.getDay()]})`;
  } catch (e) {
    return preferred_day;
  }
}

function buildTelegramMessage(record, leadId, fullUrl) {
  const lines = [];
  lines.push('🏥 Новий лід · ОН Клінік Харків');
  lines.push('');
  lines.push(`Сторінка: ${fullUrl}`);
  lines.push('');

  // Service block
  if (record.case_slug && SERVICE_MAP[record.case_slug]) {
    const svc = SERVICE_MAP[record.case_slug];
    lines.push('Офіційна назва послуги:');
    if (Array.isArray(svc.officialName)) {
      svc.officialName.forEach(n => lines.push(`• ${n}`));
      lines.push('(Точний варіант визначить лікар на консультації)');
      lines.push(`Вартість: ${svc.price}`);
    } else {
      lines.push(svc.officialName);
      lines.push(`Вартість: ${svc.price}`);
    }
  } else if (!record.case_slug) {
    lines.push('Тип звернення: Загальна консультація');
  } else {
    lines.push(`Послуга: ${record.case_slug}`);
    console.warn(`[onclinic-leads] Unknown case_slug: ${record.case_slug}`);
  }
  lines.push('');

  // Doctor
  const docLabel = record.preferred_doctor
    ? (DOCTOR_MAP[record.preferred_doctor] || record.preferred_doctor)
    : 'Не обрано (клініка запропонує)';
  lines.push(`Обраний лікар: ${docLabel}`);

  // CTA
  const ctaLabel = CTA_LABELS[record.source_cta] || record.source_cta || 'Невідомо';
  lines.push(`CTA: ${ctaLabel}`);
  lines.push('');

  // Contact data
  lines.push(`Ім'я: ${record.name}`);
  lines.push(`Телефон: ${record.phone}`);
  lines.push(`Спосіб зв'язку: ${CONTACT_LABELS[record.contact_method] || record.contact_method || 'Не вказано'}`);
  lines.push(`Бажаний день: ${formatDay(record.preferred_day)}`);
  lines.push('');

  // UTM / source
  if (record.utm_source) {
    const utmParts = [`utm_source=${record.utm_source}`];
    if (record.utm_medium) utmParts.push(`utm_medium=${record.utm_medium}`);
    if (record.utm_campaign) utmParts.push(`utm_campaign=${record.utm_campaign}`);
    lines.push(`Джерело: ${record.utm_source} (${utmParts.join(', ')})`);
  } else {
    lines.push('Джерело: прямий перехід');
  }

  // Timestamp (Europe/Kyiv)
  const now = new Date();
  const kyivTime = now.toLocaleString('uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  lines.push(`Час: ${kyivTime} (Europe/Kyiv)`);
  lines.push(`Lead ID: ${leadId}`);

  return lines.join('\n');
}

async function sendTelegram(record, leadId, fullUrl, supabaseUrl, serviceKey) {
  const token = process.env.TELEGRAM_BOT_TOKEN_ONCLINIC;
  const chatId = process.env.TELEGRAM_CHAT_ID_ONCLINIC;
  if (!token || !chatId) {
    console.warn('[onclinic-leads] Telegram env vars not set — skipping');
    return;
  }

  const text = buildTelegramMessage(record, leadId, fullUrl);
  const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  });

  const tgData = await tgRes.json();

  // Update lead record with telegram status
  const update = tgData.ok
    ? { telegram_sent: true, telegram_sent_at: new Date().toISOString() }
    : { telegram_sent: false, telegram_error: JSON.stringify(tgData) };

  await fetch(`${supabaseUrl}/rest/v1/onclinic_leads?id=eq.${leadId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    },
    body: JSON.stringify(update),
  }).catch(e => console.error('[onclinic-leads] Telegram status update failed:', e));
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};

  // ── Honeypot ───────────────────────────────────────────────────────────────
  if (body.website) {
    return res.status(200).json({ ok: true, leadId: null }); // silent reject
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  if (!body.name || body.name.trim().length < 2)
    return res.status(400).json({ error: "Ім'я занадто коротке" });

  const phoneDigits = (body.phone || '').replace(/\D/g, '');
  if (phoneDigits.length < 10)
    return res.status(400).json({ error: 'Некоректний телефон' });

  if (body.consent_given !== true)
    return res.status(400).json({ error: 'Потрібна згода' });

  if (body.preferred_doctor != null && !['afanasiev', 'striukov'].includes(body.preferred_doctor))
    return res.status(400).json({ error: 'Некоректний лікар' });

  if (body.contact_method != null && !['call', 'telegram', 'viber'].includes(body.contact_method))
    return res.status(400).json({ error: "Некоректний спосіб зв'язку" });

  // ── Phone normalization ────────────────────────────────────────────────────
  let phone = phoneDigits;
  if (phone.startsWith('0')) phone = '38' + phone;
  if (!phone.startsWith('380')) phone = '380' + phone.slice(-9);
  phone = '+' + phone;

  // ── Env vars ───────────────────────────────────────────────────────────────
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('[onclinic-leads] Missing SUPABASE env vars');
    return res.status(500).json({ error: 'Помилка конфігурації сервера' });
  }

  // ── Full page URL ──────────────────────────────────────────────────────────
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'onclinic.check-up.in.ua';
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const fullUrl = `${proto}://${host}${body.source_page || '/'}`;

  // ── Build record ───────────────────────────────────────────────────────────
  const record = {
    name:              body.name.trim(),
    phone,
    contact_method:    body.contact_method    || null,
    preferred_day:     body.preferred_day     || null,
    case_slug:         body.case_slug         || null,
    preferred_doctor:  body.preferred_doctor  || null,
    source_page:       body.source_page       || null,
    source_cta:        body.source_cta        || null,
    quiz_answers:      body.quiz_answers      || null,
    selected_criteria: body.selected_criteria || null,
    session_id:        body.session_id        || null,
    referrer:          body.referrer          || null,
    utm_source:        body.utm_source        || null,
    utm_medium:        body.utm_medium        || null,
    utm_campaign:      body.utm_campaign      || null,
    utm_content:       body.utm_content       || null,
    utm_term:          body.utm_term          || null,
    user_agent:        req.headers['user-agent'] || null,
    consent_given:     true,
    status:            'new',
    telegram_sent:     false,
  };

  // ── INSERT into Supabase ───────────────────────────────────────────────────
  let leadId;
  try {
    const sbRes = await fetch(`${SUPABASE_URL}/rest/v1/onclinic_leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey':        SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer':        'return=representation',
      },
      body: JSON.stringify(record),
    });

    if (!sbRes.ok) {
      const errText = await sbRes.text();
      console.error('[onclinic-leads] Supabase INSERT error:', errText);
      return res.status(500).json({ error: 'Сталася помилка. Спробуйте ще раз або зателефонуйте.' });
    }

    const rows = await sbRes.json();
    leadId = rows[0]?.id;
  } catch (err) {
    console.error('[onclinic-leads] Supabase fetch error:', err);
    return res.status(500).json({ error: 'Сталася помилка. Спробуйте ще раз або зателефонуйте.' });
  }

  // ── Telegram (sequential, with timeout — Vercel freezes after res.json) ───
  await sendTelegram(record, leadId, fullUrl, SUPABASE_URL, SERVICE_KEY).catch(err =>
    console.error('[onclinic-leads] Telegram error:', err)
  );

  // ── Respond ────────────────────────────────────────────────────────────────
  res.status(200).json({ ok: true, leadId });
};
