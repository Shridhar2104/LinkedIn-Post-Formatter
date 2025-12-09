# 🚀 Production Deployment Guide

Complete guide to deploy your LinkedIn Post Formatter with backend.

## Prerequisites

- ✅ GitHub account
- ✅ Railway account (free to create)
- ✅ Google account (for Gemini API key)

---

## Part 1: Get Gemini API Key (FREE) - 2 minutes

### Step 1: Go to Google AI Studio
Visit: https://makersuite.google.com/app/apikey

### Step 2: Create API Key
1. Click "Create API Key"
2. Select "Create API key in new project" or use existing project
3. Copy the API key (starts with `AIza...`)

**Important**: Save this key - you'll need it in Step 3!

**Cost**: FREE up to 15 requests per minute, 1500 requests per day

---

## Part 2: Deploy Backend to Railway - 5 minutes

### Step 1: Create Railway Account
Visit: https://railway.app

1. Click "Login" → "Login with GitHub"
2. Authorize Railway

### Step 2: Deploy Backend

1. Click "**New Project**"
2. Select "**Deploy from GitHub repo**"
3. If this is your first time:
   - Click "Configure GitHub App"
   - Select your repository: `Shridhar2104/LinkedIn-Post-Formatter`
   - Click "Install & Authorize"
4. Back in Railway, select `Shridhar2104/LinkedIn-Post-Formatter`
5. Railway will detect the project

### Step 3: Configure Root Directory

Railway needs to know where the backend code is:

1. Click on your service (should say "Deployment in progress...")
2. Go to "**Settings**" tab
3. Scroll to "**Build**" section
4. Set **Root Directory**: `backend`
5. Click "Save"

### Step 4: Add Environment Variables

1. Go to "**Variables**" tab
2. Click "**+ New Variable**"
3. Add these variables:

```
GEMINI_API_KEY = [paste your Gemini key from Part 1]
PORT = 3000
NODE_ENV = production
ALLOWED_ORIGINS = chrome-extension://*
```

4. Click "**Add**" after each variable

### Step 5: Get Backend URL

1. Go to "**Settings**" tab
2. Scroll to "**Networking**" section
3. Click "**Generate Domain**"
4. Copy the URL (e.g., `https://linkedin-formatter-backend-production.up.railway.app`)

**Save this URL - you'll need it for the frontend!**

### Step 6: Verify Deployment

1. Go to "**Deployments**" tab
2. Wait for green checkmark ✅ (1-2 minutes)
3. Test your backend:

Open in browser:
```
https://your-railway-url.railway.app/api/health
```

Should see:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

✅ **Backend is live!**

---

## Part 3: Configure Frontend - 2 minutes

### Step 1: Create .env File

In project root, create `.env`:

```bash
# Create .env file
cat > .env << 'EOF'
# Backend API URL
VITE_BACKEND_URL=https://your-railway-url.railway.app

# PostHog (optional - leave empty for now)
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=

# Environment
VITE_ENV=production
EOF
```

**Replace** `your-railway-url.railway.app` with your actual Railway URL!

### Step 2: Update Extension ID (After Chrome Web Store submission)

Once you submit to Chrome Web Store, you'll get an extension ID.

Update Railway environment variable:
```
ALLOWED_ORIGINS = chrome-extension://your-actual-extension-id
```

For testing locally, you can use:
```
ALLOWED_ORIGINS = chrome-extension://*
```

---

## Part 4: Build & Test Extension - 3 minutes

### Step 1: Build Extension

```bash
npm run build
```

### Step 2: Load in Chrome

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "**Developer mode**" (top right)
4. Click "**Load unpacked**"
5. Select `dist` folder

### Step 3: Test AI Formatting

1. Click extension icon
2. "Upgrade to Pro" (for testing, temporarily enable Pro in storage)
3. Paste a test post:
```
I just launched my new product. It helps people format LinkedIn posts better.
I spent 6 months building it and I'm excited to share it with everyone.
What do you think?
```
4. Check "**Use AI for smarter formatting**"
5. Select tone: "Professional"
6. Click "**AI Format Post**"

**Expected**:
- Button shows "AI Formatting..." with spinner
- After 2-3 seconds, you get a beautifully formatted post
- Much better than rule-based formatting!

✅ **If this works, your backend is working perfectly!**

---

## Part 5: Chrome Web Store Submission - 10 minutes

### Required Files

You need to create:

