import posthog from 'posthog-js';

// Initialize PostHog (use environment variable in production)
const POSTHOG_KEY = 'phc_your_project_key_here'; // Replace with actual key
const POSTHOG_HOST = 'https://app.posthog.com'; // Or self-hosted instance

let initialized = false;

export class Analytics {

  static init() {
    if (initialized) return;

    try {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        autocapture: false,
        capture_pageview: false,
        disable_session_recording: true, // Privacy-first
      });
      initialized = true;
    } catch (error) {
      console.error('Failed to initialize PostHog:', error);
    }
  }

  static identify(userId: string, traits?: Record<string, any>) {
    if (!initialized) return;

    posthog.identify(userId, traits);
  }

  static trackFormatted(formatType: string, postLength: number, userTier: 'free' | 'pro') {
    if (!initialized) return;

    posthog.capture('post_formatted', {
      format_type: formatType,
      post_length: postLength,
      user_tier: userTier,
      timestamp: new Date().toISOString(),
    });
  }

  static trackCopied(formatType: string) {
    if (!initialized) return;

    posthog.capture('post_copied', {
      format_type: formatType,
      timestamp: new Date().toISOString(),
    });
  }

  static trackInserted() {
    if (!initialized) return;

    posthog.capture('post_inserted', {
      timestamp: new Date().toISOString(),
    });
  }

  static trackUpgradeClicked(source: string) {
    if (!initialized) return;

    posthog.capture('upgrade_clicked', {
      source,
      timestamp: new Date().toISOString(),
    });
  }

  static trackUpgraded(plan: string, price: number) {
    if (!initialized) return;

    posthog.capture('upgraded_to_pro', {
      plan,
      price,
      timestamp: new Date().toISOString(),
    });
  }

  static trackTemplateUsed(templateId: string, templateName: string) {
    if (!initialized) return;

    posthog.capture('template_used', {
      template_id: templateId,
      template_name: templateName,
      timestamp: new Date().toISOString(),
    });
  }

  static trackTemplateSaved(templateName: string) {
    if (!initialized) return;

    posthog.capture('template_saved', {
      template_name: templateName,
      timestamp: new Date().toISOString(),
    });
  }

  static trackLimitReached(formatsUsed: number) {
    if (!initialized) return;

    posthog.capture('daily_limit_reached', {
      formats_used: formatsUsed,
      timestamp: new Date().toISOString(),
    });
  }

  static trackError(error: string, context?: Record<string, any>) {
    if (!initialized) return;

    posthog.capture('error_occurred', {
      error,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}

// Auto-initialize
Analytics.init();
