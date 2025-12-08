# Setup Guide

## Quick Start

Follow these steps to get the extension running locally:

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Icons

Since we can't include binary files in the repository, you need to generate the icons:

**Option A: Use the Icon Generator (Recommended)**

1. Open `scripts/generate-icons.html` in your browser
2. Click "Download" for each icon size (16x16, 48x48, 128x128)
3. Save the downloaded files to `public/icons/` as:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

**Option B: Create Your Own Icons**

Use any design tool (Figma, Photoshop, etc.) to create icons at:
- 16x16 pixels
- 48x48 pixels
- 128x128 pixels

Save them to `public/icons/`

**Option C: Quick Placeholder (For Testing)**

You can temporarily use any PNG images renamed to the required filenames.

### 3. Build the Extension

```bash
npm run build
```

This will create a `dist/` folder with your extension.

### 4. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `dist/` folder
5. The extension icon should appear in your toolbar!

### 5. Test on LinkedIn

1. Go to [linkedin.com/feed](https://linkedin.com/feed)
2. Click the extension icon
3. Paste some text
4. Click "Format Post"
5. Click "Insert" to add it to LinkedIn

## Development Mode

For development with hot reload:

```bash
npm run dev
```

Then load the `dist/` folder as an unpacked extension. Changes will rebuild automatically, but you'll need to:
1. Refresh the extension in `chrome://extensions/`
2. Reload any LinkedIn tabs

## Configuration

### PostHog Analytics (Optional)

1. Sign up at [posthog.com](https://posthog.com)
2. Create `.env` file from `.env.example`
3. Add your PostHog API key:
   ```
   VITE_POSTHOG_KEY=phc_your_key_here
   ```
4. Rebuild the extension

### Pro Upgrades (Optional)

For the Pro upgrade flow to work:
1. Set up Stripe account
2. Create a product for $5/month
3. Add Stripe key to `.env`
4. Implement payment endpoint (currently a placeholder)

## Troubleshooting

### Build Errors

**Error: Cannot find module 'X'**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
npm run type-check
```

### Extension Not Loading

1. Check that `dist/` folder exists
2. Check that `dist/manifest.json` exists
3. Look for errors in `chrome://extensions/`
4. Check browser console for errors

### Icons Not Showing

1. Ensure icon files exist in `public/icons/`
2. Check file names are exactly: `icon16.png`, `icon48.png`, `icon128.png`
3. Rebuild: `npm run build`

### Content Script Not Working

1. Ensure you're on linkedin.com
2. Check extension permissions in `chrome://extensions/`
3. Reload the LinkedIn tab
4. Check browser console for errors

## File Structure

```
LinkedIn-Post-Formatter/
├── public/
│   ├── icons/              # Extension icons (generate these)
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   └── manifest.json       # Extension manifest
├── src/
│   ├── popup/              # React UI
│   │   ├── App.tsx         # Main app component
│   │   ├── components/     # UI components
│   │   └── main.tsx        # Entry point
│   ├── content/
│   │   └── linkedin.ts     # LinkedIn page integration
│   ├── background/
│   │   └── service-worker.ts
│   └── utils/
│       ├── formatter.ts    # Core formatting logic
│       ├── storage.ts      # Chrome storage
│       └── analytics.ts    # PostHog analytics
├── scripts/
│   └── generate-icons.html # Icon generator
└── dist/                   # Build output (generated)
```

## Next Steps

1. **Test thoroughly** - Try all format types on LinkedIn
2. **Customize branding** - Update colors, copy, etc.
3. **Add features** - Check `TODO.md` for ideas
4. **Deploy** - See `DEPLOYMENT.md` for Chrome Web Store submission

## Need Help?

- Check `CONTRIBUTING.md` for development guidelines
- Open an issue on GitHub
- Review Chrome Extension documentation

---

**Happy building! 🚀**
