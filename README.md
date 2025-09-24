***Weed Sticker Generator***

This is a simple, single-page web application that generates unique "weed sticker" style images using the Google Gemini API. Each time the page is refreshed, a new sticker is created based on a random prompt.

## Features:
- **AI Image Generation**: Utilizes multiple Imagen models (3.0 and 2.0) from the Gemini API to create high-quality images with automatic fallback between endpoints.

- **Random Prompts**: A curated list of creative prompts ensures a wide variety of sticker designs.

- **Sleek UI**: The user interface is a clean, dark-themed design that's fully responsive.

- **Loading State**: Displays a "Generating..." message and the prompt being used while the API call is in progress.

- **Responsive Design**: The layout is mobile-friendly and works on all screen sizes.

- **Robust Error Handling**: 
  - Multiple API endpoint fallbacks
  - Exponential backoff retry logic
  - Request timeouts and rate limiting protection
  - Graceful fallback to SVG placeholder when APIs are unavailable

- **Security**: Backend API handles all external requests with proper validation and sanitization.

## Setup:
1. Copy `.env.example` to `.env`
2. Add your Google Gemini API key to the `GEMINI_API_KEY` variable
3. Deploy to Vercel or run locally

## Architecture:
- **Frontend**: Single HTML page with vanilla JavaScript
- **Backend**: Vercel serverless function (`/api/generate-sticker.js`)
- **API**: Google Gemini Imagen models for image generation
