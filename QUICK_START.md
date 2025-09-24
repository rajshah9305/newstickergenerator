# 🚀 Quick Start Guide

## 1-Minute Setup

### 1. Get Your API Key
Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and create a free API key.

### 2. Run Setup
```bash
chmod +x setup.sh
./setup.sh
```

### 3. Set API Key
```bash
export GEMINI_API_KEY='your_api_key_here'
```

### 4. Generate Your First Sticker
```bash
source venv/bin/activate
python3 weed_sticker_generator.py --style psychedelic
```

## Quick Examples

```bash
# Classic retro style
python3 weed_sticker_generator.py --style classic

# Custom design
python3 weed_sticker_generator.py --custom "a cannabis leaf superhero"

# With custom filename
python3 weed_sticker_generator.py --style neon --output my_sticker

# See all styles
python3 weed_sticker_generator.py --list-styles
```

## Troubleshooting

**API Key Error?**
```bash
echo $GEMINI_API_KEY  # Should show your key
```

**Missing Dependencies?**
```bash
./setup.sh  # Run setup again
```

**Need Help?**
```bash
python3 weed_sticker_generator.py --help
```

---
🌿 **Ready to create awesome weed stickers!** 🎨