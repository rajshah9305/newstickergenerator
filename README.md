# 🌿 Weed Sticker Generator

A Python script that generates creative cannabis-themed stickers using Google's Gemini AI API. Create various styles of weed stickers from vintage to psychedelic to minimalist designs.

## 🚀 Features

- **8 Pre-designed Styles**: Classic, Minimalist, Psychedelic, Street Art, Botanical, Neon, Cartoon, and Mandala
- **Custom Prompts**: Create your own unique designs with custom text prompts
- **High-Quality Output**: Generates sticker-ready images with proper formatting
- **Easy CLI Interface**: Simple command-line interface with helpful options
- **Error Handling**: Robust error handling and user-friendly messages

## 📋 Prerequisites

1. **Python 3.7+** installed on your system
2. **Google Gemini API Key** - Get yours from [Google AI Studio](https://aistudio.google.com/app/apikey)

## 🛠️ Installation

1. **Clone or download** this repository
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Set up your API key**:
   ```bash
   export GEMINI_API_KEY='your_api_key_here'
   ```

## 🎨 Available Styles

| Style | Description |
|-------|-------------|
| `classic` | Vintage 70s style with retro typography |
| `minimalist` | Clean, modern geometric design |
| `psychedelic` | Trippy 60s-inspired rainbow design |
| `street_art` | Graffiti-inspired urban style |
| `botanical` | Scientific illustration style |
| `neon` | Cyberpunk with glowing neon colors |
| `cartoon` | Fun, friendly character design |
| `mandala` | Spiritual geometric patterns |

## 🖥️ Usage

### Basic Usage
```bash
# Generate a classic style sticker
python weed_sticker_generator.py

# Generate a specific style
python weed_sticker_generator.py --style psychedelic

# List all available styles
python weed_sticker_generator.py --list-styles
```

### Advanced Usage
```bash
# Custom prompt
python weed_sticker_generator.py --custom "a cute cannabis leaf wearing sunglasses riding a skateboard"

# Custom output filename
python weed_sticker_generator.py --style neon --output my_awesome_sticker

# Combine custom prompt with custom filename
python weed_sticker_generator.py --custom "minimalist cannabis leaf mandala" --output zen_leaf
```

### Command Line Options

- `--style, -s`: Choose from predefined styles (default: classic)
- `--custom, -c`: Use a custom text prompt for unique designs
- `--output, -o`: Specify output filename (without extension)
- `--list-styles`: Show all available styles
- `--help`: Show help message with examples

## 📁 Output

Generated stickers are saved as PNG files in the current directory with descriptive filenames:
- Format: `weed_sticker_{style}_{timestamp}_{index}.png`
- Custom names: `{your_custom_name}.png`

## 🔧 Troubleshooting

### API Key Issues
```bash
# Make sure your API key is set correctly
echo $GEMINI_API_KEY

# If empty, set it again
export GEMINI_API_KEY='your_api_key_here'
```

### Installation Issues
```bash
# Update pip first
pip install --upgrade pip

# Install dependencies with verbose output
pip install -v google-genai
```

### Generation Issues
- Ensure you have a stable internet connection
- Check that your API key has sufficient quota
- Try a different style or simpler custom prompt

## 🎯 Examples

### Generate Different Styles
```bash
# Vintage vibes
python weed_sticker_generator.py --style classic

# Modern and clean
python weed_sticker_generator.py --style minimalist

# Trippy and colorful
python weed_sticker_generator.py --style psychedelic

# Street art style
python weed_sticker_generator.py --style street_art
```

### Custom Creative Prompts
```bash
# Cute character design
python weed_sticker_generator.py --custom "friendly cannabis leaf character with a big smile and peace sign"

# Abstract art
python weed_sticker_generator.py --custom "abstract geometric cannabis leaf with rainbow gradients"

# Retro gaming style
python weed_sticker_generator.py --custom "8-bit pixel art cannabis leaf from a retro video game"
```

## 📜 License

This project is for educational and creative purposes. Please ensure compliance with local laws regarding cannabis imagery and usage.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve this tool!

## ⚠️ Disclaimer

This tool is for creating artistic sticker designs only. Please use responsibly and in accordance with your local laws and regulations.