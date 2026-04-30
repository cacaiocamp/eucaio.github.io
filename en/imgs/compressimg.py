# this may be usefull to compress images to a target size

import os
from PIL import Image

def compress_images(input_folder, output_folder, target_size_kb=6000, quality=80, maxwidth=1080):
    """Compresses images in a folder to reduce file size.

    Args:
        input_folder: Path to the input folder containing images.
        output_folder: Path to the output folder for compressed images.
        target_size_kb: Target size for the entire image set in kilobytes.
        quality: JPEG quality (0-95, higher is better quality, larger size).
    """

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    total_size_kb = 0
    images = [f for f in os.listdir(input_folder) if os.path.isfile(os.path.join(input_folder, f))] # list only files

    for filename in images:
        input_path = os.path.join(input_folder, filename)
        output_path = os.path.join(output_folder, filename)  # Keep the original filename
        try:
            img = Image.open(input_path)

            # Check if the image is a JPEG. If not, convert it to JPEG before compression.
            # Resize image if width is greater than 800px
            if img.width > maxwidth:
                aspect_ratio = img.height / img.width
                new_height = int(maxwidth * aspect_ratio)
                img = img.resize((maxwidth, new_height), Image.LANCZOS)

            if img.format != 'JPEG':
                output_path = os.path.splitext(output_path)[0] + ".jpg"  # force jpg extension
                img = img.convert("RGB")  # for png with alpha channel
                img.save(output_path, "JPEG", quality=quality, optimize=True)  # convert to jpg

            else:
                output_path = os.path.splitext(output_path)[0] + ".jpg" 
                img.save(output_path, "JPEG", quality=quality, optimize=True)

            file_size_kb = os.path.getsize(output_path) / 1024
            total_size_kb += file_size_kb
            print(f"Compressed {filename}: {file_size_kb:.2f} KB")

        except Exception as e:
            print(f"Error processing {filename}: {e}")

    print(f"Total compressed size: {total_size_kb:.2f} KB")

    # Adjust quality if needed to meet target size.
    if total_size_kb > target_size_kb:
        print("Total size exceeds target.  Consider lowering the quality or target size.")
        # Add logic here to further reduce if very important to meet the target.
        # This could be a loop to lower quality and recompress.
        # However, it's generally better to set a reasonable quality value initially.


# Example usage:
input_folder = "toCompress"  # Replace with your input folder
output_folder = "compressed"  # Replace with your desired output folder
target_size = 6000  # Target size in KB

compress_images(input_folder, output_folder, target_size)