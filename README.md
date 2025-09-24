# Weed Sticker Generator

An AI-powered sticker generator that creates unique cannabis-themed stickers using Google's Gemini API.

## Features

- Generate unique AI-powered weed sticker designs
- Multiple fallback API endpoints for reliability
- Responsive web interface
- Automatic retry logic with exponential backoff
- Placeholder images when API is unavailable

## Setup

### 1. Environment Variables

You need to set up the `GEMINI_API_KEY` environment variable in your Vercel deployment:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add a new variable:
   - Name: `GEMINI_API_KEY`
   - Value: Your Google Gemini API key
   - Environment: Production (and Preview if needed)

### 2. Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your Vercel environment variables

### 3. Deploy to Vercel

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Deploy
vercel

# Or deploy with production flag
vercel --prod
```

## Project Structure

```
├── api/
│   └── generate-sticker.js    # Serverless API function
├── index.html                 # Frontend application
├── package.json              # Project configuration
├── vercel.json              # Vercel deployment config
└── README.md                # This file
```

## API Endpoints

### POST /api/generate-sticker

Generates a sticker image based on a text prompt.

**Request Body:**
```json
{
  "prompt": "A beautiful cannabis leaf sticker design"
}
```

**Response:**
```json
{
  "success": true,
  "image": "base64-encoded-image-data",
  "method": "Imagen 3.0 Generate (Current)"
}
```

## Troubleshooting

### Common Issues

1. **HTTP 500 Error**: Usually means the `GEMINI_API_KEY` environment variable is not set
2. **Build Warnings**: The package.json now includes proper ESM configuration
3. **API Timeouts**: The function has a 30-second timeout and retry logic

### Debugging

Check the Vercel function logs in your dashboard to see detailed error messages and API responses.

## Architecture

- **Frontend**: Single HTML page with vanilla JavaScript
- **Backend**: Vercel serverless function (`/api/generate-sticker.js`)
- **API**: Google Gemini Imagen models for image generation

## License

MIT
