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
        
        // Validate and sanitize prompt
        if (typeof prompt !== 'string') {
            return res.status(400).json({ error: 'Prompt must be a string' });
        }
        
        if (prompt.length > 500) {
            return res.status(400).json({ error: 'Prompt too long (max 500 characters)' });
        }
        
        if (prompt.trim().length === 0) {
            return res.status(400).json({ error: 'Prompt cannot be empty' });
        }
        
        // Clean the prompt
        const cleanPrompt = prompt.trim();

        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        // Try multiple API endpoints/formats with correct endpoints
        const apiAttempts = [
            {
                name: 'Imagen 3.0 Generate (Current)',
                url: `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage?key=${apiKey}`,
                payload: {
                    prompt: cleanPrompt,
                    config: {
                        aspectRatio: "1:1",
                        negativePrompt: "blurry, low quality, distorted, text, watermark",
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
                name: 'Imagen 3.0 Alternative Format',
                url: `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
                payload: {
                    instances: [{ prompt: cleanPrompt }],
                    parameters: { 
                        sampleCount: 1,
                        aspectRatio: "1:1"
                    }
                },
                parseResponse: (result) => {
                    if (result.predictions?.[0]?.bytesBase64Encoded) {
                        return result.predictions[0].bytesBase64Encoded;
                    }
                    return null;
                }
            },
            {
                name: 'Imagen 2.0 Fallback',
                url: `https://generativelanguage.googleapis.com/v1beta/models/imagen-2.0-generate-001:generateImage?key=${apiKey}`,
                payload: {
                    prompt: cleanPrompt,
                    config: {
                        aspectRatio: "1:1",
                        negativePrompt: "blurry, low quality, distorted, text, watermark",
                        numberOfImages: 1
                    }
                },
                parseResponse: (result) => {
                    if (result.generatedImages?.[0]?.bytesBase64Encoded) {
                        return result.generatedImages[0].bytesBase64Encoded;
                    }
                    return null;
                }
            }
        ];

        let lastError;

        // Try each API format with improved error handling
        for (const attempt of apiAttempts) {
            try {
                console.log(`Trying ${attempt.name}...`);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
                
                const response = await fetch(attempt.url, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'User-Agent': 'WeedStickerGenerator/1.0'
                    },
                    body: JSON.stringify(attempt.payload),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                
                // Ensure we have a valid response object
                if (!response) {
                    throw new Error('No response received from API');
                }
                
                console.log(`Response status: ${response.status}`);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`${attempt.name} failed:`, errorText);
                    
                    // Handle specific error codes
                    if (response.status === 429) {
                        lastError = new Error(`Rate limit exceeded. Please try again later.`);
                    } else if (response.status === 403) {
                        lastError = new Error(`API access forbidden. Check your API key permissions.`);
                    } else if (response.status === 400) {
                        lastError = new Error(`Invalid request format for ${attempt.name}.`);
                    } else {
                        lastError = new Error(`${attempt.name}: ${response.status} - ${errorText}`);
                    }
                    continue;
                }

                const result = await response.json();
                console.log(`${attempt.name} result keys:`, Object.keys(result));
                
                const imageData = attempt.parseResponse(result);
                
                if (imageData) {
                    console.log(`Successfully generated image using ${attempt.name}`);
                    return res.status(200).json({
                        success: true,
                        image: imageData,
                        method: attempt.name
                    });
                } else {
                    console.error(`${attempt.name} - No image data found in response structure`);
                    lastError = new Error(`${attempt.name}: No image data in response`);
                }

            } catch (error) {
                console.error(`${attempt.name} error:`, error.message);
                
                if (error.name === 'AbortError') {
                    lastError = new Error(`${attempt.name}: Request timeout`);
                } else {
                    lastError = error;
                }
            }
        }

        // If all attempts failed, return a placeholder
        console.log('All API attempts failed, returning placeholder');
        
        // Create a simple colored square as fallback
        const canvas = createPlaceholderImage(cleanPrompt);
        
        return res.status(200).json({
            success: true,
            image: canvas,
            method: 'placeholder',
            note: 'API temporarily unavailable, showing placeholder',
            isPlaceholder: true
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
    // Create a simple SVG-based placeholder that shows it's a placeholder
    const svgContent = `
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="400" fill="#2a2c33"/>
            <circle cx="200" cy="150" r="50" fill="#4ade80" opacity="0.3"/>
            <text x="200" y="250" text-anchor="middle" fill="#4ade80" font-family="Arial" font-size="16" font-weight="bold">
                Weed Sticker
            </text>
            <text x="200" y="280" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="12">
                API Temporarily Unavailable
            </text>
            <text x="200" y="320" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="10">
                ${prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt}
            </text>
        </svg>
    `;
    
    // Convert SVG to base64
    return Buffer.from(svgContent).toString('base64');
}
