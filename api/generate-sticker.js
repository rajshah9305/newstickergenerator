// api/generate-sticker.js  →  4K UHD via Pollinations
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0 || prompt.length > 600)
      return res.status(400).json({ error: 'Invalid prompt' });

    const cleanPrompt = prompt.trim();

    /* 4K UHD request */
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}` +
                '?model=flux-4k&width=3840&height=2160&nologo=true&private=true&enhance=true';

    const fetchRes = await fetch(url);
    if (!fetchRes.ok) throw new Error('Pollinations 4K error ' + fetchRes.status);

    const buffer = await fetchRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    return res.status(200).json({ success: true, image: base64, method: 'Pollinations-4K' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '4K generation failed', details: err.message });
  }
}
