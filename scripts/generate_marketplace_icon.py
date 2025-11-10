#!/usr/bin/env python3
"""
Generate marketplace icon (icon.png) from icon.svg.
This script converts the main icon SVG to a 128x128 PNG for VS Code marketplace.

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
        return True
    except ImportError:
        print("[FAIL] Missing required package: cairosvg")
        print("\nInstall with:")
        print("  pip install cairosvg pillow")
        return False

def generate_marketplace_icon():
    """Generate marketplace icon PNG from SVG."""
    
    # Get the project root (parent of scripts directory)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    svg_file = project_root / "assets" / "icons" / "icon.svg"
    output_file = project_root / "assets" / "icons" / "icon.png"
    
    # Check if SVG exists
    if not svg_file.exists():
        print(f"[FAIL] SVG file not found: {svg_file}")
        return False
    
    # Import here after we know they're installed
    import cairosvg
    
    try:
        print(f"Generating marketplace icon from {svg_file.name}...")
        print(f"Output: {output_file.name} (128x128)")
        
        # Convert SVG to PNG using cairosvg
        cairosvg.svg2png(
            url=str(svg_file),
            write_to=str(output_file),
            output_width=128,
            output_height=128
        )
        
        # Verify file was created
        if output_file.exists():
            file_size_kb = output_file.stat().st_size / 1024
            print(f"[OK] Created: {output_file.name} ({file_size_kb:.2f} KB)")
            return True
        else:
            print(f"[FAIL] Failed to create {output_file.name}")
            return False
            
    except Exception as e:
        print(f"[FAIL] Error generating icon: {e}")
        return False

def main():
    """Main entry point."""
    print("=" * 60)
    print("Marketplace Icon Generator")
    print("=" * 60)
    print()
    
    # Check dependencies
    if not check_dependencies():
        print()
        print("Error: Required packages not installed")
        sys.exit(1)
    
    print()
    
    # Generate icon
    if generate_marketplace_icon():
        print()
        print("[SUCCESS] Marketplace icon generated successfully!")
        sys.exit(0)
    else:
        print()
        print("[FAIL] Failed to generate marketplace icon")
        sys.exit(1)

if __name__ == "__main__":
    main()

