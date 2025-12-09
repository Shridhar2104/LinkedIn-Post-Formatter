// LLM Service for LinkedIn Post Formatting
// Supports multiple providers: OpenAI, Anthropic, Google Gemini

export type LLMProvider = 'openai' | 'anthropic' | 'gemini';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model?: string;
  maxTokens?: number;
}

export interface LLMFormatRequest {
  content: string;
  formatType: string;
  options: {
    addHook?: boolean;
    addEmojis?: boolean;
    addBulletPoints?: boolean;
    addCTA?: boolean;
    tone?: 'professional' | 'casual' | 'inspirational' | 'educational';
  };
}

export interface LLMFormatResponse {
  formatted: string;
  improvements: string[];
  confidence: number;
}

export class LLMService {
  private config: LLMConfig;
  private static readonly API_ENDPOINTS = {
    openai: 'https://api.openai.com/v1/chat/completions',
    anthropic: 'https://api.anthropic.com/v1/messages',
    gemini: 'https://generativelanguage.googleapis.com/v1beta/models',
  };

  constructor(config: LLMConfig) {
    this.config = {
      ...config,
      model: config.model || this.getDefaultModel(config.provider),
      maxTokens: config.maxTokens || 1000,
    };
  }

  private getDefaultModel(provider: LLMProvider): string {
    const defaults = {
      openai: 'gpt-4o-mini', // Cheaper and faster than GPT-4
      anthropic: 'claude-3-5-haiku-20241022', // Fast and cheap
      gemini: 'gemini-1.5-flash', // Free tier available
    };
    return defaults[provider];
  }

  /**
   * Format a LinkedIn post using LLM
   */
  async formatPost(request: LLMFormatRequest): Promise<LLMFormatResponse> {
    const prompt = this.buildPrompt(request);

    try {
      const response = await this.callLLM(prompt);
      return this.parseResponse(response);
    } catch (error) {
      console.error('LLM formatting failed:', error);
      throw new Error('LLM formatting failed. Please try again or use standard formatting.');
    }
  }

  /**
   * Build the formatting prompt
   */
  private buildPrompt(request: LLMFormatRequest): string {
    const { content, formatType, options } = request;

    return `You are an expert LinkedIn content strategist specializing in viral post formatting. Your goal is to transform posts for maximum engagement.

**FORMATTING RULES:**
1. LinkedIn posts perform best with:
   - Strong hooks (first 1-2 lines grab attention)
   - Short paragraphs (2-3 lines max)
   - Plenty of white space (line breaks every 2-3 lines)
   - Strategic emoji use (not excessive)
   - Scannable structure (bullets, numbers, or clear sections)
   - Compelling CTAs (questions, calls to action)

2. Character limit: Keep under 3000 characters

3. Format Type: ${formatType.toUpperCase()}
   ${this.getFormatTypeInstructions(formatType)}

**USER PREFERENCES:**
${options.addHook ? '- Add a strong, attention-grabbing hook at the start' : '- Keep original opening'}
${options.addEmojis ? '- Use emojis strategically (3-5 max, relevant to content)' : '- Minimal or no emojis'}
${options.addBulletPoints ? '- Convert lists to bullet points or numbers' : '- Keep natural paragraph flow'}
${options.addCTA ? '- End with an engaging CTA (question, request for engagement)' : '- Keep original ending'}
${options.tone ? `- Tone: ${options.tone}` : '- Maintain original tone'}

**ORIGINAL POST:**
"""
${content}
"""

**YOUR TASK:**
Format this post for maximum LinkedIn engagement following the rules above. Return ONLY the formatted post content, no explanations or meta-commentary.

**OUTPUT FORMAT:**
Just return the formatted post text, ready to copy-paste to LinkedIn.`;
  }

  private getFormatTypeInstructions(formatType: string): string {
    const instructions = {
      thread: `- Multi-paragraph story format
   - Each paragraph 2-3 lines
   - Build narrative flow
   - Use line breaks for emphasis`,

      listicle: `- Numbered or bulleted list format
   - Each point on new line with spacing
   - Add → or other bullet emojis
   - Clear, scannable structure`,

      story: `- Personal narrative style
   - Short, punchy paragraphs
   - Emotional journey
   - Build to conclusion`,

      tips: `- Educational format
   - "Tip 1:", "Tip 2:" structure
   - Actionable advice
   - Each tip separated clearly`,

      custom: `- Apply general best practices
   - Optimize spacing and structure
   - Improve readability`,
    };

    return instructions[formatType as keyof typeof instructions] || instructions.custom;
  }

  /**
   * Call the LLM API
   */
  private async callLLM(prompt: string): Promise<string> {
    switch (this.config.provider) {
      case 'openai':
        return this.callOpenAI(prompt);
      case 'anthropic':
        return this.callAnthropic(prompt);
      case 'gemini':
        return this.callGemini(prompt);
      default:
        throw new Error(`Unsupported provider: ${this.config.provider}`);
    }
  }

  /**
   * OpenAI API call
   */
  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch(LLMService.API_ENDPOINTS.openai, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert LinkedIn content formatter. Return only the formatted post, no explanations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: this.config.maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  /**
   * Anthropic Claude API call
   */
  private async callAnthropic(prompt: string): Promise<string> {
    const response = await fetch(LLMService.API_ENDPOINTS.anthropic, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.content[0].text.trim();
  }

  /**
   * Google Gemini API call
   */
  private async callGemini(prompt: string): Promise<string> {
    const endpoint = `${LLMService.API_ENDPOINTS.gemini}/${this.config.model}:generateContent?key=${this.config.apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: this.config.maxTokens,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  }

  /**
   * Parse LLM response
   */
  private parseResponse(content: string): LLMFormatResponse {
    // Clean up any potential markdown or formatting artifacts
    let formatted = content
      .replace(/^```[\s\S]*?\n/, '') // Remove opening code fence
      .replace(/\n```$/, '') // Remove closing code fence
      .trim();

    // Extract improvements if the LLM included them (optional)
    const improvements: string[] = [];

    // Simple confidence score based on content quality indicators
    let confidence = 100;

    // Penalize if too short or too long
    if (formatted.length < 100) confidence -= 30;
    if (formatted.length > 3000) confidence -= 20;

    // Reward good structure
    const hasLineBreaks = formatted.split('\n\n').length > 2;
    const hasEmojis = /[\u{1F300}-\u{1F9FF}]/u.test(formatted);

    if (hasLineBreaks) confidence += 10;
    if (hasEmojis) confidence += 5;

    return {
      formatted,
      improvements,
      confidence: Math.max(0, Math.min(100, confidence)),
    };
  }

  /**
   * Estimate cost for a formatting request
   */
  static estimateCost(provider: LLMProvider, contentLength: number): number {
    // Approximate costs per 1K tokens (as of 2024)
    const costs = {
      openai: 0.00015, // GPT-4o-mini
      anthropic: 0.00025, // Claude Haiku
      gemini: 0, // Free tier
    };

    // Rough estimation: 1 token ≈ 4 characters
    const estimatedTokens = (contentLength + 1000) / 4; // +1000 for prompt
    const costPer1K = costs[provider];

    return (estimatedTokens / 1000) * costPer1K;
  }
}

/**
 * Backend API Client
 * This communicates with your backend to keep API keys secure
 */
export class LLMBackendClient {
  private static readonly BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  /**
   * Format post via backend API (recommended for production)
   */
  static async formatPost(request: LLMFormatRequest): Promise<LLMFormatResponse> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/api/format`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Backend formatting failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Backend API error:', error);
      throw error;
    }
  }

  /**
   * Check if backend is available
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/api/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
