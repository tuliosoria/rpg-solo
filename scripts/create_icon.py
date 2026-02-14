#!/usr/bin/env python3
"""
Create game icon for Varginha: Terminal 1996
Theme: Retro terminal (green phosphor CRT), 1996 Brazilian UFO conspiracy, horror/suspense
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

# Icon dimensions
SIZE = 1024
CENTER = SIZE // 2

# Colors - terminal green phosphor palette
TERMINAL_GREEN = (51, 255, 51)  # #33ff33 - classic green phosphor
DARK_GREEN = (0, 40, 0)  # Dark background
GLOW_GREEN = (100, 255, 100, 180)  # For glow effects
BLACK = (0, 0, 0)
SCANLINE_DARK = (0, 20, 0, 100)

def create_base_image():
    """Create base dark background with subtle gradient"""
    img = Image.new('RGBA', (SIZE, SIZE), BLACK)
    draw = ImageDraw.Draw(img)
    
    # Radial gradient from center (subtle green glow)
    for i in range(SIZE // 2, 0, -2):
        intensity = int(30 * (1 - i / (SIZE / 2)))
        color = (0, intensity, 0)
        draw.ellipse([CENTER - i, CENTER - i, CENTER + i, CENTER + i], fill=color)
    
    return img

def draw_alien_head(draw, cx, cy, scale=1.0):
    """Draw classic grey alien head silhouette"""
    # Classic alien head shape - large head, small chin, big eyes
    head_width = int(280 * scale)
    head_height = int(380 * scale)
    
    # Head outline (oval, wider at top)
    points = []
    for angle in range(360):
        rad = math.radians(angle)
        # Make top wider than bottom
        width_factor = 1.0 - 0.3 * math.sin(rad) if angle < 180 else 1.0 - 0.5 * math.sin(rad)
        x = cx + int(head_width/2 * math.cos(rad) * width_factor)
        y = cy + int(head_height/2 * math.sin(rad))
        points.append((x, y))
    
    draw.polygon(points, fill=TERMINAL_GREEN)
    
    # Eyes - large, almond shaped, dark
    eye_y = cy - int(50 * scale)
    eye_width = int(90 * scale)
    eye_height = int(50 * scale)
    eye_spacing = int(80 * scale)
    
    # Left eye
    draw.ellipse([
        cx - eye_spacing - eye_width//2,
        eye_y - eye_height//2,
        cx - eye_spacing + eye_width//2,
        eye_y + eye_height//2
    ], fill=BLACK)
    
    # Right eye
    draw.ellipse([
        cx + eye_spacing - eye_width//2,
        eye_y - eye_height//2,
        cx + eye_spacing + eye_width//2,
        eye_y + eye_height//2
    ], fill=BLACK)

def add_scanlines(img):
    """Add CRT scanline effect"""
    overlay = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Horizontal scanlines
    for y in range(0, SIZE, 4):
        draw.line([(0, y), (SIZE, y)], fill=(0, 0, 0, 60), width=2)
    
    return Image.alpha_composite(img, overlay)

def add_crt_curve_effect(img):
    """Add subtle CRT screen curvature vignette"""
    overlay = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Vignette - darker corners
    for i in range(100):
        alpha = int(150 * (i / 100))
        offset = SIZE // 2 + i * 3
        # Draw corner shadows
        draw.rectangle([0, 0, 100-i, SIZE], fill=(0, 0, 0, alpha // 2))
        draw.rectangle([SIZE-(100-i), 0, SIZE, SIZE], fill=(0, 0, 0, alpha // 2))
        draw.rectangle([0, 0, SIZE, 100-i], fill=(0, 0, 0, alpha // 2))
        draw.rectangle([0, SIZE-(100-i), SIZE, SIZE], fill=(0, 0, 0, alpha // 2))
    
    return Image.alpha_composite(img, overlay)

def add_text_overlay(img):
    """Add CLASSIFIED stamp and terminal text"""
    draw = ImageDraw.Draw(img)
    
    # Try to use a monospace font, fallback to default
    try:
        # Try system fonts
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf", 80)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 40)
        font_tiny = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 28)
    except:
        try:
            font_large = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf", 80)
            font_small = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf", 40)
            font_tiny = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf", 28)
        except:
            font_large = ImageFont.load_default()
            font_small = ImageFont.load_default()
            font_tiny = ImageFont.load_default()
    
    # Top terminal header
    draw.text((50, 30), "TERMINAL://1996", fill=TERMINAL_GREEN, font=font_small)
    draw.text((50, 75), "VARGINHA INCIDENT", fill=TERMINAL_GREEN, font=font_tiny)
    
    # CLASSIFIED stamp at bottom (rotated slightly)
    classified_img = Image.new('RGBA', (600, 120), (0, 0, 0, 0))
    classified_draw = ImageDraw.Draw(classified_img)
    
    # Red-ish classified stamp (but in terminal green for theme consistency)
    classified_draw.rectangle([10, 10, 590, 110], outline=TERMINAL_GREEN, width=4)
    classified_draw.text((30, 25), "CLASSIFICADO", fill=TERMINAL_GREEN, font=font_large)
    
    # Rotate slightly for stamp effect
    classified_img = classified_img.rotate(-8, expand=True, fillcolor=(0, 0, 0, 0))
    
    # Paste at bottom
    img.paste(classified_img, (180, 820), classified_img)
    
    # Bottom terminal prompt
    draw.text((50, 970), "> _", fill=TERMINAL_GREEN, font=font_small)
    
    return img

def add_glow_effect(img):
    """Add phosphor glow effect to green elements"""
    # Create a copy and blur it for glow
    glow = img.copy()
    glow = glow.filter(ImageFilter.GaussianBlur(radius=8))
    
    # Blend original with glow
    return Image.blend(img, glow, alpha=0.3)

def main():
    print("Creating Varginha: Terminal 1996 game icon...")
    
    # Create base
    img = create_base_image()
    img = img.convert('RGBA')
    draw = ImageDraw.Draw(img)
    
    # Draw alien head in center (slightly up to make room for CLASSIFIED)
    draw_alien_head(draw, CENTER, CENTER - 80, scale=0.85)
    
    # Add effects
    img = add_glow_effect(img)
    img = add_scanlines(img)
    img = add_crt_curve_effect(img)
    img = add_text_overlay(img)
    
    # Final adjustments - add slight green tint to everything
    # and ensure we have good contrast
    
    # Save
    output_dir = '/home/arthur/rpg-solo/build'
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'icon-source.png')
    
    img = img.convert('RGBA')
    img.save(output_path, 'PNG')
    print(f"Icon saved to: {output_path}")
    print(f"Size: {img.size}")
    
    return output_path

if __name__ == '__main__':
    main()
