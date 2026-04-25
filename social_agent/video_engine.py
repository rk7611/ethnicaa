from moviepy.config import change_settings
change_settings({"IMAGEMAGICK_BINARY": r"C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe"})

import os
import requests
from PIL import Image, ImageOps, ImageFilter
from moviepy.editor import ImageClip, concatenate_videoclips, TextClip, CompositeVideoClip, AudioFileClip
from config import TEMP_DIR, OUTPUT_DIR, HOOKS
import random

def download_image(url, filename):
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            path = os.path.join(TEMP_DIR, filename)
            with open(path, 'wb') as f:
                for chunk in response:
                    f.write(chunk)
            return path
    except Exception as e:
        print(f"FAILED: Download failed: {e}")
    return None

def process_image_for_vertical(img_path):
    """Resizes image to 1080x1920 with a blurred background for a premium look."""
    img = Image.open(img_path)
    
    # 1. Create blurred background
    bg = img.copy().resize((1080, 1920))
    bg = bg.filter(ImageFilter.GaussianBlur(radius=30))
    
    # 2. Resize foreground to fit width
    fg_width = 1080
    w_percent = (fg_width / float(img.size[0]))
    h_size = int((float(img.size[1]) * float(w_percent)))
    fg = img.resize((fg_width, h_size), Image.Resampling.LANCZOS)
    
    # 3. Paste foreground on background
    bg.paste(fg, (0, (1920 - h_size) // 2))
    
    output_path = img_path.replace(".jpg", "_vertical.webp").replace(".png", "_vertical.webp")
    bg.save(output_path, "WEBP", quality=90)
    return output_path

def create_reel(product_data, output_name="latest_reel.mp4"):
    print(f"START: Generating Reel for: {product_data['name']}")
    
    image_urls = product_data.get("images", [])[:5] # Use first 5 images
    clips = []
    
    for i, url in enumerate(image_urls):
        local_path = download_image(url, f"img_{i}.jpg")
        if local_path:
            processed_path = process_image_for_vertical(local_path)
            # 2.5 seconds per image for energy
            clip = ImageClip(processed_path).set_duration(2.5) 
            
            # 🔥 KEN BURNS ZOOM EFFECT
            clip = clip.resize(lambda t: 1 + 0.04*t) 
            
            clips.append(clip.crossfadein(0.3))
            
    if not clips:
        return None

    # Combine images
    video = concatenate_videoclips(clips, method="compose")
    
    # Add Hook Text
    hook = random.choice(HOOKS)
    txt_hook = TextClip(
        hook, 
        fontsize=50, 
        color='white', 
        font='Arial-Bold', 
        method='caption', 
        size=(900, None)
    ).set_position(('center', 200)).set_duration(video.duration)
    
    # Add Price Tag (Gold Background)
    price_text = f"Wholesale: Rs. {product_data['price']}/- pc"
    txt_price = TextClip(
        price_text, 
        fontsize=45, 
        color='black', 
        bg_color='#FFD700', 
        font='Arial-Bold'
    ).set_position(('center', 1400)).set_duration(video.duration)

    # 📱 WHATSAPP WATERMARK (Green Badge)
    wa_text = "📲 Order on WhatsApp: +91 9586346332"
    txt_wa = TextClip(
        wa_text, 
        fontsize=35, 
        color='white', 
        bg_color='#25D366', 
        font='Arial-Bold'
    ).set_position(('center', 1700)).set_duration(video.duration)

    # Final Composite
    final_video = CompositeVideoClip([video, txt_hook, txt_price, txt_wa])
    
    output_path = os.path.join(OUTPUT_DIR, output_name)
    final_video.write_videofile(output_path, fps=24, codec='libx264', preset='ultrafast')
    
    return output_path

if __name__ == "__main__":
    # Test Data
    test_p = {
        "name": "Luxury Silk Saree",
        "price": 1250,
        "images": ["https://ethnicaa.com/logo.png"] # Fallback test
    }
    create_reel(test_p, "test_reel.mp4")
