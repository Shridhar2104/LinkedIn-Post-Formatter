# Icons Directory

This directory should contain the extension icons in the following sizes:

- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

## How to Generate Icons

### Option 1: Use the Icon Generator (Recommended)

1. Open `../../scripts/generate-icons.html` in your browser
2. Click "Download" for each icon size
3. Save the downloaded files to this directory

### Option 2: Design Your Own

Use Figma, Photoshop, or any design tool to create icons following the design in `icon.svg`.

**Design Guidelines:**
- Background: LinkedIn blue (#0A66C2)
- Sparkles accent: Gold (#FFD93D)
- Rounded corners: 24px radius (for 128x128)
- Simple and recognizable at small sizes

### Option 3: Hire a Designer

For production-quality icons:
- Fiverr: $5-20
- Upwork: $20-50
- 99designs: Contest starting at $299

## Quick Placeholder (Testing Only)

For quick testing, you can use ImageMagick to create simple colored squares:

```bash
# If you have ImageMagick installed
convert -size 16x16 xc:#0A66C2 icon16.png
convert -size 48x48 xc:#0A66C2 icon48.png
convert -size 128x128 xc:#0A66C2 icon128.png
```

Or just use any PNG images and rename them to the required filenames.

---

**Note:** Don't commit the actual PNG files to the repository (they're in .gitignore). Each developer should generate their own locally.
