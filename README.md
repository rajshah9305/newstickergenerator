# 🌿 Weed Sticker Generator – Pink Kush Edition

**Never-repeating, AI-powered sticker generator with mesmerizing pink smoke effects**

## ✨ Features

🎨 **AI-Powered Generation** – Creates unique cannabis-themed stickers using advanced AI  
🔄 **Never Repeats** – Smart hash tracking ensures every sticker is completely unique  
💨 **Pink Kush Smoke** – Real-time GLSL shader creates mesmerizing rising pink smoke  
📱 **Fully Responsive** – Perfect experience from iPhone SE to 4K displays  
⚡ **Zero Config** – No API keys, no environment variables, no build steps  
🚀 **30-Second Deploy** – Fork, import to Vercel, and go live instantly

-----

## 🚀 Quick Start

### Deploy to Vercel (Recommended)

1. **Fork this repository** or click the deploy button above
1. **Import to Vercel** – connect your GitHub account
1. **Deploy** – Vercel handles everything automatically
1. **Done!** – Your sticker generator is live at `yourapp.vercel.app`

### Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/weed-sticker-generator.git
cd weed-sticker-generator

# Install Vercel CLI (if not already installed)
npm i -g vercel

# Start development server
vercel dev

# Open http://localhost:3000
```

-----

## 📁 Project Structure

```
weed-sticker-generator/
├── 📄 index.html              # Frontend with pink smoke effect
├── 🔧 api/generate-sticker.js # Serverless API endpoint
├── 📦 package.json           # ESM configuration
├── ⚙️  vercel.json            # Deployment configuration
└── 📖 README.md              # This file
```

**That’s it!** Just 4 files for a complete AI sticker generator.

-----

## 🎨 Customization

### Modify Sticker Prompts

Edit the `basePrompts` array in `index.html`:

```javascript
const basePrompts = [
  "glass jar full of frosty cannabis buds, sticker art, die-cut",
  "cartoon cannabis leaf with smiling face, sticker art",
  "psychedelic colorful cannabis plant, die-cut sticker",
  // Add your own prompts here
];
```

### Adjust Smoke Colors

Modify the pink color palette in the GLSL shader:

```glsl
vec3 color1 = vec3(1.0, 0.2, 0.8);   // Hot pink
vec3 color2 = vec3(0.9, 0.1, 0.7);   // Deep pink  
vec3 color3 = vec3(1.0, 0.4, 0.9);   // Light pink
```

### Change Image Quality

Update the `styleBoost` string for different aesthetics:

```javascript
const styleBoost = "high-quality sticker, crisp lines, vibrant colours, die-cut, white border, 2D flat illustration";
```

-----

## 🔥 Smoke Effect Credits

The stunning Pink Kush smoke effect is powered by advanced GLSL shaders:

- **Original Concept:** [PinkKush_SmokeEffect](https://github.com/rajshah9305/PinkKush_SmokeEffect) by RAJ
- **Three.js Integration:** Custom implementation with performance optimizations
- **Shader Mathematics:** Simplex noise with multi-octave turbulence
- **Visual Design:** Pink color palette with realistic smoke physics

-----

## 📜 License

```
MIT License

Copyright (c) 2025 Weed Sticker Generator

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
-----

<div align="center">

**Made with ❤️ and lots of ☁️ pink smoke**

[![Star this repo](https://img.shields.io/github/stars/yourusername/weed-sticker-generator?style=social)](https://github.com/yourusername/weed-sticker-generator/stargazers)
[![Follow on GitHub](https://img.shields.io/github/followers/yourusername?style=social)](https://github.com/yourusername)

[🌿 Generate Stickers](https://stickergenerator.vercel.app) • [🚀 Deploy Your Own](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/weed-sticker-generator) • [⭐ Star on GitHub](https://github.com/yourusername/weed-sticker-generator)

</div>
