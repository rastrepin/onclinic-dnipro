/**
 * booking.js — Shared BookingModal for ON Klinik Kharkiv
 * Provides: openBookingModal(), closeModal()
 * Handles: modal injection, summary card, form submit → /api/leads/onclinic,
 *          session_id, UTM, GA4 events, phone mask, pill toggles.
 */
(function () {
  'use strict';

  // ── SERVICE MAP ────────────────────────────────────────────────────────────
  var SERVICE_MAP = {
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
    'gisteroskopia': {
      searchName: 'Гістероскопія',
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
      price: 'від 700 грн',
    },
  };

  var DOCTOR_INFO = {
    afanasiev: {
      name: 'Афанасьєв І.В.',
      role: 'Оперуючий гінеколог, к.м.н.',
      price: '700 грн',
      avatar: '/assets/doctors/afanasiev-card.webp',
    },
    striukov: {
      name: 'Стрюков Д.В.',
      role: 'Оперуючий гінеколог, к.м.н.',
      price: '700 грн',
      avatar: '/assets/doctors/striukov-card.webp',
    },
  };

  // ── SESSION ID ─────────────────────────────────────────────────────────────
  function getSessionId() {
    try {
      var id = sessionStorage.getItem('onclinic_session_id');
      if (!id) {
        id = crypto.randomUUID ? crypto.randomUUID() : (
          'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          })
        );
        sessionStorage.setItem('onclinic_session_id', id);
      }
      return id;
    } catch (e) { return null; }
  }

  // ── UTM PARSING ────────────────────────────────────────────────────────────
  function parseAndStoreUTM() {
    try {
      var params = new URLSearchParams(window.location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
        var v = params.get(k);
        if (v) sessionStorage.setItem(k, v);
      });
    } catch (e) {}
  }

  function getUTM() {
    var utm = {};
    try {
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
        utm[k] = sessionStorage.getItem(k) || null;
      });
    } catch (e) {}
    return utm;
  }

  // ── GA4 HELPER ─────────────────────────────────────────────────────────────
  function ga4(event, params) {
    try {
      if (typeof gtag !== 'undefined') gtag('event', event, params);
    } catch (e) {}
  }

  // ── MODAL HTML ─────────────────────────────────────────────────────────────
  var MODAL_CSS = [
    '.bm-bg{display:none;position:fixed;inset:0;background:rgba(17,24,39,.65);z-index:9000;align-items:flex-start;justify-content:center;padding:24px}',
    '.bm-bg.open{display:flex;padding-top:40px}',
    '.bm-box{background:#fff;border-radius:16px;width:100%;max-width:520px;overflow-y:auto;max-height:90vh;position:relative;box-shadow:0 25px 50px rgba(0,0,0,.25)}',
    '.bm-drag{display:none;width:40px;height:4px;background:#d1d5db;border-radius:2px;margin:10px auto 0}',
    '.bm-head{background:linear-gradient(135deg,#0B4F9A 0%,#1565C0 100%);padding:24px 28px;position:relative}',
    '.bm-close{position:absolute;top:12px;right:12px;background:rgba(255,255,255,.12);border:none;border-radius:50%;width:32px;height:32px;color:rgba(255,255,255,.8);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;transition:background .15s}',
    '.bm-close:hover{background:rgba(255,255,255,.2)}',
    '.bm-kicker{font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:4px}',
    '.bm-title{font-family:"Cormorant Garamond",serif;font-size:24px;font-weight:600;color:#fff;line-height:1.2}',
    '.bm-body{padding:24px 28px}',
    '.bm-sc{background:#f8fafc;border-radius:12px;padding:16px 20px;margin-bottom:18px;border:1px solid #e5e7eb}',
    '.bm-sc-kick{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#9ca3af;margin-bottom:8px}',
    '.bm-sc-name{font-size:17px;font-weight:700;color:#0B4F9A;margin-bottom:10px;line-height:1.3}',
    '.bm-sc-offlabel{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#9ca3af;margin-bottom:5px}',
    '.bm-sc-offlist{list-style:disc;padding-left:18px;font-size:13px;color:#374151;line-height:1.65;margin-bottom:4px}',
    '.bm-sc-note{font-size:12px;color:#6b7280;font-style:italic;margin-bottom:6px}',
    '.bm-sc-price{font-size:16px;font-weight:700;color:#0B4F9A;margin-top:6px}',
    '.bm-sc-doc{display:flex;align-items:center;gap:10px;margin-top:10px;padding-top:10px;border-top:1px solid #e5e7eb}',
    '.bm-sc-av{width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0}',
    '.bm-sc-dname{font-size:13px;font-weight:600;color:#111827}',
    '.bm-sc-dprice{font-size:12px;color:#6b7280}',
    '.bm-ff{margin-bottom:14px}',
    '.bm-ff label{display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:5px}',
    '.bm-ff input[type=text],.bm-ff input[type=tel]{width:100%;padding:12px 14px;border:1.5px solid #e5e7eb;border-radius:8px;font-family:"Onest",sans-serif;font-size:16px;color:#111827;outline:none;transition:border-color .15s;box-sizing:border-box}',
    '.bm-ff input:focus{border-color:#0B4F9A}',
    '.bm-ff input::placeholder{color:#9ca3af}',
    '.bm-ff input.err{border-color:#dc2626}',
    '.bm-ferr{color:#dc2626;font-size:11px;margin-top:4px;display:none}',
    '.bm-pills{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}',
    '.bm-pill{padding:9px 14px;min-height:44px;display:inline-flex;align-items:center;border:1.5px solid #e5e7eb;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;font-family:"Onest",sans-serif;background:#fff;color:#374151;transition:all .15s;user-select:none}',
    '.bm-pill.sel{border-color:#0B4F9A;background:#EBF2FF;color:#0B4F9A}',
    '.bm-pill input{display:none}',
    '.bm-consent{display:flex;align-items:flex-start;gap:10px;margin:16px 0;font-size:12px;color:#6b7280;line-height:1.5;cursor:pointer}',
    '.bm-consent input{margin-top:2px;flex-shrink:0;cursor:pointer;width:16px;height:16px}',
    '.bm-submit{width:100%;background:#0B4F9A;border:none;border-radius:10px;padding:14px;font-family:"Onest",sans-serif;font-size:15px;font-weight:500;color:#fff;cursor:pointer;transition:background .2s}',
    '.bm-submit:hover{background:#1565C0}',
    '.bm-submit:disabled{background:#d1d5db;cursor:not-allowed}',
    '.bm-hint{font-size:11px;color:#9ca3af;text-align:center;margin-top:6px}',
    '.bm-honey{display:none}',
    '.bm-success{text-align:center;padding:20px 0}',
    '.bm-success .fs-icon{font-size:48px;margin-bottom:12px;color:#16a34a}',
    '.bm-success .fs-title{font-family:"Cormorant Garamond",serif;font-size:26px;font-weight:600;color:#0B4F9A;margin-bottom:8px}',
    '.bm-success .fs-sub{font-size:14px;color:#6b7280;line-height:1.6;margin-bottom:16px}',
    '.bm-success .fs-close{width:100%;background:#0B4F9A;border:none;border-radius:10px;padding:12px;font-family:"Onest",sans-serif;font-size:14px;font-weight:500;color:#fff;cursor:pointer}',
    '.bm-errblock{background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:12px 16px;color:#dc2626;font-size:13px;margin-top:8px;display:none}',
    '.bm-select{width:100%;padding:12px 14px;border:1.5px solid #e5e7eb;border-radius:8px;font-family:"Onest",sans-serif;font-size:16px;color:#111827;outline:none;transition:border-color .15s;box-sizing:border-box;background:#fff;cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}',
    '.bm-select:focus{border-color:#0B4F9A}',
    '.bm-select.err{border-color:#dc2626}',
    '.bm-textarea{width:100%;padding:12px 14px;border:1.5px solid #e5e7eb;border-radius:8px;font-family:"Onest",sans-serif;font-size:14px;color:#111827;outline:none;transition:border-color .15s;box-sizing:border-box;resize:vertical;min-height:80px}',
    '.bm-textarea:focus{border-color:#0B4F9A}',
    '@media(max-width:767px){',
    '  .bm-bg{padding:0!important;align-items:flex-end}',
    '  .bm-bg.open{display:flex;padding-top:0!important}',
    '  .bm-box{max-width:100%!important;border-radius:16px 16px 0 0!important;max-height:85vh}',
    '  .bm-drag{display:block}',
    '}',
  ].join('\n');

  function injectStyles() {
    if (document.getElementById('bm-styles')) return;
    var st = document.createElement('style');
    st.id = 'bm-styles';
    st.textContent = MODAL_CSS;
    document.head.appendChild(st);
  }


  function buildQuizSummaryCardHTML(caseSlug, doctorSlug, quizContext) {
    var type = quizContext.type; // 'single'|'multiple'|'observation'|'no_recommendation'
    var methods = quizContext.methods || [];
    var html = '<div class="bm-sc">';

    // Header kicker
    if (type === 'no_recommendation' || type === 'observation') {
      html += '<div class="bm-sc-kick">Ви записуєтесь на консультацію з УЗД</div>';
    } else if (doctorSlug) {
      html += '<div class="bm-sc-kick">Ви записуєтесь на консультацію гінеколога-хірурга</div>';
    } else {
      html += '<div class="bm-sc-kick">Ви записуєтесь на консультацію гінеколога</div>';
    }

    // Doctor block
    if (doctorSlug && DOCTOR_INFO[doctorSlug]) {
      var doc = DOCTOR_INFO[doctorSlug];
      html += '<div class="bm-sc-doc">';
      html += '<img class="bm-sc-av" src="' + doc.avatar + '" alt="' + escHtml(doc.name) + '" loading="lazy">';
      html += '<div><div class="bm-sc-dname">' + escHtml(doc.name) + '</div>';
      html += '<div class="bm-sc-dprice">' + escHtml(doc.role) + '</div>';
      html += '<div class="bm-sc-dprice">Консультація ' + escHtml(doc.price) + '</div></div>';
      html += '</div>';
    } else if (!doctorSlug && (type === 'single' || type === 'multiple')) {
      html += '<div style="font-size:12px;color:#6b7280;margin:8px 0 4px">Клініка запропонує лікаря з наявних:</div>';
      html += '<div style="font-size:13px;color:#374151;margin-bottom:2px">Афанасьєв І.В. — 700 грн</div>';
      html += '<div style="font-size:13px;color:#374151">Стрюков Д.В. — 700 грн</div>';
    }

    // Recommendation block
    if (type === 'single' && methods.length > 0) {
      html += '<div style="margin-top:12px;padding-top:12px;border-top:1px solid #e5e7eb">';
      html += '<div class="bm-sc-offlabel">За вашими відповідями лікар імовірно запропонує:</div>';
      html += '<div class="bm-sc-name">' + escHtml(methods[0].name) + '</div>';
      html += '<div class="bm-sc-price">' + escHtml(methods[0].price) + '</div>';
      html += '</div>';
    } else if (type === 'multiple' && methods.length > 1) {
      html += '<div style="margin-top:12px;padding-top:12px;border-top:1px solid #e5e7eb">';
      html += '<div class="bm-sc-offlabel">За вашими відповідями можливі варіанти:</div>';
      methods.forEach(function(m) {
        html += '<div style="font-size:13px;color:#374151;margin-top:4px">• ' + escHtml(m.name) + ' — ' + escHtml(m.price) + '</div>';
      });
      html += '</div>';
    } else if (type === 'no_recommendation') {
      html += '<div style="margin-top:10px;font-size:13px;color:#6b7280">На консультації лікар огляне вас, зробить УЗД, визначить тип та особливості новоутворення і запропонує план дій.</div>';
    } else if (type === 'observation') {
      html += '<div style="margin-top:10px;font-size:13px;color:#6b7280">Кіста може спостерігатись динамічно. На консультації лікар підтвердить або скоригує тактику ведення.</div>';
    }

    // Disclaimer for surgical recommendations
    if (type === 'single' || type === 'multiple') {
      html += '<div style="font-size:11px;color:#9ca3af;margin-top:10px;font-style:italic">Остаточне рішення приймається лікарем після огляду та оцінки УЗД.</div>';
    }

    html += '</div>';
    return html;
  }

  function buildSummaryCardHTML(prefilledCase, prefilledDoctor) {
    if (!prefilledCase && !prefilledDoctor) return '';

    var html = '<div class="bm-sc">';

    if (prefilledCase && SERVICE_MAP[prefilledCase]) {
      var svc = SERVICE_MAP[prefilledCase];
      html += '<div class="bm-sc-kick">Ви записуєтесь на:</div>';
      html += '<div class="bm-sc-name">' + escHtml(svc.searchName) + '</div>';
      html += '<div class="bm-sc-offlabel">Офіційна назва послуги:</div>';
      if (Array.isArray(svc.officialName)) {
        html += '<ul class="bm-sc-offlist">';
        svc.officialName.forEach(function (n) {
          html += '<li>' + escHtml(n) + '</li>';
        });
        html += '</ul>';
        html += '<div class="bm-sc-note">Точний варіант визначить лікар</div>';
      } else {
        html += '<ul class="bm-sc-offlist"><li>' + escHtml(svc.officialName) + '</li></ul>';
      }
      html += '<div class="bm-sc-price">Вартість ' + escHtml(svc.price) + '</div>';
    } else if (prefilledDoctor && !prefilledCase) {
      html += '<div class="bm-sc-kick">Ви записуєтесь на консультацію:</div>';
    }

    if (prefilledDoctor && DOCTOR_INFO[prefilledDoctor]) {
      var doc = DOCTOR_INFO[prefilledDoctor];
      html += '<div class="bm-sc-doc">';
      html += '<img class="bm-sc-av" src="' + doc.avatar + '" alt="' + escHtml(doc.name) + '" loading="lazy">';
      html += '<div><div class="bm-sc-dname">' + escHtml(doc.name) + '</div>';
      html += '<div class="bm-sc-dprice">Консультація ' + escHtml(doc.price) + '</div></div>';
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function injectModal() {
    if (document.getElementById('bm-overlay')) return;
    injectStyles();

    var html = [
      '<div class="bm-bg" id="bm-overlay">',
      '  <div class="bm-box" id="bm-box">',
      '    <div class="bm-drag"></div>',
      '    <div class="bm-head">',
      '      <button class="bm-close" id="bm-close-btn" aria-label="Закрити">✕</button>',
      '      <div class="bm-kicker">ОН Клінік Харків · Левада</div>',
      '      <div class="bm-title">Запис на консультацію</div>',
      '    </div>',
      '    <div class="bm-body">',
      '      <div id="bm-form-wrap">',
      '        <div id="bm-summary"></div>',
      '        <form id="bm-form" novalidate>',
      '          <div class="bm-honey"><input type="text" name="website" autocomplete="off" tabindex="-1"></div>',
      '          <input type="hidden" name="case_slug" value="">',
      '          <input type="hidden" name="preferred_doctor" value="">',
      '          <input type="hidden" name="source_page" value="">',
      '          <input type="hidden" name="source_cta" value="">',
      '          <input type="hidden" name="preferred_day" value="">',
      '          <input type="hidden" name="quiz_answers" value="">',
      '          <input type="hidden" name="selected_criteria" value="">',
      '          <input type="hidden" name="other_purpose" value="">',
      '          <div class="bm-ff">',
      '            <label for="bm-name">Ваше ім\'я *</label>',
      '            <input type="text" id="bm-name" name="name" autocomplete="given-name" placeholder="Як до вас звертатись">',
      '            <div class="bm-ferr" id="bm-err-name"></div>',
      '          </div>',
      '          <div class="bm-ff">',
      '            <label for="bm-phone">Телефон *</label>',
      '            <input type="tel" id="bm-phone" name="phone" inputmode="numeric" autocomplete="tel" placeholder="+380 __ ___ __ __">',
      '            <div class="bm-ferr" id="bm-err-phone"></div>',
      '          </div>',
      '          <div class="bm-ff">',
      '            <label>Зручний спосіб зв\'язку *</label>',
      '            <div class="bm-pills" id="bm-contact-pills">',
      '              <label class="bm-pill sel" data-pill="contact"><input type="radio" name="contact_method" value="call" checked>Дзвінок</label>',
      '              <label class="bm-pill" data-pill="contact"><input type="radio" name="contact_method" value="telegram">Telegram</label>',
      '              <label class="bm-pill" data-pill="contact"><input type="radio" name="contact_method" value="viber">Viber</label>',
      '            </div>',
      '          </div>',
      '          <div class="bm-ff">',
      '            <label>Бажаний день</label>',
      '            <div class="bm-pills" id="bm-day-pills">',
      '              <button type="button" class="bm-pill" data-day="today">Сьогодні</button>',
      '              <button type="button" class="bm-pill" data-day="tomorrow">Завтра</button>',
      '              <button type="button" class="bm-pill" data-day="this_week">Цього тижня</button>',
      '            </div>',
      '          </div>',
      '          <div id="bm-purpose-wrap" style="display:none">',
      '            <div class="bm-ff">',
      '              <label for="bm-purpose">Мета запису *</label>',
      '              <select id="bm-purpose" class="bm-select">',
      '                <option value="">\u2014 Оберіть мету \u2014</option>',
      '                <option value="mioma-laparoskopichna-miomektomiia">Лапароскопічна міомектомія</option>',
      '                <option value="endometrioz-kista-laparoskopia">Лапароскопія при ендометріозі та кісті яєчника</option>',
      '                <option value="mioma-laparoskopichna-gisterektomiia">Лапароскопічна гістеректомія</option>',
      '                <option value="gisteroskopia-polipektomia">Гістероскопія</option>',
      '                <option value="prolapс-matky-kolporafia">Кольпорафія</option>',
      '                <option value="other">Інша мета</option>',
      '              </select>',
      '              <div class="bm-ferr" id="bm-err-purpose"></div>',
      '            </div>',
      '            <div id="bm-other-wrap" style="display:none">',
      '              <div class="bm-ff">',
      '                <label for="bm-other-purpose">Опишіть мету (необов\u2019язково)</label>',
      '                <textarea id="bm-other-purpose" class="bm-textarea" placeholder="Опишіть вашу ситуацію або мету запису"></textarea>',
      '              </div>',
      '            </div>',
      '          </div>',
      '          <label class="bm-consent">',
      '            <input type="checkbox" id="bm-consent">',
      '            Я даю згоду на обробку персональних даних відповідно до законодавства України',
      '          </label>',
      '          <button type="submit" class="bm-submit" id="bm-submit" disabled>Записатися на консультацію →</button>',
      '          <div class="bm-hint">Ми зв\'яжемось протягом робочого дня</div>',
      '        </form>',
      '      </div>',
      '      <div class="bm-success" id="bm-success" style="display:none">',
      '        <div class="fs-icon">✓</div>',
      '        <div class="fs-title">Заявку надіслано</div>',
      '        <p class="fs-sub">Ми зв\'яжемось з вами протягом робочого дня. Очікуйте дзвінок або повідомлення.</p>',
      '        <button class="fs-close" onclick="window.closeBookingModal()">Закрити</button>',
      '      </div>',
      '      <div class="bm-errblock" id="bm-errblock"></div>',
      '    </div>',
      '  </div>',
      '</div>',
    ].join('\n');

    var el = document.createElement('div');
    el.innerHTML = html;
    document.body.appendChild(el.firstElementChild);

    // Wire up events
    document.getElementById('bm-close-btn').addEventListener('click', window.closeBookingModal);

    // Backdrop click
    document.getElementById('bm-overlay').addEventListener('click', function (e) {
      if (e.target === this) {
        // If form has any user input, still close (spec says close on backdrop click)
        window.closeBookingModal();
      }
    });

    // Esc key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') window.closeBookingModal();
    });

    // Contact method pill toggle
    document.getElementById('bm-contact-pills').addEventListener('click', function (e) {
      var pill = e.target.closest('.bm-pill');
      if (!pill) return;
      this.querySelectorAll('.bm-pill').forEach(function (p) { p.classList.remove('sel'); });
      pill.classList.add('sel');
      var radio = pill.querySelector('input[type=radio]');
      if (radio) radio.checked = true;
    });

    // Day pill toggle
    document.getElementById('bm-day-pills').addEventListener('click', function (e) {
      var pill = e.target.closest('.bm-pill[data-day]');
      if (!pill) return;
      var wasSelected = pill.classList.contains('sel');
      this.querySelectorAll('.bm-pill').forEach(function (p) { p.classList.remove('sel'); });
      var form = document.getElementById('bm-form');
      if (!wasSelected) {
        pill.classList.add('sel');
        form.querySelector('[name=preferred_day]').value = pill.dataset.day;
      } else {
        form.querySelector('[name=preferred_day]').value = '';
      }
    });

    // Purpose dropdown
    document.getElementById('bm-purpose').addEventListener('change', function () {
      var val = this.value;
      var form = document.getElementById('bm-form');
      var otherWrap = document.getElementById('bm-other-wrap');
      var summaryEl = document.getElementById('bm-summary');
      var doctorSlug = form.querySelector('[name=preferred_doctor]').value || null;
      var errPurpose = document.getElementById('bm-err-purpose');
      if (errPurpose) { errPurpose.style.display = 'none'; this.classList.remove('err'); }

      if (val === 'other') {
        form.querySelector('[name=case_slug]').value = '';
        form.querySelector('[name=other_purpose]').value = '';
        otherWrap.style.display = 'block';
        summaryEl.innerHTML = buildSummaryCardHTML(null, doctorSlug);
      } else if (val) {
        form.querySelector('[name=case_slug]').value = val;
        form.querySelector('[name=other_purpose]').value = '';
        otherWrap.style.display = 'none';
        summaryEl.innerHTML = buildSummaryCardHTML(val, doctorSlug);
      } else {
        form.querySelector('[name=case_slug]').value = '';
        form.querySelector('[name=other_purpose]').value = '';
        otherWrap.style.display = 'none';
        summaryEl.innerHTML = buildSummaryCardHTML(null, doctorSlug);
      }
    });

    // Consent
    document.getElementById('bm-consent').addEventListener('change', function () {
      document.getElementById('bm-submit').disabled = !this.checked;
    });

    // Phone: track started
    var formStarted = false;
    document.getElementById('bm-form').addEventListener('input', function () {
      if (!formStarted) {
        formStarted = true;
        ga4('form_started', { session_id: getSessionId() });
      }
    });

    // Phone mask on blur (lightweight)
    document.getElementById('bm-phone').addEventListener('blur', function () {
      validatePhone(this);
    });
    document.getElementById('bm-name').addEventListener('blur', function () {
      validateName(this);
    });

    // Form submit
    document.getElementById('bm-form').addEventListener('submit', function (e) {
      e.preventDefault();
      handleSubmit();
    });

    // Mobile swipe-down to close
    setupSwipeClose();
  }

  function setupSwipeClose() {
    var box = document.getElementById('bm-box');
    var startY = 0;
    box.addEventListener('touchstart', function (e) {
      startY = e.touches[0].clientY;
    }, { passive: true });
    box.addEventListener('touchend', function (e) {
      var dy = e.changedTouches[0].clientY - startY;
      if (dy > 80) window.closeBookingModal();
    }, { passive: true });
  }

  function validateName(input) {
    var errEl = document.getElementById('bm-err-name');
    if (!input.value.trim() || input.value.trim().length < 2) {
      input.classList.add('err');
      errEl.textContent = "Введіть ваше ім'я (мінімум 2 символи)";
      errEl.style.display = 'block';
      return false;
    }
    input.classList.remove('err');
    errEl.style.display = 'none';
    return true;
  }

  function validatePhone(input) {
    var errEl = document.getElementById('bm-err-phone');
    var digits = input.value.replace(/\D/g, '');
    if (digits.length < 10) {
      input.classList.add('err');
      errEl.textContent = 'Введіть коректний номер телефону';
      errEl.style.display = 'block';
      return false;
    }
    input.classList.remove('err');
    errEl.style.display = 'none';
    return true;
  }

  async function handleSubmit() {
    var form = document.getElementById('bm-form');
    var nameInput = document.getElementById('bm-name');
    var phoneInput = document.getElementById('bm-phone');
    var errBlock = document.getElementById('bm-errblock');

    // Honeypot
    if (form.querySelector('[name=website]').value) return;

    var nameOk = validateName(nameInput);
    var phoneOk = validatePhone(phoneInput);
    if (!nameOk || !phoneOk) return;

    // Validate purpose dropdown if shown
    var purposeWrap = document.getElementById('bm-purpose-wrap');
    if (purposeWrap && purposeWrap.style.display !== 'none') {
      var purposeSel = document.getElementById('bm-purpose');
      if (!purposeSel || !purposeSel.value) {
        var errPurpose = document.getElementById('bm-err-purpose');
        if (errPurpose) { errPurpose.textContent = 'Будь ласка, оберіть мету запису'; errPurpose.style.display = 'block'; }
        if (purposeSel) purposeSel.classList.add('err');
        return;
      }
    }

    var sessionId = getSessionId();
    var utm = getUTM();
    var caseSlug = form.querySelector('[name=case_slug]').value || null;

    // Collect other_purpose if "Інша мета" selected
    var otherPurposeVal = null;
    var otherWrap2 = document.getElementById('bm-other-wrap');
    if (otherWrap2 && otherWrap2.style.display !== 'none') {
      var otherTa2 = document.getElementById('bm-other-purpose');
      otherPurposeVal = otherTa2 && otherTa2.value.trim() ? otherTa2.value.trim() : null;
    }

    var payload = {
      name:             nameInput.value.trim(),
      phone:            phoneInput.value.trim(),
      contact_method:   (form.querySelector('input[name=contact_method]:checked') || {}).value || 'call',
      preferred_day:    form.querySelector('[name=preferred_day]').value || null,
      case_slug:        caseSlug,
      preferred_doctor: form.querySelector('[name=preferred_doctor]').value || null,
      source_page:      form.querySelector('[name=source_page]').value || window.location.pathname,
      source_cta:       form.querySelector('[name=source_cta]').value || null,
      quiz_answers:     tryParseJSON(form.querySelector('[name=quiz_answers]').value),
      selected_criteria:tryParseJSON(form.querySelector('[name=selected_criteria]').value),
      other_purpose:    otherPurposeVal,
      session_id:       sessionId,
      referrer:         document.referrer || null,
      utm_source:       utm.utm_source,
      utm_medium:       utm.utm_medium,
      utm_campaign:     utm.utm_campaign,
      utm_content:      utm.utm_content,
      utm_term:         utm.utm_term,
      consent_given:    true,
      website:          '',
    };

    // Disable submit
    var submitBtn = document.getElementById('bm-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Відправляємо...';
    errBlock.style.display = 'none';

    ga4('form_submitted', { session_id: sessionId, case_slug: caseSlug });

    try {
      var res = await fetch('/api/leads/onclinic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      var data = await res.json();

      if (res.ok && data.ok) {
        ga4('lead_created', {
          lead_id: data.leadId,
          case_slug: caseSlug,
          preferred_doctor: payload.preferred_doctor,
          session_id: sessionId,
        });
        showSuccess();
      } else {
        var msg = data.error || 'Сталася помилка. Спробуйте ще раз або зателефонуйте на 0 800 21 86 16.';
        showError(msg);
        ga4('form_error', { error_type: 'api_error', session_id: sessionId });
      }
    } catch (err) {
      showError('Сталася помилка. Перевірте з\'єднання та спробуйте ще раз.');
      ga4('form_error', { error_type: 'network_error', session_id: sessionId });
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Записатися на консультацію →';
    }
  }

  function showSuccess() {
    document.getElementById('bm-form-wrap').style.display = 'none';
    document.getElementById('bm-success').style.display = 'block';
    document.getElementById('bm-errblock').style.display = 'none';
  }

  function showError(msg) {
    var errBlock = document.getElementById('bm-errblock');
    errBlock.textContent = msg;
    errBlock.style.display = 'block';
    document.getElementById('bm-submit').disabled = false;
    document.getElementById('bm-submit').textContent = 'Записатися на консультацію →';
  }

  function tryParseJSON(str) {
    if (!str) return null;
    try { return JSON.parse(str); } catch (e) { return null; }
  }

  function resetForm() {
    var form = document.getElementById('bm-form');
    if (!form) return;
    form.querySelector('[name=name]').value = '';
    form.querySelector('[name=phone]').value = '';
    form.querySelector('[name=preferred_day]').value = '';
    form.querySelector('[name=case_slug]').value = '';
    form.querySelector('[name=preferred_doctor]').value = '';
    form.querySelector('[name=source_page]').value = '';
    form.querySelector('[name=source_cta]').value = '';
    form.querySelector('[name=quiz_answers]').value = '';
    form.querySelector('[name=selected_criteria]').value = '';
    form.querySelector('[name=other_purpose]').value = '';
    // Reset purpose dropdown
    var purposeSel = document.getElementById('bm-purpose');
    if (purposeSel) { purposeSel.value = ''; purposeSel.classList.remove('err'); }
    var otherWrap = document.getElementById('bm-other-wrap');
    if (otherWrap) otherWrap.style.display = 'none';
    var otherTa = document.getElementById('bm-other-purpose');
    if (otherTa) otherTa.value = '';
    var errPurpose = document.getElementById('bm-err-purpose');
    if (errPurpose) errPurpose.style.display = 'none';
    document.getElementById('bm-consent').checked = false;
    document.getElementById('bm-submit').disabled = true;
    document.getElementById('bm-submit').textContent = 'Записатися на консультацію →';
    // Reset contact pills to "call"
    document.getElementById('bm-contact-pills').querySelectorAll('.bm-pill').forEach(function (p) {
      var radio = p.querySelector('input[type=radio]');
      if (radio && radio.value === 'call') {
        p.classList.add('sel');
        radio.checked = true;
      } else {
        p.classList.remove('sel');
        if (radio) radio.checked = false;
      }
    });
    // Reset day pills
    document.getElementById('bm-day-pills').querySelectorAll('.bm-pill').forEach(function (p) {
      p.classList.remove('sel');
    });
    // Reset errors
    ['bm-err-name', 'bm-err-phone'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    ['bm-name', 'bm-phone'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.remove('err');
    });
    document.getElementById('bm-errblock').style.display = 'none';
    // Restore form wrap
    document.getElementById('bm-form-wrap').style.display = 'block';
    document.getElementById('bm-success').style.display = 'none';
  }

  // ── PUBLIC API ─────────────────────────────────────────────────────────────

  /**
   * openBookingModal({
   *   prefilledCase?:    string,        // case_slug
   *   prefilledDoctor?:  'afanasiev' | 'striukov',
   *   sourceCTA:         string,
   *   quizAnswers?:      object,
   *   selectedCriteria?: string[],
   * })
   */
  window.openBookingModal = function (opts) {
    opts = opts || {};
    injectModal();
    resetForm();

    var form = document.getElementById('bm-form');
    var caseSlug = opts.prefilledCase || null;
    var doctorSlug = opts.prefilledDoctor || null;
    var sourceCTA = opts.sourceCTA || '';

    // Populate hidden fields
    form.querySelector('[name=case_slug]').value = caseSlug || '';
    form.querySelector('[name=preferred_doctor]').value = doctorSlug || '';
    form.querySelector('[name=source_page]').value = window.location.pathname;
    form.querySelector('[name=source_cta]').value = sourceCTA;
    if (opts.quizAnswers) {
      form.querySelector('[name=quiz_answers]').value = JSON.stringify(opts.quizAnswers);
    }
    if (opts.selectedCriteria) {
      form.querySelector('[name=selected_criteria]').value = JSON.stringify(opts.selectedCriteria);
    }

    // Summary card
    var summaryEl = document.getElementById('bm-summary');
    if (opts.sourceCTA === 'quiz_result' && opts.quizContext) {
      summaryEl.innerHTML = buildQuizSummaryCardHTML(caseSlug, doctorSlug, opts.quizContext);
    } else {
      summaryEl.innerHTML = buildSummaryCardHTML(caseSlug, doctorSlug);
    }

    // Purpose dropdown: show when no prefilledCase
    var purposeWrap = document.getElementById('bm-purpose-wrap');
    if (purposeWrap) {
      purposeWrap.style.display = caseSlug ? 'none' : 'block';
      var purposeSel = document.getElementById('bm-purpose');
      if (purposeSel) purposeSel.value = '';
      var otherWrap = document.getElementById('bm-other-wrap');
      if (otherWrap) otherWrap.style.display = 'none';
      var otherTa = document.getElementById('bm-other-purpose');
      if (otherTa) otherTa.value = '';
      var errPurpose = document.getElementById('bm-err-purpose');
      if (errPurpose) errPurpose.style.display = 'none';
    }

    // Open
    document.getElementById('bm-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus first field
    setTimeout(function () {
      var nameField = document.getElementById('bm-name');
      if (nameField) nameField.focus();
    }, 100);

    // GA4
    ga4('modal_opened', {
      source_cta: sourceCTA,
      case_slug: caseSlug,
      preferred_doctor: doctorSlug,
      session_id: getSessionId(),
    });
  };

  window.closeBookingModal = function () {
    var overlay = document.getElementById('bm-overlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Legacy alias — some pages may still call closeModal()
  window.closeModal = window.closeBookingModal;

  // ── INIT ───────────────────────────────────────────────────────────────────
  parseAndStoreUTM();
  getSessionId();

})();
