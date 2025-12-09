# 🤖 LLM Integration Setup Guide

This guide will help you set up AI-powered formatting for your LinkedIn Post Formatter extension.

## Overview

The extension now supports **AI-powered formatting** as a Pro feature, using LLMs (Large Language Models) to create more engaging, context-aware LinkedIn posts.

### Supported LLM Providers:
- ✅ **OpenAI** (GPT-4o-mini) - Recommended
- ✅ **Anthropic** (Claude 3.5 Haiku) - Fast & high-quality
- ✅ **Google Gemini** (1.5 Flash) - Free tier available

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│  Extension  │  ────▶  │   Backend    │  ────▶  │  LLM API     │
│   (React)   │         │   (Express)  │         │  (OpenAI)    │
└─────────────┘         └──────────────┘         └──────────────┘
     Client                  Server               AI Provider
```

**Why this architecture?**
- 🔒 **Security**: API keys stored server-side only
- 💰 **Cost Control**: Centralized usage tracking
- ⚡ **Performance**: Caching & rate limiting
- 🔄 **Flexibility**: Easy to switch LLM providers

---

## Quick Start (5 minutes)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 2. Get API Key

Choose ONE provider:

**Option A: OpenAI (Recommended)**
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

**Option B: Anthropic Claude**
1. Go to https://console.anthropic.com/
2. Create API key
3. Copy the key (starts with `sk-ant-`)

**Option C: Google Gemini (Free!)**
1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Copy the key

### 3. Configure Backend

Edit `backend/.env`:

```env
# Add your chosen API key
OPENAI_API_KEY=sk-your-key-here

# Or Anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Or Gemini
GEMINI_API_KEY=your-gemini-key-here
```

### 4. Start Backend

```bash
cd backend
npm start
```

You should see:
```
🚀 LinkedIn Post Formatter API running on port 3000
🔑 Configured providers:
   - OpenAI: ✓
```

### 5. Configure Frontend

Edit `.env` in the root directory:

```env
VITE_BACKEND_URL=http://localhost:3000
```

### 6. Build & Test

```bash
# In project root
npm run build

# Load extension in Chrome
# Open chrome://extensions/
# Load unpacked → select dist folder
```

### 7. Test LLM Formatting

1. Open extension
2. Upgrade to Pro (for testing, temporarily set `isPro: true` in storage)
3. Enable "Use AI for smarter formatting"
4. Format a post!

---

## Production Deployment

### Backend Deployment Options

#### Option 1: Railway (Recommended - Easiest)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Add environment variables in Railway dashboard
6. Deploy!

**Cost:** ~$5/month + LLM usage

#### Option 2: Render

1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect GitHub repository
4. Set environment variables
5. Deploy!

**Cost:** Free tier available, then $7/month

#### Option 3: Vercel (Serverless)

```bash
npm install -g vercel
cd backend
vercel
```

Add environment variables in Vercel dashboard.

**Cost:** Free tier generous

### Update Frontend for Production

Edit `.env`:

```env
# Use your deployed backend URL
VITE_BACKEND_URL=https://your-backend.railway.app
```

Rebuild extension:
```bash
npm run build
```

---

## Cost Estimation

### Per 1,000 Formats:

| Provider | Model | Cost |
|----------|-------|------|
| **Gemini** | 1.5 Flash | **FREE** (up to quota) |
| **OpenAI** | GPT-4o-mini | ~$0.30 |
| **Anthropic** | Claude Haiku | ~$0.50 |

### Monthly Costs (Example)

Assuming 100 Pro users, 10 formats/day each:

- **Total formats/month**: 100 × 10 × 30 = 30,000
- **Cost with Gemini**: $0 (free tier)
- **Cost with GPT-4o-mini**: ~$9/month
- **Cost with Claude Haiku**: ~$15/month

**Recommendation**: Start with Gemini (free), upgrade to OpenAI for better quality as you grow.

---

## Advanced Configuration

### Rate Limiting

Edit `backend/.env`:

```env
# Increase limits for Pro users
RATE_LIMIT_PER_MINUTE=20
```

### Custom Prompts

Edit `backend/server.js` → `buildPrompt()` function to customize formatting instructions.

### Multiple Providers

Support all three providers and let users choose:

```env
OPENAI_API_KEY=sk-your-key
ANTHROPIC_API_KEY=sk-ant-your-key
GEMINI_API_KEY=your-key
```

Users can select provider in extension UI.

---

## Troubleshooting

### "LLM service not configured"

**Solution**:
1. Check backend `.env` file exists
2. Verify API key is valid
3. Restart backend server

### "CORS error"

**Solution**:
Update `backend/.env`:
```env
ALLOWED_ORIGINS=chrome-extension://your-extension-id
```

Get your extension ID from `chrome://extensions/`

### "Rate limit exceeded"

**Solution**:
Increase rate limit in `backend/.env`:
```env
RATE_LIMIT_PER_MINUTE=30
```

### Backend not responding

**Solution**:
1. Check backend is running: `curl http://localhost:3000/api/health`
2. Check frontend `.env` has correct `VITE_BACKEND_URL`
3. Check browser console for errors

---

## Security Best Practices

✅ **DO:**
- Keep API keys server-side only
- Use environment variables
- Enable rate limiting
- Monitor usage
- Rotate keys periodically

❌ **DON'T:**
- Put API keys in frontend code
- Commit `.env` files to Git
- Share API keys publicly
- Disable rate limiting in production

---

## Monitoring & Analytics

### Track LLM Usage

Add to `backend/server.js`:

```javascript
app.post('/api/format', async (req, res) => {
  const startTime = Date.now();

  // ... format logic ...

  const duration = Date.now() - startTime;
  console.log(`LLM request: ${provider}, ${duration}ms, ${content.length} chars`);
});
```

### Monitor Costs

Check your provider dashboards:
- **OpenAI**: https://platform.openai.com/usage
- **Anthropic**: https://console.anthropic.com/usage
- **Gemini**: https://console.cloud.google.com/

---

## Optimization Tips

### 1. Caching

Cache common formatting patterns to reduce API calls:

```javascript
const cache = new Map();

function getCacheKey(content, formatType) {
  return `${content.slice(0, 50)}_${formatType}`;
}

// Check cache before calling LLM
const cached = cache.get(cacheKey);
if (cached) return cached;
```

### 2. Shorter Prompts

Reduce token usage by optimizing prompts:
- Remove unnecessary instructions
- Use abbreviations
- Provide examples only when needed

### 3. Batch Requests

For heavy users, batch multiple requests to save on overhead.

---

## Future Enhancements

Planned features:
- [ ] Response streaming for faster UX
- [ ] A/B testing different prompts
- [ ] User-provided API keys (power users)
- [ ] Offline mode with cached results
- [ ] Local LLM support (Ollama, etc.)

---

## Support

Need help?
- 📧 Email: support@linkedinpostformatter.com
- 💬 Discord: [Join community](https://discord.gg)
- 📖 Docs: See main README.md

---

## What's Next?

1. ✅ Set up backend with API key
2. ✅ Test locally
3. ✅ Deploy to production
4. ✅ Monitor usage & costs
5. ✅ Iterate based on user feedback

**Good luck building! 🚀**
