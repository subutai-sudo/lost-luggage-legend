/**
 * Affiliate Link Management System
 * 
 * Supports multiple affiliate networks:
 * - ShareASale
 * - Awin
 * - Amazon Associates
 * - Commission Junction
 */

export type AffiliateNetwork = 'shareasale' | 'awin' | 'amazon' | 'cj' | 'expedia' | 'custom';

interface AffiliateConfig {
  network: AffiliateNetwork;
  merchantId?: string;
  affiliateId: string;
  customParams?: Record<string, string>;
}

interface AffiliateLink {
  originalUrl: string;
  affiliateUrl: string;
  network: AffiliateNetwork;
  trackingId: string;
}

// Configuration - Load from environment variables
const AFFILIATE_CONFIG: Record<string, AffiliateConfig> = {
  shareasale: {
    network: 'shareasale',
    affiliateId: process.env.NEXT_PUBLIC_SHAREASALE_ID || '',
    merchantId: process.env.NEXT_PUBLIC_SHAREASALE_MERCHANT_ID || '',
  },
  awin: {
    network: 'awin',
    affiliateId: process.env.NEXT_PUBLIC_AWIN_ID || '',
    merchantId: process.env.NEXT_PUBLIC_AWIN_ADVERTISER_ID || '',
  },
  amazon: {
    network: 'amazon',
    affiliateId: process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || '',
  },
  expedia: {
    network: 'expedia',
    affiliateId: process.env.NEXT_PUBLIC_EXPEDIA_AFFILIATE_ID || 'Y1ZJJ9d',
  },
};

/**
 * Generate affiliate link for various networks
 */
export function generateAffiliateLink(
  originalUrl: string,
  network: AffiliateNetwork = 'shareasale',
  options?: { merchantId?: string; campaign?: string }
): AffiliateLink {
  const config = AFFILIATE_CONFIG[network];
  const trackingId = generateTrackingId();
  
  let affiliateUrl = originalUrl;
  
  switch (network) {
    case 'shareasale':
      // ShareASale format: https://shareasale.com/r.cfm?b=MERCHANT_ID&u=AFFILIATE_ID&m=MERCHANT_ID&urllink=ENCODED_URL
      const encodedUrl = encodeURIComponent(originalUrl);
      affiliateUrl = `https://shareasale.com/r.cfm?b=${options?.merchantId || config.merchantId}&u=${config.affiliateId}&m=${options?.merchantId || config.merchantId}&urllink=${encodedUrl}`;
      break;
      
    case 'awin':
      // Awin format: https://www.awin1.com/cread.php?awinmid=ADVERTISER_ID&awinaffid=AFFILIATE_ID&ued=URL
      affiliateUrl = `https://www.awin1.com/cread.php?awinmid=${options?.merchantId || config.merchantId}&awinaffid=${config.affiliateId}&ued=${encodeURIComponent(originalUrl)}`;
      break;
      
    case 'amazon':
      // Amazon format: Add tag parameter
      const separator = originalUrl.includes('?') ? '&' : '?';
      affiliateUrl = `${originalUrl}${separator}tag=${config.affiliateId}`;
      break;
      
    case 'cj':
      // Commission Junction format
      affiliateUrl = `https://www.anrdoezrs.net/links/${config.affiliateId}/type/dlg/${originalUrl}`;
      break;

    case 'expedia':
      // Expedia Creator Program format: Base URL + affiliate slug
      // Supports: home, flights, hotels, cars, packages, activities
      const expediaAffiliateId = config.affiliateId;
      const base = `https://www.expedia.com/affiliates/${options?.campaign || 'expedia-home'}.${expediaAffiliateId}`;
      if (originalUrl && originalUrl !== '#') {
        // Append destination/product path
        affiliateUrl = `${base}${originalUrl.startsWith('/') ? originalUrl : '/' + originalUrl}`;
      } else {
        affiliateUrl = base;
      }
      break;
      
    default:
      affiliateUrl = originalUrl;
  }
  
  // Add campaign tracking if provided
  if (options?.campaign) {
    affiliateUrl += `${affiliateUrl.includes('?') ? '&' : '?'}campaign=${encodeURIComponent(options.campaign)}`;
  }
  
  return {
    originalUrl,
    affiliateUrl,
    network,
    trackingId,
  };
}

