import os
from PIL import Image, ImageDraw, ImageFont

def generate_qr_letter_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    bg_color = (79, 70, 229, 255) # Indigo #4f46e5
    fg_color = (255, 255, 255, 255)

    corner_radius = int(size * 0.22)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=corner_radius, fill=bg_color)

    font_size = int(size * 0.52)
    font = None
    
    font_paths = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/SFNS.ttf",
        "/Library/Fonts/Arial.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                font = ImageFont.truetype(p, font_size)
                break
            except Exception:
                pass

    if not font:
        font = ImageFont.load_default()

    text = "QR"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = (size - text_width) / 2.0 - bbox[0]
    y = (size - text_height) / 2.0 - bbox[1]

    draw.text((x, y), text, fill=fg_color, font=font)
    return img

svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="7" fill="#4f46e5"/>
  <text x="16" y="21.5" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="16" letter-spacing="-0.5">QR</text>
</svg>'''

os.makedirs('public', exist_ok=True)
os.makedirs('src/app', exist_ok=True)

# 1. Save SVG files
with open('src/app/icon.svg', 'w') as f:
    f.write(svg_content)

with open('public/favicon.svg', 'w') as f:
    f.write(svg_content)

with open('public/icon.svg', 'w') as f:
    f.write(svg_content)

# 2. Generate PNG sizes
img16 = generate_qr_letter_icon(16)
img32 = generate_qr_letter_icon(32)
img180 = generate_qr_letter_icon(180)
img192 = generate_qr_letter_icon(192)
img512 = generate_qr_letter_icon(512)

img16.save('public/favicon-16x16.png')
img32.save('public/favicon-32x32.png')
img180.save('public/apple-touch-icon.png')
img192.save('public/icon-192.png')
img512.save('public/icon-512.png')

# 3. Save multi-size favicon.ico
img32.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
img32.save('src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])

print("Successfully generated simple 'QR' letter favicons!")