1. **Screenshots** (1280x800 or 640x400)
   - Screenshot 1: Extension popup with formatting options
   - Screenshot 2: Formatted post preview
   - Screenshot 3: AI formatting UI (Pro feature)
   - Screenshot 4: Before/after comparison
   - Screenshot 5: Insert to LinkedIn

2. **Promotional Images**
   - Small tile: 440x280
   - Large tile: 920x680 (optional)

3. **Privacy Policy** (Required!)
   - Create at: https://www.privacypolicygenerator.info/
   - Or use template below

### Privacy Policy Template

Create `PRIVACY_POLICY.md`:

```markdown
# Privacy Policy for LinkedIn Post Formatter

Last updated: [Date]

## Data Collection
We collect minimal data necessary for the extension to function:
- Post content you choose to format (processed locally or via our API)
- Usage statistics (anonymous)
- Pro subscription status

## Data Storage
- All data is stored locally in your browser
- API requests are processed and not stored permanently
- We do not sell or share your data

## Third-Party Services
- Google Gemini API for AI formatting (Pro feature)
- PostHog for anonymous analytics

## Contact
For privacy concerns: support@yourdomain.com
```

### Submission Steps

1. Go to: https://chrome.google.com/webstore/devconsole
2. Pay one-time $5 developer fee
3. Click "**New Item**"
4. Upload `dist.zip` (create from dist folder)
5. Fill out:
   - Name: LinkedIn Post Formatter
   - Description: [Use from README.md]
   - Category: Productivity
   - Language: English
   - Add screenshots (5+)
   - Add privacy policy URL
6. Click "**Submit for Review**"

**Review time**: 1-7 days

---

## Part 6: Production Environment Variables

### Update Railway Variables

Once extension is published, update these:

```
ALLOWED_ORIGINS = chrome-extension://your-actual-extension-id
RATE_LIMIT_PER_MINUTE = 20
NODE_ENV = production
```

### Update Frontend .env

```env
VITE_BACKEND_URL=https://your-railway-url.railway.app
VITE_ENV=production
```

Rebuild:
```bash
npm run build
```

Update extension in Chrome Web Store with new build.

---

## Costs Summary

| Service | Cost | What For |
|---------|------|----------|
| **Railway** | $5/month | Backend hosting |
| **Gemini API** | FREE | AI formatting |
| **Chrome Dev** | $5 one-time | Web Store submission |
| **Domain** (optional) | $10/year | Professional privacy policy URL |

**Total first month**: $10 (one-time) + $5 (recurring) = **$15**
**Ongoing**: **$5/month** 🎉

---

## Monitoring & Maintenance

### Check Backend Health

```bash
curl https://your-railway-url.railway.app/api/health
```

### Monitor Railway

1. Go to Railway dashboard
2. Check "Metrics" tab for:
   - Request count
   - Error rate
   - Memory usage

### Monitor Gemini Usage

1. Go to: https://console.cloud.google.com/
2. Select your project
3. Go to "APIs & Services" → "Gemini API"
4. Check quota usage

### Scale Up (When Needed)

**If you hit Gemini limits:**

Switch to OpenAI:
```bash
# Add to Railway variables
OPENAI_API_KEY = sk-your-openai-key
```

Update backend to prefer OpenAI over Gemini.

**Cost**: ~$0.30 per 1000 formats

---

## Troubleshooting

### Backend not responding

**Check Railway logs:**
1. Railway dashboard → Your service
2. Go to "Deployments" tab
3. Click latest deployment
4. Check logs

**Common issues:**
- Missing environment variables
- Wrong root directory (should be `backend`)
- Port not set to 3000

### CORS errors

**Solution:**
Update `ALLOWED_ORIGINS` in Railway to include your extension ID:
```
chrome-extension://your-extension-id
```

Get extension ID from `chrome://extensions/`

### Rate limiting

**Solution:**
Increase limit in Railway variables:
```
RATE_LIMIT_PER_MINUTE = 30
```

---

## Next Steps After Launch

### Week 1:
- ✅ Monitor Railway logs
- ✅ Check Gemini usage
- ✅ Respond to Chrome Web Store reviews

### Week 2-4:
- ✅ Get first 100 users
- ✅ Collect feedback
- ✅ Optimize AI prompts based on feedback

### Month 2+:
- ✅ Implement Stripe for Pro subscriptions
- ✅ Add analytics dashboard
- ✅ Consider upgrading to OpenAI for better quality

---

## Support

Need help?
- Railway docs: https://docs.railway.app
- Gemini docs: https://ai.google.dev/docs
- Chrome extension docs: https://developer.chrome.com/docs/extensions

---

**You're ready to launch! 🚀**
