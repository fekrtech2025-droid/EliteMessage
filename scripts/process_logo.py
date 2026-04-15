from PIL import Image
import os

def process_logo(input_path, output_path):
    print(f"Processing {input_path}...")
    img = Image.open(input_path).convert("RGBA")
    
    # Get the bounding box of the non-transparent area
    bbox = img.getbbox()
    if not bbox:
        print(f"No content found in {input_path}")
        return
    
    # The logo consists of the icon (crown + speech bubble) and the text below.
    # We want to remove the text.
    # Looking at the image, the text is at the bottom.
    # Let's crop only the top part which contains the icon.
    
    # First, crop to the content
    content_img = img.crop(bbox)
    
    # Now we need to find where the icon ends and the text starts.
    # We can do this by looking for a horizontal gap or by estimating the height.
    # In the original image, the icon is roughly the top 60-70% of the content.
    
    width, height = content_img.size
    
    # Find the horizontal line that separates the icon and the text.
    # We'll scan from bottom to top to find the first non-empty row that belongs to the icon.
    # Or scan from top to bottom to find the gap.
    
    found_gap = False
    gap_y = height
    
    # Scan for a transparent or nearly transparent horizontal line
    for y in range(int(height * 0.5), height):
        is_empty = True
        for x in range(width):
            if content_img.getpixel((x, y))[3] > 10: # Threshold for alpha
                is_empty = False
                break
        if is_empty:
            gap_y = y
            found_gap = True
            break
            
    # If no gap found, we'll just take the top 65% as an estimate for the icon
    if not found_gap:
        gap_y = int(height * 0.65)
        
    icon_img = content_img.crop((0, 0, width, gap_y))
    
    # Trim any remaining padding from the icon itself
    icon_bbox = icon_img.getbbox()
    if icon_bbox:
        icon_img = icon_img.crop(icon_bbox)
    
    # Save the result
    icon_img.save(output_path)
    print(f"Saved icon to {output_path}")

base_dir = "/mnt/desktop/EliteMessage/apps/customer-web/public/images"
process_logo(os.path.join(base_dir, "elite-message-signin-logo.png"), os.path.join(base_dir, "elite-message-icon-only.png"))
process_logo(os.path.join(base_dir, "elite-message-signin-logo-dark-final.png"), os.path.join(base_dir, "elite-message-icon-only-dark.png"))
