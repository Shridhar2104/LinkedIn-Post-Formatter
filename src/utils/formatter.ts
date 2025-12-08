export interface FormatOptions {
  addLineBreaks: boolean;
  addEmojis: boolean;
  addBulletPoints: boolean;
  addHook: boolean;
  addCTA: boolean;
  formatType: 'thread' | 'listicle' | 'story' | 'tips' | 'custom';
}

export interface FormattedPost {
  content: string;
  preview: string;
  stats: {
    lines: number;
    characters: number;
    readabilityScore: number;
  };
}

const HOOKS = [
  "Here's what nobody tells you about",
  "I spent 5 years learning this:",
  "This changed everything for me:",
  "Most people get this wrong:",
  "The hard truth about",
  "3 years ago, I made a mistake:",
];

const CTAs = [
  "\n\nWhat's your experience with this?\n\n♻️ Repost if you found this helpful",
  "\n\nDrop a comment with your thoughts 👇\n\n♻️ Share if this resonated with you",
  "\n\nAgree or disagree? Let me know below 👇",
  "\n\nSave this for later and share with your network 🔖",
];

const EMOJIS = {
  bullet: '→',
  check: '✓',
  star: '⭐',
  fire: '🔥',
  light: '💡',
  trophy: '🏆',
  rocket: '🚀',
  target: '🎯',
  chart: '📈',
  warning: '⚠️',
};

export class LinkedInFormatter {

  static formatPost(text: string, options: FormatOptions): FormattedPost {
    let formatted = text.trim();

    // Add hook at the beginning
    if (options.addHook && !this.hasHook(formatted)) {
      const randomHook = HOOKS[Math.floor(Math.random() * HOOKS.length)];
      formatted = `${randomHook}\n\n${formatted}`;
    }

    // Apply formatting based on type
    switch (options.formatType) {
      case 'thread':
        formatted = this.formatThread(formatted, options);
        break;
      case 'listicle':
        formatted = this.formatListicle(formatted, options);
        break;
      case 'story':
        formatted = this.formatStory(formatted, options);
        break;
      case 'tips':
        formatted = this.formatTips(formatted, options);
        break;
      default:
        formatted = this.formatCustom(formatted, options);
    }

    // Add CTA at the end
    if (options.addCTA) {
      const randomCTA = CTAs[Math.floor(Math.random() * CTAs.length)];
      formatted = `${formatted}${randomCTA}`;
    }

    const stats = this.calculateStats(formatted);

    return {
      content: formatted,
      preview: this.generatePreview(formatted),
      stats,
    };
  }

  private static formatThread(text: string, options: FormatOptions): string {
    // Split into paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());

    // Add line breaks every 2-3 lines for readability
    const formatted = paragraphs.map((para, index) => {
      let content = para;

      // Add emojis to beginning of some paragraphs
      if (options.addEmojis && index > 0 && Math.random() > 0.6) {
        const emoji = Object.values(EMOJIS)[Math.floor(Math.random() * Object.values(EMOJIS).length)];
        content = `${emoji} ${content}`;
      }

      return content;
    }).join('\n\n');

    return formatted;
  }

  private static formatListicle(text: string, options: FormatOptions): string {
    const lines = text.split('\n').filter(l => l.trim());

    // Detect if already has numbers or bullets
    const hasNumbers = lines.some(l => /^\d+[\.\)]/.test(l.trim()));
    const hasBullets = lines.some(l => /^[-•→]/.test(l.trim()));

