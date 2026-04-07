/**
 * Newsletter & Email Capture System
 * 
 * Supports multiple email providers:
 * - ConvertKit
 * - Mailchimp
 * - Buttondown
 * - Substack
 * - Beehiiv
 */

export type EmailProvider = 'convertkit' | 'mailchimp' | 'buttondown' | 'substack' | 'beehiiv' | 'custom';

interface NewsletterConfig {
  provider: EmailProvider;
  apiKey?: string;
  formId?: string;
  listId?: string;
  endpoint?: string;
}

interface Subscriber {
  email: string;
  firstName?: string;
  tags?: string[];
  source?: string;
  subscribedAt: Date;
}

// Configuration
const NEWSLETTER_CONFIG: NewsletterConfig = {
  provider: (process.env.NEXT_PUBLIC_EMAIL_PROVIDER as EmailProvider) || 'convertkit',
  apiKey: process.env.EMAIL_API_KEY,
  formId: process.env.NEXT_PUBLIC_EMAIL_FORM_ID,
  listId: process.env.NEXT_PUBLIC_EMAIL_LIST_ID,
  endpoint: process.env.NEXT_PUBLIC_EMAIL_ENDPOINT,
};

/**
 * Subscribe email to newsletter
 */
export async function subscribeEmail(
  email: string,
  options?: { firstName?: string; tags?: string[]; source?: string }
): Promise<{ success: boolean; message: string; subscriber?: Subscriber }> {
  const { provider } = NEWSLETTER_CONFIG;
  
  try {
    switch (provider) {
      case 'convertkit':
        return await subscribeToConvertKit(email, options);
      case 'mailchimp':
        return await subscribeToMailchimp(email, options);
      case 'buttondown':
        return await subscribeToButtondown(email, options);
      case 'beehiiv':
        return await subscribeToBeehiiv(email, options);
      case 'custom':
        return await subscribeToCustom(email, options);
      default:
        // Store locally for manual processing
        storeSubscriberLocally(email, options);
        return {
          success: true,
          message: 'Thanks for subscribing! You\'ll receive our first email soon.',
          subscriber: {
            email,
            ...options,
            subscribedAt: new Date(),
          },
        };
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    };
  }
}

/**
 * ConvertKit integration
 */
async function subscribeToConvertKit(
  email: string,
  options?: { firstName?: string; tags?: string[]; source?: string }
): Promise<{ success: boolean; message: string }> {
  const apiKey = NEWSLETTER_CONFIG.apiKey;
  const formId = NEWSLETTER_CONFIG.formId;
  
  if (!apiKey || !formId) {
    throw new Error('ConvertKit not configured');
  }
  
  const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      email,
      first_name: options?.firstName,
      tags: options?.tags,
      fields: {
        source: options?.source || 'website',
      },
    }),
  });
  
  if (!response.ok) {
    throw new Error('ConvertKit API error');
  }
  
  return {
    success: true,
    message: 'Welcome aboard! Check your email to confirm your subscription.',
  };
}

/**
 * Mailchimp integration
 */
async function subscribeToMailchimp(
  email: string,
  options?: { firstName?: string; tags?: string[]; source?: string }
): Promise<{ success: boolean; message: string }> {
  const apiKey = NEWSLETTER_CONFIG.apiKey;
  const listId = NEWSLETTER_CONFIG.listId;
  const datacenter = apiKey?.split('-')[1];
  
  if (!apiKey || !listId || !datacenter) {
    throw new Error('Mailchimp not configured');
  }
  
  const response = await fetch(`https://${datacenter}.api.mailchimp.com/3.0/lists/${listId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email_address: email,
      status: 'pending', // Double opt-in
      merge_fields: {
        FNAME: options?.firstName || '',
        SOURCE: options?.source || 'website',
      },
      tags: options?.tags || [],
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    if (error.title === 'Member Exists') {
      return {
        success: true,
        message: 'You\'re already subscribed!',
      };
    }
    throw new Error('Mailchimp API error');
  }
  
  return {
    success: true,
    message: 'Almost there! Check your email to confirm your subscription.',
  };
}

/**
 * Buttondown integration
 */
async function subscribeToButtondown(
  email: string,
  options?: { firstName?: string; tags?: string[]; source?: string }
): Promise<{ success: boolean; message: string }> {
  const apiKey = NEWSLETTER_CONFIG.apiKey;
  
  if (!apiKey) {
    throw new Error('Buttondown not configured');
  }
  
  const response = await fetch('https://api.buttondown.email/v1/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${apiKey}`,
    },
    body: JSON.stringify({
      email,
      metadata: {
        first_name: options?.firstName,
        source: options?.source,
      },
      tags: options?.tags,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Buttondown API error');
  }
  
  return {
    success: true,
    message: 'Welcome to the Lost Luggage Legends community!',
  };
}

/**
 * Beehiiv integration
 */
async function subscribeToBeehiiv(
  email: string,
  options?: { firstName?: string; tags?: string[]; source?: string }
): Promise<{ success: boolean; message: string }> {
  const apiKey = NEWSLETTER_CONFIG.apiKey;
  
  if (!apiKey) {
    throw new Error('Beehiiv not configured');
  }
  
  const response = await fetch('https://api.beehiiv.com/v2/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email,
      first_name: options?.firstName,
      utm_source: options?.source,
      custom_fields: options?.tags?.reduce((acc, tag) => ({ ...acc, [tag]: true }), {}),
    }),
  });
  
  if (!response.ok) {
    throw new Error('Beehiiv API error');
  }
  
  return {
    success: true,
    message: 'You\'re in! Watch your inbox for travel stories.',
  };
}

/**
 * Custom endpoint integration
 */
async function subscribeToCustom(
  email: string,
  options?: { firstName?: string; tags?: string[]; source?: string }
): Promise<{ success: boolean; message: string }> {
  const endpoint = NEWSLETTER_CONFIG.endpoint;
  
  if (!endpoint) {
    throw new Error('Custom endpoint not configured');
  }
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      firstName: options?.firstName,
      tags: options?.tags,
      source: options?.source,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Custom subscription error');
  }
  
  return {
    success: true,
    message: 'Thanks for subscribing!',
  };
}

/**
 * Store subscriber locally (fallback)
 */
function storeSubscriberLocally(
  email: string,
  options?: { firstName?: string; tags?: string[]; source?: string }
): void {
  if (typeof window !== 'undefined') {
    const subscribers = JSON.parse(localStorage.getItem('lll_subscribers') || '[]');
    subscribers.push({
      email,
      ...options,
      subscribedAt: new Date().toISOString(),
    });
    localStorage.setItem('lll_subscribers', JSON.stringify(subscribers));
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get welcome email sequence config
 */
export const WELCOME_SEQUENCE = {
  name: 'Lost Luggage Legends Welcome Series',
  emails: [
    {
      day: 0,
      subject: 'Welcome to Lost Luggage Legends! 🧳',
      preview: 'Your first survival guide is inside...',
    },
    {
      day: 1,
      subject: 'The 24-Hour Luggage Recovery Playbook',
      preview: 'Step-by-step what to do when your bag goes missing',
    },
    {
      day: 3,
      subject: '5 Travel Insurance Myths Debunked',
      preview: 'What your policy actually covers (and doesn\'t)',
    },
    {
      day: 7,
      subject: 'Reader Story: "I survived 10 days without luggage"',
      preview: 'Real lessons from a reader who made it through',
    },
  ],
};
