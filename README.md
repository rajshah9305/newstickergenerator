***Weed Sticker Generator***

This is a simple, single-page web application that generates unique "weed sticker" style images using the Google Gemini API. Each time the page is refreshed, a new sticker is created based on a random prompt.

Features:
- AI Image Generation: Utilizes the imagen-3.0-generate-002 model from the Gemini API to create high-quality images.

- Random Prompts: A curated list of creative prompts ensures a wide variety of sticker designs.

- Sleek UI: The user interface is a clean, dark-themed clone of the provided design spec.

- Loading State: Displays a "Generating..." message and the prompt being used while the API call is in progress.

- Responsive Design: The layout is mobile-friendly and works on all screen sizes.

- Error Handling: Includes retry logic (exponential backoff) for API calls to handle potential network issues or rate limiting.
