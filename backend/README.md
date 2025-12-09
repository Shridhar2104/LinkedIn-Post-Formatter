# LinkedIn Post Formatter - Backend API

Backend API server for handling LLM-powered post formatting with secure API key management.

## Features

- 🔒 **Secure API Key Management** - API keys stored server-side
- 🤖 **Multi-LLM Support** - OpenAI, Anthropic Claude, Google Gemini
- ⚡ **Rate Limiting** - Prevent abuse
- 🚀 **Fast & Lightweight** - Express.js server
- 📊 **Health Monitoring** - Built-in health check endpoint

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Add at least one LLM provider
OPENAI_API_KEY=sk-your-key-here
# or
ANTHROPIC_API_KEY=sk-ant-your-key-here
# or
GEMINI_API_KEY=your-key-here
```

### 3. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### Health Check

```bash
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Format Post

```bash
POST /api/format
Content-Type: application/json

{
  "content": "Your LinkedIn post content here...",
  "formatType": "thread",
  "options": {
    "addHook": true,
    "addEmojis": true,
    "addBulletPoints": true,
    "addCTA": true,
    "tone": "professional"
  },
  "provider": "openai"
}
```

Response:
```json
{
  "formatted": "Formatted post content...",
  "confidence": 95,
  "improvements": [],
  "provider": "openai"
}
```

## LLM Providers

### OpenAI (GPT-4o-mini)
- **Cost:** ~$0.15 per 1M input tokens
- **Speed:** Fast
- **Quality:** Excellent
- **Get Key:** https://platform.openai.com/api-keys

### Anthropic (Claude 3.5 Haiku)
- **Cost:** ~$0.25 per 1M input tokens
- **Speed:** Very fast
- **Quality:** Excellent
- **Get Key:** https://console.anthropic.com/

### Google Gemini (1.5 Flash)
- **Cost:** Free tier available
- **Speed:** Fast
- **Quality:** Good
- **Get Key:** https://makersuite.google.com/app/apikey

## Deployment

### Deploy to Railway

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Set environment variables in Railway dashboard
5. Deploy!

### Deploy to Render

1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your repository
4. Set environment variables
5. Deploy!

### Deploy to Vercel (Serverless)

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

## Rate Limiting

Default limits:
- **10 requests per minute** per IP address
- Automatically resets every minute
- Returns `429 Too Many Requests` when exceeded

Adjust in `.env`:
```env
RATE_LIMIT_PER_MINUTE=20
```

## Security

- ✅ CORS configured for extension only
- ✅ Rate limiting enabled
- ✅ Input validation
- ✅ API keys server-side only
- ✅ Request size limits (10MB)

## Monitoring

Check server health:
```bash
curl http://localhost:3000/api/health
```

## Troubleshooting

### API Key Errors

If you see "LLM service not configured":
1. Check `.env` file exists
2. Verify API key is valid
3. Restart server after adding keys

### CORS Errors

Update `ALLOWED_ORIGINS` in `.env`:
```env
ALLOWED_ORIGINS=chrome-extension://your-extension-id,http://localhost:5173
```

### Rate Limit Issues

Increase limits in `.env`:
```env
RATE_LIMIT_PER_MINUTE=20
```

## Cost Estimation

Approximate costs per 1000 formats:

| Provider | Cost per 1K Formats |
|----------|-------------------|
| Gemini | Free (up to quota) |
| OpenAI (GPT-4o-mini) | ~$0.30 |
| Anthropic (Haiku) | ~$0.50 |

**Recommendation:** Start with Gemini (free), upgrade to OpenAI for better quality.

## Support

For issues, please create a GitHub issue or contact support.
