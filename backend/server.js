// Backend API for LinkedIn Post Formatter
// Handles LLM API calls securely (keeps API keys server-side)

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['chrome-extension://*', 'http://localhost:*'],
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const rateLimits = new Map();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(identifier) {
  const now = Date.now();
  const userLimits = rateLimits.get(identifier) || { count: 0, resetAt: now + RATE_WINDOW };

  if (now > userLimits.resetAt) {
    rateLimits.set(identifier, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (userLimits.count >= RATE_LIMIT) {
    return false;
  }

  userLimits.count++;
  rateLimits.set(identifier, userLimits);
  return true;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Format endpoint
app.post('/api/format', async (req, res) => {
  try {
    // Rate limiting (use IP or user ID)
    const identifier = req.ip || 'anonymous';

    if (!checkRateLimit(identifier)) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again in a minute.',
      });
    }

    const { content, formatType, options, provider = 'openai' } = req.body;

    // Validate input
    if (!content || content.length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (content.length > 5000) {
      return res.status(400).json({ error: 'Content too long (max 5000 characters)' });
    }

    // Get API key based on provider
    const apiKey = getApiKey(provider);
    if (!apiKey) {
      return res.status(500).json({
        error: 'LLM service not configured',
        message: `${provider} API key not found. Please contact support.`,
      });
    }

    // Call LLM service
    const result = await formatWithLLM({
      content,
      formatType: formatType || 'thread',
      options: options || {},
      provider,
      apiKey,
    });

    res.json(result);
  } catch (error) {
    console.error('Format error:', error);
    res.status(500).json({
      error: 'Formatting failed',
      message: error.message || 'An unexpected error occurred',
    });
  }
});

// Get API key for provider
function getApiKey(provider) {
  const keys = {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    gemini: process.env.GEMINI_API_KEY,
  };
  return keys[provider];
}

// Format with LLM
async function formatWithLLM({ content, formatType, options, provider, apiKey }) {
  const prompt = buildPrompt(content, formatType, options);

  let formatted;

  switch (provider) {
    case 'openai':
      formatted = await callOpenAI(prompt, apiKey);
      break;
    case 'anthropic':
      formatted = await callAnthropic(prompt, apiKey);
      break;
    case 'gemini':
      formatted = await callGemini(prompt, apiKey);
      break;
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  return {
    formatted,
    confidence: 95,
    improvements: [],
    provider,
  };
}

// Build formatting prompt
function buildPrompt(content, formatType, options) {
  return `You are an expert LinkedIn content strategist. Format this post for maximum engagement.

**FORMAT TYPE:** ${formatType}

**RULES:**
- Add line breaks every 2-3 lines
- ${options.addHook ? 'Start with a strong hook' : 'Keep original opening'}
- ${options.addEmojis ? 'Add 3-5 relevant emojis strategically' : 'Minimal emojis'}
- ${options.addBulletPoints ? 'Use bullet points for lists' : 'Natural flow'}
- ${options.addCTA ? 'End with engaging CTA' : 'Keep original ending'}
- Stay under 3000 characters
- ${options.tone ? `Tone: ${options.tone}` : 'Maintain original tone'}

**ORIGINAL POST:**
${content}

**OUTPUT:**
Return ONLY the formatted post, ready to copy to LinkedIn. No explanations.`;
}

// OpenAI API
async function callOpenAI(prompt, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a LinkedIn content expert. Return only formatted posts.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Anthropic Claude API
async function callAnthropic(prompt, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Anthropic API error');
  }

  const data = await response.json();
  return data.content[0].text.trim();
}

// Google Gemini API
async function callGemini(prompt, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Gemini API error');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text.trim();
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LinkedIn Post Formatter API running on port ${PORT}`);
  console.log(`📝 Endpoints:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/format`);
  console.log(`\n🔑 Configured providers:`);
  console.log(`   - OpenAI: ${process.env.OPENAI_API_KEY ? '✓' : '✗'}`);
  console.log(`   - Anthropic: ${process.env.ANTHROPIC_API_KEY ? '✓' : '✗'}`);
  console.log(`   - Gemini: ${process.env.GEMINI_API_KEY ? '✓' : '✗'}`);
});

export default app;
