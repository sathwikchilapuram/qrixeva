import { QRType, QRCustomization } from '@/types';
import { QR_TEMPLATES } from './store';

export interface AIRecommendation {
  recommendedType: QRType;
  title: string;
  reasoning: string;
  suggestedFields: { key: string; label: string; placeholder: string; required: boolean }[];
  suggestedTemplateId: string;
  customizationTips: string[];
  initialContent: Record<string, any>;
}

/**
 * Intelligent recommendation parser simulating AI intent analysis
 */
export async function analyzeQRIntent(userPrompt: string): Promise<AIRecommendation> {
  const promptLower = userPrompt.toLowerCase();

  // 1. Restaurant / Food / Menu
  if (promptLower.includes('restaurant') || promptLower.includes('menu') || promptLower.includes('food') || promptLower.includes('bistro') || promptLower.includes('cafe')) {
    return {
      recommendedType: 'menu',
      title: 'Digital Restaurant Menu QR',
      reasoning: 'Ideal for dining venues. Customers can scan to instantly browse your live food menu, prices, and chef specials without touch points.',
      suggestedFields: [
        { key: 'restaurantName', label: 'Restaurant Name', placeholder: 'e.g. Bella Vista Bistro', required: true },
        { key: 'tagline', label: 'Cuisine / Tagline', placeholder: 'e.g. Fine Italian Dining & Seafood', required: false },
        { key: 'address', label: 'Physical Address', placeholder: 'e.g. 123 Main St, San Francisco', required: true },
        { key: 'phone', label: 'Reservation Phone', placeholder: 'e.g. +1 (415) 555-0199', required: false },
      ],
      suggestedTemplateId: 'tpl-2',
      customizationTips: [
        'Use warm amber or earthy tones to stimulate appetite.',
        'Use the scanner frame with "SCAN FOR MENU" badge.',
        'Select the "leaf" eye pattern for an organic culinary feel.',
      ],
      initialContent: {
        restaurantName: 'Bella Vista Bistro',
        tagline: 'Authentic Culinary Delights',
        address: '500 Market St, San Francisco, CA',
        phone: '+1 (415) 555-0199',
        categories: [
          { name: 'Starters', items: [{ title: 'Artisan Garlic Bread', price: '$12', desc: 'Freshly baked herbs & garlic' }] }
        ]
      }
    };
  }

  // 2. Resume / CV / Job Search
  if (promptLower.includes('resume') || promptLower.includes('cv') || promptLower.includes('job') || promptLower.includes('career') || promptLower.includes('recruiter')) {
    return {
      recommendedType: 'resume',
      title: 'Interactive Executive Resume QR',
      reasoning: 'Perfect for recruiters and networking. Combines your digital profile, key achievements, portfolio links, and 1-click PDF download.',
      suggestedFields: [
        { key: 'name', label: 'Full Name', placeholder: 'e.g. Alex Rivera', required: true },
        { key: 'title', label: 'Professional Title', placeholder: 'e.g. Senior Software Architect', required: true },
        { key: 'bio', label: 'Executive Bio', placeholder: 'Brief summary of your expertise...', required: true },
        { key: 'resumeUrl', label: 'Resume PDF Link', placeholder: 'https://...', required: false },
      ],
      suggestedTemplateId: 'tpl-1',
      customizationTips: [
        'Use dark indigo or violet accent color for modern corporate confidence.',
        'Set frame text to "SCAN FOR RESUME".',
        'Upload your LinkedIn avatar for personalized branding.',
      ],
      initialContent: {
        name: 'Alex Rivera',
        title: 'Senior Software Architect',
        bio: 'Passionate about building scalable distributed web applications.',
        resumeUrl: 'https://qrixeva.vercel.app/demo-resume.pdf',
      }
    };
  }

  // 3. Event / Conference / Wedding
  if (promptLower.includes('event') || promptLower.includes('conference') || promptLower.includes('pass') || promptLower.includes('ticket') || promptLower.includes('wedding')) {
    return {
      recommendedType: 'event',
      title: 'Digital Event Access Pass QR',
      reasoning: 'Enables seamless event check-ins, schedule viewing, venue location navigation, and VIP ticket verification.',
      suggestedFields: [
        { key: 'eventName', label: 'Event Name', placeholder: 'e.g. Tech Vision Summit 2026', required: true },
        { key: 'date', label: 'Date & Time', placeholder: 'e.g. Nov 12, 2026 at 9:00 AM', required: true },
        { key: 'location', label: 'Venue Location', placeholder: 'e.g. Moscone Center, SF', required: true },
        { key: 'organizer', label: 'Host / Organizer', placeholder: 'e.g. Innovation Labs', required: false },
      ],
      suggestedTemplateId: 'tpl-4',
      customizationTips: [
        'Use vibrant cyan gradient with dot pattern for tech vibe.',
        'Enable password protection for exclusive VIP passes.',
        'Set expiration date to automatically deactivate after event completion.',
      ],
      initialContent: {
        eventName: 'Global Tech Vision Summit 2026',
        date: 'November 12-14, 2026',
        location: 'Moscone Center, San Francisco',
        organizer: 'NextGen AI Council',
      }
    };
  }

  // 4. File / PDF / Document / Presentation
  if (promptLower.includes('pdf') || promptLower.includes('file') || promptLower.includes('document') || promptLower.includes('slides') || promptLower.includes('presentation')) {
    return {
      recommendedType: 'file',
      title: 'Cloud Document Sharing QR',
      reasoning: 'Share large PDFs, decks, or ZIP archives effortlessly without cluttering email attachments or print media.',
      suggestedFields: [
        { key: 'fileName', label: 'Document Name', placeholder: 'e.g. Project_Proposal_v2.pdf', required: true },
        { key: 'storageUrl', label: 'File URL', placeholder: 'https://...', required: true },
      ],
      suggestedTemplateId: 'tpl-3',
      customizationTips: [
        'Use high contrast monochrome pattern for guaranteed scannability on paper.',
        'Track total file download counts in your analytics dashboard.',
      ],
      initialContent: {
        fileName: 'Project_Specification_2026.pdf',
        fileSize: '3.4 MB',
        fileType: 'PDF Document',
        storageUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      }
    };
  }

  // 5. Default / Profile / Multi-link / Business
  return {
    recommendedType: 'profile',
    title: 'Universal Digital Bio & Contact Hub',
    reasoning: 'Consolidate all your digital touchpoints (website, social profiles, contact info, portfolio) into one dynamic bio link.',
    suggestedFields: [
      { key: 'name', label: 'Full Name / Brand Name', placeholder: 'e.g. Qrixeva Enterprise', required: true },
      { key: 'bio', label: 'Short Description', placeholder: 'Brief overview...', required: true },
      { key: 'phone', label: 'Contact Phone', placeholder: '+1 (555) 000-0000', required: false },
    ],
    suggestedTemplateId: 'tpl-1',
    customizationTips: [
      'Add a logo to the center of your QR code.',
      'Enable dynamic mode so you can update destination links anytime.',
    ],
    initialContent: {
      name: 'Alex Rivera',
      bio: 'Digital Architect & Creator',
    }
  };
}