    if (hasNumbers || hasBullets) {
      // Already formatted, just clean up spacing
      return lines.map(line => {
        if (options.addEmojis && /^\d+[\.\)]/.test(line.trim())) {
          // Add emoji after number
          return line.replace(/^(\d+[\.\)]\s*)/, `$1${EMOJIS.bullet} `);
        }
        return line;
      }).join('\n\n');
    }

    // Convert to numbered list
    return lines.map((line, index) => {
      const emoji = options.addEmojis ? ` ${EMOJIS.bullet}` : '';
      return `${index + 1}.${emoji} ${line}`;
    }).join('\n\n');
  }

  private static formatStory(text: string, options: FormatOptions): string {
    // Story format: Short paragraphs with emotional beats
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    let formatted = '';
    let currentPara = '';

    sentences.forEach((sentence, index) => {
      currentPara += sentence.trim() + ' ';

      // Create paragraph break every 2-3 sentences
      if ((index + 1) % 2 === 0 || index === sentences.length - 1) {
        formatted += currentPara.trim() + '\n\n';
        currentPara = '';
      }
    });

    return formatted.trim();
  }

  private static formatTips(text: string, options: FormatOptions): string {
    const lines = text.split('\n').filter(l => l.trim());

    return lines.map((line, index) => {
      const emoji = options.addEmojis ? `${EMOJIS.light} ` : '';
      const bullet = options.addBulletPoints ? `${EMOJIS.bullet} ` : '';

      // Add "Tip X:" prefix if not present
      if (!/^tip\s+\d+/i.test(line)) {
        return `${emoji}Tip ${index + 1}: ${bullet}${line}`;
      }
      return `${emoji}${line}`;
    }).join('\n\n');
  }

  private static formatCustom(text: string, options: FormatOptions): string {
    let formatted = text;

    // Add line breaks if text is too dense
    if (options.addLineBreaks) {
      formatted = this.addLineBreaks(formatted);
    }

    // Convert simple lists to bullet points
    if (options.addBulletPoints) {
      formatted = this.convertToBullets(formatted);
    }

    return formatted;
  }

  private static addLineBreaks(text: string): string {
    // Split long paragraphs
    const paragraphs = text.split('\n\n');

    return paragraphs.map(para => {
      // If paragraph has more than 3 sentences, split it
      const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];

      if (sentences.length <= 3) {
        return para;
      }

      let result = '';
      sentences.forEach((sentence, index) => {
        result += sentence.trim();

        // Add double line break every 2-3 sentences
        if ((index + 1) % 2 === 0 && index < sentences.length - 1) {
          result += '\n\n';
        } else if (index < sentences.length - 1) {
          result += ' ';
        }
      });

      return result;
    }).join('\n\n');
  }

  private static convertToBullets(text: string): string {
    const lines = text.split('\n');

    return lines.map(line => {
      // If line starts with dash or number, convert to bullet
      if (/^[-\*]/.test(line.trim())) {
        return line.replace(/^[-\*]\s*/, `${EMOJIS.bullet} `);
      }
      if (/^\d+[\.\)]/.test(line.trim())) {
        return line.replace(/^(\d+[\.\)]\s*)/, `$1${EMOJIS.bullet} `);
      }
      return line;
    }).join('\n');
  }

  private static hasHook(text: string): boolean {
    const firstLine = text.split('\n')[0].toLowerCase();
    return HOOKS.some(hook => firstLine.includes(hook.toLowerCase().slice(0, 10)));
  }

  private static calculateStats(text: string) {
    const lines = text.split('\n').length;
    const characters = text.length;

    // Simple readability score (0-100)
    // Based on: line breaks, sentence length, paragraph length
    const avgLineLength = characters / lines;
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const avgSentenceLength = text.length / Math.max(sentences.length, 1);

    let score = 100;

    // Penalize very long lines
    if (avgLineLength > 80) score -= 20;

    // Penalize very long sentences
    if (avgSentenceLength > 150) score -= 20;

    // Penalize walls of text (few line breaks)
    if (lines < 5 && characters > 500) score -= 30;

    // Reward good spacing
    if (lines > 8 && avgLineLength < 60) score += 10;

    return {
      lines,
      characters,
      readabilityScore: Math.max(0, Math.min(100, score)),
    };
  }

  private static generatePreview(text: string): string {
    const maxLength = 200;
    if (text.length <= maxLength) return text;

    return text.slice(0, maxLength) + '...';
  }

  static getTemplates() {
    return [
      {
        id: 'thread',
        name: 'Thread Style',
        description: 'Perfect for storytelling and longer posts',
        icon: '🧵',
        example: 'Multi-paragraph format with engaging hooks',
      },
      {
        id: 'listicle',
        name: 'List/Listicle',
        description: 'Great for tips, steps, or numbered points',
        icon: '📝',
        example: '1. First point\n2. Second point\n3. Third point',
      },
      {
        id: 'story',
        name: 'Story Format',
        description: 'Emotional narrative with short paragraphs',
        icon: '📖',
        example: 'Short, punchy paragraphs that build emotion',
      },
      {
        id: 'tips',
        name: 'Tips & Advice',
        description: 'Educational content with actionable tips',
        icon: '💡',
        example: 'Tip 1: ...\nTip 2: ...\nTip 3: ...',
      },
      {
        id: 'custom',
        name: 'Custom',
        description: 'Basic formatting with your preferences',
        icon: '⚙️',
        example: 'Apply your custom formatting preferences',
      },
    ];
  }
}
