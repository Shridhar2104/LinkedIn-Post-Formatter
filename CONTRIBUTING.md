# Contributing to LinkedIn Post Formatter

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/LinkedIn-Post-Formatter.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check
```

## Project Structure

```
src/
├── popup/              # React UI components
├── content/            # Content scripts for LinkedIn
├── background/         # Background service worker
└── utils/              # Shared utilities
    ├── formatter.ts    # Formatting logic
    ├── storage.ts      # Chrome storage management
    └── analytics.ts    # PostHog analytics
```

## Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

## Adding New Features

### Adding a New Format Type

1. Add the format to `src/utils/formatter.ts`:

```typescript
private static formatYourFormat(text: string, options: FormatOptions): string {
  // Your formatting logic
}
```

2. Add it to the `formatPost` switch statement
3. Add template info to `getTemplates()`

### Adding New UI Components

1. Create component in `src/popup/components/`
2. Import and use in `App.tsx`
3. Follow existing component patterns

## Testing

Before submitting a PR:

1. Test the extension in Chrome
2. Test all format types
3. Test both free and Pro flows
4. Test on actual LinkedIn pages
5. Check console for errors

## Submitting Changes

1. Commit your changes with clear messages:
   ```
   git commit -m "Add: New listicle format with emojis"
   ```

2. Push to your fork:
   ```
   git push origin feature/your-feature-name
   ```

3. Open a Pull Request with:
   - Clear description of changes
   - Screenshots/videos if UI changes
   - Any related issue numbers

## Pull Request Guidelines

- Keep PRs focused on a single feature/fix
- Update README if adding new features
- Ensure no TypeScript errors
- Test thoroughly before submitting

## Feature Requests

Open an issue with:
- Clear description of the feature
- Use cases
- Mockups if applicable

## Bug Reports

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/console errors
- Browser version

## Questions?

Feel free to open an issue for any questions!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
