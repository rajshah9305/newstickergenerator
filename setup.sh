#!/bin/bash

# Weed Sticker Generator Setup Script
echo "🌿 Setting up Weed Sticker Generator..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7+ first."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "⬇️  Installing dependencies..."
pip install -r requirements.txt

# Make the script executable
chmod +x weed_sticker_generator.py

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To get started:"
echo "1. Set your API key: export GEMINI_API_KEY='your_api_key_here'"
echo "2. Activate the environment: source venv/bin/activate"
echo "3. Generate a sticker: python3 weed_sticker_generator.py --style classic"
echo ""
echo "🔗 Get your API key from: https://aistudio.google.com/app/apikey"
echo "📖 For more options: python3 weed_sticker_generator.py --help"