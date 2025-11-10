#!/usr/bin/env python3
"""
Generate tab icons from SVG for VS Code custom editor.
This script converts icon-small-no-bg.svg to PNG files in various sizes.

Requirements:
    pip install cairosvg pillow
"""

import os
import sys
from pathlib import Path

def check_dependencies():
    """Check if required packages are installed."""
    try:
        import cairosvg
        import PIL
        return True
    except ImportError as e:
        print("[FAIL] Missing required package:", e)
        print("\nInstall with:")
        print("  pip install cairosvg pillow")
        return False

def generate_icons():
    """Generate PNG icons from SVG."""
    
    # Get the project root (parent of scripts directory)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    svg_file = project_root / "assets" / "icons" / "icon-small-no-bg.svg"
    media_dir = project_root / "assets" / "media"
    
    # Check if SVG exists
    if not svg_file.exists():
        print(f"[FAIL] SVG file not found: {svg_file}")
        return False
    
    # Create media directory
    media_dir.mkdir(exist_ok=True)
    print(f"[OK] Media directory ready: {media_dir}")
    
    # Import here after we know they're installed
    import cairosvg
    from PIL import Image
    from io import BytesIO
    
    sizes = [16, 24, 32]
    errors = False
    
    for size in sizes:
        output_file = media_dir / f"icon-tab-{size}.png"
        
        try:
            print(f"Generating {output_file.name} ({size}x{size})...")
            
            # Convert SVG to PNG using cairosvg
            png_data = BytesIO()
            cairosvg.svg2png(
                url=str(svg_file),
                write_to=png_data,
                output_width=size,
                output_height=size
            )
            
            # Write to file
            png_data.seek(0)
            with open(output_file, 'wb') as f:
                f.write(png_data.read())
            
            # Verify file was created
            if output_file.exists():
                file_size_kb = output_file.stat().st_size / 1024
                print(f"  [OK] Created: {output_file.name} ({file_size_kb:.2f} KB)")
            else:
                print(f"  [FAIL] Failed to create {output_file.name}")
                errors = True
                
        except Exception as e:
            print(f"  [FAIL] Error generating {output_file.name}: {e}")
            errors = True
    
    return not errors

def main():
    """Main entry point."""
    print("=" * 60)
    print("VS Code Tab Icon Generator")
    print("=" * 60)
    print()
    
    # Check dependencies
    if not check_dependencies():
        print()
        print("Error: Required packages not installed")
        sys.exit(1)
    
    print()
    
    # Generate icons
    if generate_icons():
        print()
        print("[SUCCESS] All tab icons generated successfully!")
        print("[INFO] package.json has been updated to use these icons")
        print()
        print("Next steps:")
        print("  1. npm run compile")
        print("  2. npm run package")
        sys.exit(0)
    else:
        print()
        print("[FAIL] Some icons failed to generate")
        sys.exit(1)

if __name__ == "__main__":
    main()

