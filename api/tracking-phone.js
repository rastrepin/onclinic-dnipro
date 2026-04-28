// Vercel Serverless Function — /api/tracking-phone
// GET /api/tracking-phone?branch=onclinic-kharkiv-levada
// Returns tracking phone for the given clinic branch slug, or null.
// Used by booking.js to dynamically replace phone placeholders.

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const branchSlug = (req.query.branch || '').trim();
  if (!branchSlug) {
    return res.status(400).json({ error: 'branch param required' });
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('[tracking-phone] Missing SUPABASE env vars');
    return res.status(500).json({ phone: null });
  }

  try {
    const url = `${SUPABASE_URL}/rest/v1/clinic_branches?slug=eq.${encodeURIComponent(branchSlug)}&select=tracking_phone&limit=1`;
    const sbRes = await fetch(url, {
      headers: {
        'apikey':        SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      },
    });

    if (!sbRes.ok) {
      console.error('[tracking-phone] Supabase error:', await sbRes.text());
      return res.status(200).json({ phone: null });
    }

    const rows = await sbRes.json();
    const raw = rows[0]?.tracking_phone || null;

    if (!raw) {
      return res.status(200).json({ phone: null });
    }

    // Format for display: +38 057 123-45-67 → +38 (057) 123-45-67
    const digits = raw.replace(/\D/g, '');
    let display = raw;
    try {
      // Expects 12 digits: 380XXXXXXXXX
      if (digits.length === 12 && digits.startsWith('38')) {
        const city  = digits.slice(2, 5);
        const part1 = digits.slice(5, 8);
        const part2 = digits.slice(8, 10);
        const part3 = digits.slice(10, 12);
        display = `+38 (${city}) ${part1}-${part2}-${part3}`;
      }
    } catch (e) { /* use raw */ }

    return res.status(200).json({ phone: raw, phoneDisplay: display });
  } catch (err) {
    console.error('[tracking-phone] fetch error:', err);
    return res.status(200).json({ phone: null });
  }
};
