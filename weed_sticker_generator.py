#!/usr/bin/env python3
"""
Weed Sticker Generator using Google Gemini API
Generates creative cannabis-themed stickers with various styles and themes.
"""

import base64
import mimetypes
import os
import sys
import argparse
from datetime import datetime
from google import genai
from google.genai import types


def save_binary_file(file_name, data):
    """Save binary data to a file."""
    try:
        with open(file_name, "wb") as f:
            f.write(data)
        print(f"✅ Sticker saved to: {file_name}")
        return True
    except Exception as e:
        print(f"❌ Error saving file {file_name}: {str(e)}")
        return False


def generate_weed_sticker(prompt_style="classic", custom_prompt="", output_name=""):
    """Generate a weed sticker using Gemini API."""
    
    # Check for API key
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("❌ Error: GEMINI_API_KEY environment variable not set!")
        print("Please set your API key: export GEMINI_API_KEY='your_api_key_here'")
        return False

    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"❌ Error initializing Gemini client: {str(e)}")
        return False

    # Define sticker prompts based on style
    sticker_prompts = {
        "classic": "Create a vintage-style cannabis leaf sticker design with bold green colors, retro typography, and a classic 70s aesthetic. The design should be suitable for a circular sticker with clean lines and high contrast.",
        
        "minimalist": "Design a clean, minimalist cannabis leaf sticker with simple geometric lines, monochromatic color scheme, and modern typography. The design should be elegant and understated.",
        
        "psychedelic": "Create a trippy, psychedelic cannabis-themed sticker with vibrant rainbow colors, swirling patterns, tie-dye effects, and groovy 60s-inspired design elements.",
        
        "street_art": "Design a street art style cannabis sticker with graffiti-inspired elements, urban colors, bold outlines, and edgy typography that would fit well on skateboards or laptops.",
        
        "botanical": "Create a scientific botanical illustration style cannabis sticker with detailed leaf structures, natural green tones, and educational labeling in a vintage botanical print style.",
        
        "neon": "Design a cyberpunk/neon style cannabis sticker with glowing neon colors, electronic circuit patterns, futuristic typography, and a dark background with bright highlights.",
        
        "cartoon": "Create a fun, cartoon-style cannabis character sticker with friendly anthropomorphic features, bright colors, and a playful, family-friendly design.",
        
        "mandala": "Design a spiritual mandala-style sticker incorporating cannabis leaf patterns into intricate geometric mandala designs with sacred geometry and peaceful colors."
    }

    # Use custom prompt if provided, otherwise use predefined style
    if custom_prompt:
        full_prompt = f"Create a sticker design: {custom_prompt}. The design should be suitable for printing as a sticker with clear borders and vibrant colors."
    else:
        if prompt_style not in sticker_prompts:
            print(f"❌ Unknown style '{prompt_style}'. Available styles: {', '.join(sticker_prompts.keys())}")
            return False
        full_prompt = sticker_prompts[prompt_style]

    print(f"🎨 Generating {prompt_style} weed sticker...")
    print(f"📝 Prompt: {full_prompt[:100]}{'...' if len(full_prompt) > 100 else ''}")

    model = "gemini-2.5-flash-image-preview"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=full_prompt),
            ],
        ),
    ]
    
    generate_content_config = types.GenerateContentConfig(
        response_modalities=[
            "IMAGE",
            "TEXT",
        ],
    )

    try:
        file_index = 0
        image_saved = False
        
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            if (
                chunk.candidates is None
                or chunk.candidates[0].content is None
                or chunk.candidates[0].content.parts is None
            ):
                continue
                
            for part in chunk.candidates[0].content.parts:
                if part.inline_data and part.inline_data.data:
                    # Generate filename
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    if output_name:
                        base_name = output_name
                    else:
                        base_name = f"weed_sticker_{prompt_style}_{timestamp}_{file_index}"
                    
                    file_index += 1
                    inline_data = part.inline_data
                    data_buffer = inline_data.data
                    file_extension = mimetypes.guess_extension(inline_data.mime_type) or ".png"
                    filename = f"{base_name}{file_extension}"
                    
                    if save_binary_file(filename, data_buffer):
                        image_saved = True
                elif part.text:
                    print(f"💬 AI Response: {part.text}")
        
        if not image_saved:
            print("❌ No image was generated. Please try again with a different prompt.")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ Error generating sticker: {str(e)}")
        return False


def main():
    """Main function with command line interface."""
    parser = argparse.ArgumentParser(
        description="Generate cannabis-themed stickers using Google Gemini AI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python weed_sticker_generator.py --style classic
  python weed_sticker_generator.py --style psychedelic --output my_sticker
  python weed_sticker_generator.py --custom "a cute cannabis leaf wearing sunglasses"
  python weed_sticker_generator.py --list-styles

Available Styles:
  classic      - Vintage 70s style with retro typography
  minimalist   - Clean, modern geometric design
  psychedelic  - Trippy 60s-inspired rainbow design
  street_art   - Graffiti-inspired urban style
  botanical    - Scientific illustration style
  neon         - Cyberpunk with glowing neon colors
  cartoon      - Fun, friendly character design
  mandala      - Spiritual geometric patterns
        """
    )
    
    parser.add_argument(
        "--style", "-s",
        choices=["classic", "minimalist", "psychedelic", "street_art", "botanical", "neon", "cartoon", "mandala"],
        default="classic",
        help="Style of the weed sticker to generate (default: classic)"
    )
    
    parser.add_argument(
        "--custom", "-c",
        type=str,
        help="Custom prompt for generating a unique sticker design"
    )
    
    parser.add_argument(
        "--output", "-o",
        type=str,
        help="Custom output filename (without extension)"
    )
    
    parser.add_argument(
        "--list-styles",
        action="store_true",
        help="List all available styles and exit"
    )

    args = parser.parse_args()

    if args.list_styles:
        print("Available sticker styles:")
        styles = ["classic", "minimalist", "psychedelic", "street_art", "botanical", "neon", "cartoon", "mandala"]
        for style in styles:
            print(f"  • {style}")
        return

    print("🌿 Weed Sticker Generator 🌿")
    print("=" * 40)
    
    # Check if API key is set
    if not os.environ.get("GEMINI_API_KEY"):
        print("❌ Error: GEMINI_API_KEY environment variable not set!")
        print("\nTo set up your API key:")
        print("1. Get your API key from https://aistudio.google.com/app/apikey")
        print("2. Set the environment variable:")
        print("   export GEMINI_API_KEY='your_api_key_here'")
        print("3. Run the script again")
        sys.exit(1)

    success = generate_weed_sticker(
        prompt_style=args.style,
        custom_prompt=args.custom,
        output_name=args.output
    )
    
    if success:
        print("\n✅ Sticker generation completed successfully!")
        print("🎉 Your awesome weed sticker is ready!")
    else:
        print("\n❌ Sticker generation failed. Please check your API key and try again.")
        sys.exit(1)


if __name__ == "__main__":
    main()