// api/generate-sticker.js - Robust version with multiple API attempts
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        // Try multiple API endpoints/formats
        const apiAttempts = [
            {
                name: 'Imagen 3.0 Generate',
                url: `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage?key=${apiKey}`,
                payload: {
                    prompt: prompt,
                    config: {
                        aspectRatio: "1:1",
                        negativePrompt: "blurry, low quality, distorted",
                        numberOfImages: 1
                    }
                },
                parseResponse: (result) => {
                    if (result.generatedImages?.[0]?.bytesBase64Encoded) {
                        return result.generatedImages[0].bytesBase64Encoded;
                    }
                    return null;
                }
            },
            {
                name: 'Alternative Gemini Format',
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
                payload: {
                    contents: [{
                        parts: [{
                            text: `Generate a sticker image: ${prompt}. Return as base64 encoded image.`
                        }]
                    }]
                },
                parseResponse: (result) => {
                    // This would need different parsing based on actual API response
                    return null;
                }
            }
        ];

        let lastError;

        // Try each API format
        for (const attempt of apiAttempts) {
            try {
                console.log(`Trying ${attempt.name}...`);
                
                const response = await fetch(attempt.url, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(attempt.payload)
                });

                console.log(`Response status: ${response.status}`);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`${attempt.name} failed:`, errorText);
                    lastError = new Error(`${attempt.name}: ${response.status} - ${errorText}`);
                    continue;
                }

                const result = await response.json();
                console.log(`${attempt.name} result:`, Object.keys(result));
                
                const imageData = attempt.parseResponse(result);
                
                if (imageData) {
                    return res.status(200).json({
                        success: true,
                        image: imageData,
                        method: attempt.name
                    });
                } else {
                    console.error(`${attempt.name} - No image data found in response`);
                    lastError = new Error(`${attempt.name}: No image data in response`);
                }

            } catch (error) {
                console.error(`${attempt.name} error:`, error.message);
                lastError = error;
            }
        }

        // If all attempts failed, return a placeholder
        console.log('All API attempts failed, returning placeholder');
        
        // Create a simple colored square as fallback
        const canvas = createPlaceholderImage(prompt);
        
        return res.status(200).json({
            success: true,
            image: canvas,
            method: 'placeholder',
            note: 'API temporarily unavailable, showing placeholder'
        });

    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({ 
            error: 'Failed to generate sticker',
            details: error.message 
        });
    }
}

// Create a simple placeholder image
function createPlaceholderImage(prompt) {
    // This is a minimal base64 encoded 1x1 pixel green image
    // In a real implementation, you might use a canvas library to create a proper placeholder
    return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
}
