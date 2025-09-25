// api/generate-sticker.js (ES-module, Node 18+)
const CONTROLLER_TIMEOUT_MS = 25_000; // under Vercel 30s cap
const UA = 'WeedStickerGenerator/1.0 (+https://yourapp.example)';

function badRequest(res, msg) {
  return res.status(400).json({ error: msg || 'Invalid request' });
}
function methodNotAllowed(res) {
  return res.status(405).json({ error: 'Method not allowed' });
}

export default async function handler(req, res) {
  // --- CORS & cache headers ---
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // --- pre-flight ---
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return methodNotAllowed(res);

  try {
    if (!req.headers['content-type']?.includes('application/json')) {
      return badRequest(res, 'Content-Type must be application/json');
    }

    // Vercel parses JSON body for Node runtimes; still validate shape
    const { prompt, size } = req.body || {};

    // --- validation ---
    if (typeof prompt !== 'string') return badRequest(res, 'Invalid prompt');
    const trimmed = prompt.trim();
    if (!trimmed) return badRequest(res, 'Prompt cannot be empty');
    if (trimmed.length > 600) return badRequest(res, 'Prompt too long (max 600 chars)');

    // Size control: allow 'sm' | 'md' | 'lg' | explicit {w,h}, defaults md
    let width = 1024, height = 1024;
    if (typeof size === 'string') {
      if (size === 'sm') { width = height = 768; }
      else if (size === 'md') { width = height = 1024; }
      else if (size === 'lg') { width = height = 1536; }
    } else if (size && typeof size === 'object') {
      const w = Number(size.width), h = Number(size.height);
      if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0 && w <= 4096 && h <= 4096) {
        width = Math.floor(w); height = Math.floor(h);
      }
    }

    // --- Pollinations call (FLUX) ---
    const params = new URLSearchParams({
      nologo: 'true',
      private: 'true',
      width: String(width),
      height: String(height),
      model: 'flux',
      enhance: 'true'
    });
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(trimmed)}?${params.toString()}`;

    // Abort/timeout
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), CONTROLLER_TIMEOUT_MS);

    // simple 1 retry on 429 with jitter
    async function fetchOnce() {
      const resp = await fetch(url, {
        signal: ctrl.signal,
        headers: { 'User-Agent': UA, 'Accept': 'image/*' },
      });
      return resp;
    }
    let fetchRes = await fetchOnce();

    if (fetchRes.status === 429) {
      const retryAfter = Number(fetchRes.headers.get('retry-after')) || 1;
      await new Promise(r => setTimeout(r, (retryAfter * 1000) + Math.random() * 400));
      fetchRes = await fetchOnce();
    }

    if (!fetchRes.ok) {
      clearTimeout(t);
      const msg = `Pollinations error ${fetchRes.status}`;
      return res.status(502).json({ error: 'Upstream image generation failed', details: msg });
    }

    // Enforce image-like content type when possible
    const ctype = fetchRes.headers.get('content-type') || '';
    if (!ctype.startsWith('image/')) {
      // Try to read text for debugging
      let details = '';
      try { details = await fetchRes.text(); } catch {}
      clearTimeout(t);
      return res.status(502).json({ error: 'Upstream returned non-image content', details: details?.slice(0, 300) });
    }

    const buffer = Buffer.from(await fetchRes.arrayBuffer());
    clearTimeout(t);

    // Base64 encode
    const base64 = buffer.toString('base64');

    // Tip: we don’t set Content-Type here since we return JSON with base64 payload
    return res.status(200).json({
      success: true,
      image: base64,
      format: ctype.replace('image/', '') || 'jpeg',
      width,
      height,
      method: 'Pollinations-FLUX'
    });
  } catch (err) {
    const message = err?.name === 'AbortError' ? 'Image generation timed out' : err?.message || 'Unknown error';
    console.error('[generate-sticker] Error:', message);
    return res.status(500).json({ error: 'Generation failed', details: message });
  }
}
