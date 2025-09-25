import { Buffer } from 'buffer';

// Pollinations AI exclusive sticker generation API
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { prompt, seed, quality = 'premium', style = 'sticker' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    // Enhanced prompt specifically optimized for Pollinations AI sticker generation
    const enhancedPrompt = `${prompt}, professional sticker design, ultra high resolution, perfect vector art quality, vibrant colors, clean white background, die-cut ready, glossy finish appearance, commercial quality, masterpiece`;

    console.log(`🎨 Generating sticker with Pollinations AI`);
    console.log(`📝 Prompt: ${prompt}`);
    console.log(`🔧 Quality: ${quality}, Style: ${style}, Seed: ${seed || 'random'}`);

    // Pollinations AI parameters
    const pollinationsParams = new URLSearchParams({
      prompt: enhancedPrompt,
      width: '1024',
      height: '1024',
      model: 'flux',
      enhance: 'true',
      nologo: 'true',
      private: 'false'
    });

    // Add seed if provided
    if (seed) {
      pollinationsParams.append('seed', seed.toString());
    }

    // Pollinations AI endpoint
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?${pollinationsParams.toString()}`;

    console.log(`🔄 Requesting from Pollinations AI...`);

    // Fetch image from Pollinations AI
    const response = await fetch(pollinationsUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Weed-Sticker-Generator/2.0',
        'Accept': 'image/*'
      }
    });

    if (!response.ok) {
      throw new Error(`Pollinations AI request failed: ${response.status} ${response.statusText}`);
    }

    // Get image buffer
    const imageBuffer = await response.arrayBuffer();
    
    if (!imageBuffer || imageBuffer.byteLength === 0) {
      throw new Error('Empty image response from Pollinations AI');
    }

    // Convert to base64
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    console.log(`✅ Successfully generated sticker with Pollinations AI`);
    console.log(`📊 Image size: ${Math.round(imageBuffer.byteLength / 1024)}KB`);

    const responseData = {
      success: true,
      image: imageBase64,
      prompt: prompt,
      enhancedPrompt: enhancedPrompt,
      service: 'Pollinations AI',
      model: 'flux',
      seed: seed || null,
      dimensions: '1024x1024',
      quality: quality,
      timestamp: new Date().toISOString()
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('💥 Pollinations AI generation error:', error);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    return res.status(500).json({
      success: false,
      error: 'Failed to generate sticker with Pollinations AI',
      details: error.message,
      service: 'Pollinations AI',
      timestamp: new Date().toISOString()
    });
  }
}
