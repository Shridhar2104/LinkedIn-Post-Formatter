# Deployment Guide

## Building for Production

```bash
# Install dependencies
npm install

# Build the extension
npm run build
```

The production build will be in the `dist/` directory.

## Chrome Web Store Submission

### 1. Prepare Assets

You'll need:
- Extension icons (16x16, 48x48, 128x128) - ✅ Generated
- Screenshots (1280x800 or 640x400) - 📸 Take 3-5 screenshots
- Promotional images:
  - Small tile: 440x280
  - Large tile: 920x680 (optional)
  - Marquee: 1400x560 (optional)

### 2. Create Developer Account

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay one-time $5 registration fee
3. Complete profile information

### 3. Package Extension

```bash
# Zip the dist folder
cd dist
zip -r ../linkedin-post-formatter.zip .
cd ..
```

### 4. Upload to Chrome Web Store

1. Click "New Item" in dashboard
2. Upload `linkedin-post-formatter.zip`
3. Fill out the listing:

**Store Listing Information:**

- **Name**: LinkedIn Post Formatter
- **Summary**: Transform your LinkedIn posts into highly engaging, perfectly formatted content
- **Description**: (Use the description from README.md)
- **Category**: Productivity
- **Language**: English

**Privacy:**

- Single purpose: Formatting LinkedIn posts
- Permission justification:
  - `storage`: Save user preferences and formatting history
  - `activeTab`: Insert formatted posts into LinkedIn
  - `scripting`: Detect and interact with LinkedIn's post composer

**Screenshots:**

Take screenshots showing:
1. Main popup interface
2. Format selection
3. Before/after formatting comparison
4. Pro upgrade screen
5. Insert into LinkedIn demo

### 5. Privacy Policy

Create a simple privacy policy page (can host on GitHub Pages):

```markdown
# Privacy Policy for LinkedIn Post Formatter

Last updated: [DATE]

## Data Collection

We collect minimal data:
- Format usage counts (stored locally)
- User preferences (stored locally)
- Anonymous analytics via PostHog (optional)

## Data Storage

All data is stored locally in your browser via Chrome Storage API.
We do not transmit your post content to any servers.

## Third-Party Services

- PostHog: Anonymous usage analytics (can be disabled)
- Stripe: Payment processing for Pro upgrades

## Contact

For privacy concerns: support@linkedinpostformatter.com
```

### 6. Submit for Review

1. Click "Submit for Review"
2. Review typically takes 1-3 business days
3. You'll receive email notification

## Post-Launch

### Marketing Checklist

- [ ] Post on LinkedIn about your extension
- [ ] Share on Twitter
- [ ] Post on Reddit (r/SideProject, r/Entrepreneur)
- [ ] Post on Product Hunt
- [ ] Post on Indie Hackers
- [ ] Create demo video for YouTube
- [ ] Write blog post about building it
- [ ] Email LinkedIn influencers

### Growth Tactics

1. **Content Marketing**
   - Write LinkedIn posts using the tool
   - Add subtle CTA: "Formatted with LinkedIn Post Formatter 💎"
   - Share before/after engagement screenshots

2. **Viral Loop**
   - Add "Formatted with..." watermark option
   - Encourage users to share results
   - Referral program for Pro upgrades

3. **Partnerships**
   - Reach out to LinkedIn coaches
   - Offer affiliate program (20% commission)
   - Collaborate with content creators

4. **Paid Ads**
   - Google Ads: Target "LinkedIn tips" keywords
   - Facebook Ads: Target "Social Media Manager" job title
   - LinkedIn Ads: Target users who post frequently

### Metrics to Track

- Daily Active Users (DAU)
- Format events per user
- Free → Pro conversion rate
- Viral coefficient
- Retention (Day 1, 7, 30)
- Revenue (MRR, ARR)

## Updating the Extension

```bash
# Make your changes
# Update version in manifest.json and package.json

# Build
npm run build

# Test locally
# Load unpacked extension in Chrome

# Package
cd dist && zip -r ../linkedin-post-formatter-v1.1.0.zip . && cd ..

# Upload to Chrome Web Store
# Submit for review
```

## Analytics Setup

### PostHog

1. Sign up at [posthog.com](https://posthog.com)
2. Get your project API key
3. Update `src/utils/analytics.ts` with your key
4. Rebuild and deploy

### Stripe (for Pro upgrades)

1. Create Stripe account
2. Set up product: "LinkedIn Post Formatter Pro" - $5/month
3. Get publishable key
4. Add to `.env` file
5. Implement checkout flow (placeholder in current version)

## Support

Create a support page:
- FAQ
- Video tutorials
- Contact form
- Feature requests

## Roadmap

Share your roadmap publicly to build excitement:
- Current features
- Coming soon
- Under consideration
- Request features

---

**Goal: 100K+ users in 12 months**

Month 1-3: 0 → 1,000 users (Product Hunt, organic)
Month 4-6: 1,000 → 10,000 users (Content marketing)
Month 7-9: 10,000 → 50,000 users (Paid ads)
Month 10-12: 50,000 → 100,000 users (Viral growth)

At 5% conversion × $5/month:
- 1K users = $250 MRR
- 10K users = $2,500 MRR
- 100K users = $25,000 MRR

**Let's build this! 🚀**