/**
 * Generate unique tracking ID for attribution
 */
function generateTrackingId(): string {
  return `lll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Track affiliate click event
 */
export function trackAffiliateClick(
  link: AffiliateLink,
  metadata?: { page: string; product: string; category: string }
): void {
  // Send to analytics
  if (typeof window !== 'undefined') {
    const eventData = {
      event: 'affiliate_click',
      tracking_id: link.trackingId,
      network: link.network,
      url: link.affiliateUrl,
      ...metadata,
      timestamp: new Date().toISOString(),
    };
    
    // Push to data layer for GTM or send to custom analytics
    (window as any).dataLayer?.push(eventData);
    
    // Store in localStorage for session tracking
    const clicks = JSON.parse(localStorage.getItem('lll_affiliate_clicks') || '[]');
    clicks.push(eventData);
    localStorage.setItem('lll_affiliate_clicks', JSON.stringify(clicks.slice(-50))); // Keep last 50
  }
}

/**
 * Pre-configured affiliate merchants for travel niche
 */
export const TRAVEL_MERCHANTS: Record<string, { name: string; networks: AffiliateNetwork[]; defaultMerchantId?: string; campaign?: string }> = {
  'away': { name: 'Away Travel', networks: ['shareasale'], defaultMerchantId: '12345' },
  'monos': { name: 'Monos Luggage', networks: ['awin'], defaultMerchantId: '67890' },
  'samsonite': { name: 'Samsonite', networks: ['cj', 'shareasale'], defaultMerchantId: '11111' },
  'travelpro': { name: 'TravelPro', networks: ['shareasale'], defaultMerchantId: '22222' },
  'amazon': { name: 'Amazon', networks: ['amazon'] },
  'booking': { name: 'Booking.com', networks: ['awin', 'cj'], defaultMerchantId: '33333' },
  'world-nomad': { name: 'World Nomads Insurance', networks: ['awin'], defaultMerchantId: '44444' },
  'allianz': { name: 'Allianz Travel Insurance', networks: ['cj'], defaultMerchantId: '55555' },
  'expedia': { name: 'Expedia', networks: ['expedia'], campaign: 'expedia-home' },
  'expedia-flights': { name: 'Expedia Flights', networks: ['expedia'], campaign: 'flights' },
  'expedia-hotels': { name: 'Expedia Hotels', networks: ['expedia'], campaign: 'hotels' },
  'expedia-cars': { name: 'Expedia Car Rentals', networks: ['expedia'], campaign: 'cars' },
  'expedia-packages': { name: 'Expedia Packages', networks: ['expedia'], campaign: 'packages' },
  'expedia-activities': { name: 'Expedia Activities', networks: ['expedia'], campaign: 'activities' },
};

/**
 * Generate merchant-specific affiliate link
 */
export function getMerchantLink(
  merchantKey: string,
  productUrl?: string,
  campaign?: string
): AffiliateLink | null {
  const merchant = TRAVEL_MERCHANTS[merchantKey];
  if (!merchant) return null;

  const url = productUrl || '#';
  return generateAffiliateLink(url, merchant.networks[0], {
    merchantId: merchant.defaultMerchantId,
    campaign: campaign || merchant.campaign,
  });
}

/**
 * cloakAffiliateLink - Create a cleaner looking redirect URL
 */
export function cloakAffiliateLink(destinationUrl: string): string {
  return `/go/${Buffer.from(destinationUrl).toString('base64url')}`;
}
