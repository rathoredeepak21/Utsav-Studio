import { DecorativeType } from '@/types/template';

export interface MotifItem {
  type: DecorativeType;
  name: string;
  nameHindi: string;
  category: 'religious' | 'royal' | 'festive' | 'ornamental';
  defaultWidth: number;
  defaultHeight: number;
  defaultColor: string;
  defaultSecondaryColor?: string;
}

export const AVAILABLE_MOTIFS: MotifItem[] = [
  // Auspicious Religious
  {
    type: 'ganesha',
    name: 'Shri Ganesha',
    nameHindi: 'श्री गणेश',
    category: 'religious',
    defaultWidth: 160,
    defaultHeight: 160,
    defaultColor: '#D4AF37',
    defaultSecondaryColor: '#BE185D',
  },
  {
    type: 'om',
    name: 'Pavitra Om',
    nameHindi: 'पवित्र ॐ',
    category: 'religious',
    defaultWidth: 140,
    defaultHeight: 140,
    defaultColor: '#D4AF37',
  },
  {
    type: 'swastik',
    name: 'Shubh Swastik',
    nameHindi: 'शुभ स्वास्तिक',
    category: 'religious',
    defaultWidth: 140,
    defaultHeight: 140,
    defaultColor: '#D4AF37',
  },
  {
    type: 'kalash',
    name: 'Mangal Kalash',
    nameHindi: 'मंगल कलश',
    category: 'religious',
    defaultWidth: 140,
    defaultHeight: 140,
    defaultColor: '#D4AF37',
    defaultSecondaryColor: '#16A34A',
  },
  {
    type: 'diya',
    name: 'Deepak / Diya',
    nameHindi: 'प्रज्वलित दीपक',
    category: 'religious',
    defaultWidth: 140,
    defaultHeight: 110,
    defaultColor: '#D4AF37',
  },
  {
    type: 'flute',
    name: 'Krishna Bansuri',
    nameHindi: 'कृष्ण बांसुरी',
    category: 'religious',
    defaultWidth: 180,
    defaultHeight: 180,
    defaultColor: '#D4AF37',
    defaultSecondaryColor: '#BE185D',
  },

  // Royal & Nature
  {
    type: 'peacock',
    name: 'Royal Mayur',
    nameHindi: 'शाही मयूर',
    category: 'royal',
    defaultWidth: 160,
    defaultHeight: 160,
    defaultColor: '#D4AF37',
    defaultSecondaryColor: '#0D9488',
  },
  {
    type: 'lotus',
    name: 'Sacred Lotus',
    nameHindi: 'कमल पुष्प',
    category: 'royal',
    defaultWidth: 150,
    defaultHeight: 100,
    defaultColor: '#E11D48',
    defaultSecondaryColor: '#D4AF37',
  },
  {
    type: 'jharokha_arch',
    name: 'Palace Jharokha Arch',
    nameHindi: 'शाही झरोखा मेहराब',
    category: 'royal',
    defaultWidth: 600,
    defaultHeight: 360,
    defaultColor: '#D4AF37',
  },
  {
    type: 'garland',
    name: 'Marigold Toran Garland',
    nameHindi: 'गेंदा तोरण पुष्पमाला',
    category: 'royal',
    defaultWidth: 500,
    defaultHeight: 100,
    defaultColor: '#F59E0B',
    defaultSecondaryColor: '#DC2626',
  },

  // Festive & Celebration
  {
    type: 'mandala',
    name: 'Ceremonial Mandala',
    nameHindi: 'मांगलिक मंडला',
    category: 'festive',
    defaultWidth: 240,
    defaultHeight: 240,
    defaultColor: '#D4AF37',
  },
  {
    type: 'rings',
    name: 'Wedding Rings',
    nameHindi: 'सगाई / विवाह अंगूठी',
    category: 'festive',
    defaultWidth: 160,
    defaultHeight: 130,
    defaultColor: '#D4AF37',
  },
  {
    type: 'cradle',
    name: 'Bal Jhula / Cradle',
    nameHindi: 'नन्हा झूला / पालना',
    category: 'festive',
    defaultWidth: 160,
    defaultHeight: 160,
    defaultColor: '#0D9488',
    defaultSecondaryColor: '#F472B6',
  },
  {
    type: 'balloons',
    name: 'Party Balloons',
    nameHindi: 'उत्सव गुब्बारे',
    category: 'festive',
    defaultWidth: 160,
    defaultHeight: 160,
    defaultColor: '#F59E0B',
  },

  // Ornamental Frames & Borders
  {
    type: 'floral_corner',
    name: 'Floral Corner Border',
    nameHindi: 'फ्लोरल कोना सजावट',
    category: 'ornamental',
    defaultWidth: 120,
    defaultHeight: 120,
    defaultColor: '#D4AF37',
    defaultSecondaryColor: '#BE185D',
  },
  {
    type: 'ornate_border',
    name: 'Ornate Full Frame',
    nameHindi: 'शाही स्वर्ण बॉर्डर फ्रेम',
    category: 'ornamental',
    defaultWidth: 980,
    defaultHeight: 1800,
    defaultColor: '#D4AF37',
  },
  {
    type: 'divider',
    name: 'Royal Filigree Divider',
    nameHindi: 'शाही डिवाइडर',
    category: 'ornamental',
    defaultWidth: 600,
    defaultHeight: 40,
    defaultColor: '#D4AF37',
  },
];

export function getMotifSvgString(
  type: DecorativeType,
  color: string = '#D4AF37',
  secondaryColor: string = '#BE185D'
): string {
  switch (type) {
    case 'ganesha':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <path d="M50 12 L55 24 L68 24 L57 32 L61 44 L50 36 L39 44 L43 32 L32 24 L45 24 Z" fill="${color}" />
        <path d="M50 26 L50 42 M46 30 Q50 36 50 42 Q50 36 54 30" stroke="${secondaryColor}" stroke-width="2" stroke-linecap="round" />
        <circle cx="50" cy="46" r="2.5" fill="${secondaryColor}" />
        <path d="M42 40 C30 38 24 46 24 56 C24 68 34 74 44 72" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round" />
        <path d="M58 40 C70 38 76 46 76 56 C76 68 66 74 56 72" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round" />
        <path d="M50 48 Q54 62 48 72 Q44 78 50 82 Q56 82 56 76 Q56 70 52 64" stroke="${color}" stroke-width="3.5" fill="none" stroke-linecap="round" />
        <circle cx="34" cy="74" r="4" fill="${color}" />
      </svg>`;

    case 'om':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <text x="50" y="70" font-size="64" font-family="serif" text-anchor="middle" font-weight="bold" fill="${color}">ॐ</text>
      </svg>`;

    case 'swastik':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="square">
        <line x1="50" y1="20" x2="50" y2="80" />
        <line x1="20" y1="50" x2="80" y2="50" />
        <polyline points="50,20 75,20" />
        <polyline points="80,50 80,75" />
        <polyline points="50,80 25,80" />
        <polyline points="20,50 20,25" />
        <circle cx="35" cy="35" r="2.5" fill="${color}" stroke="none" />
        <circle cx="65" cy="35" r="2.5" fill="${color}" stroke="none" />
        <circle cx="35" cy="65" r="2.5" fill="${color}" stroke="none" />
        <circle cx="65" cy="65" r="2.5" fill="${color}" stroke="none" />
      </svg>`;

    case 'kalash':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <ellipse cx="50" cy="32" rx="14" ry="16" fill="${color}" />
        <path d="M50 36 C38 26 30 18 28 14 C36 18 44 26 50 36 Z" fill="${secondaryColor}" />
        <path d="M50 36 C62 26 70 18 72 14 C64 18 56 26 50 36 Z" fill="${secondaryColor}" />
        <path d="M50 36 C44 20 42 12 50 8 C58 12 56 20 50 36 Z" fill="${secondaryColor}" />
        <path d="M38 42 L62 42 L66 52 C74 60 72 74 62 82 L38 82 C28 74 26 60 34 52 Z" fill="${color}" stroke="${color}" stroke-width="2" />
        <path d="M36 82 L64 82 L60 88 L40 88 Z" fill="${color}" />
        <line x1="38" y1="46" x2="62" y2="46" stroke="${secondaryColor}" stroke-width="3" />
      </svg>`;

    case 'lotus':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 65" fill="${color}">
        <path d="M50 6 C42 22 38 38 50 54 C62 38 58 22 50 6 Z" />
        <path d="M50 6 C45 25 20 28 12 46 C26 46 38 40 48 48 C49 32 46 16 50 6 Z" opacity="0.85" />
        <path d="M48 48 C32 48 18 52 6 60 C20 62 34 58 46 54 Z" opacity="0.65" />
        <path d="M50 6 C55 25 80 28 88 46 C74 46 62 40 52 48 C51 32 54 16 50 6 Z" opacity="0.85" />
        <path d="M52 48 C68 48 82 52 94 60 C80 62 66 58 54 54 Z" opacity="0.65" />
        <circle cx="50" cy="56" r="3" fill="${secondaryColor}" />
      </svg>`;

    case 'diya':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" fill="none">
        <path d="M50 6 C46 18 42 28 50 40 C58 28 54 18 50 6 Z" fill="#F59E0B" />
        <path d="M50 16 C48 24 46 30 50 38 C54 30 52 24 50 16 Z" fill="#FEF08A" />
        <path d="M20 46 C28 42 72 42 80 46 C84 58 72 70 50 70 C28 70 16 58 20 46 Z" fill="${color}" stroke="${color}" stroke-width="2" />
        <path d="M35 70 L65 70 L60 76 L40 76 Z" fill="${color}" />
      </svg>`;

    case 'peacock':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <path d="M48 30 C48 24 54 20 58 24 C62 28 60 36 54 40 C50 44 48 50 48 58 C48 66 54 74 60 78" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round" />
        <path d="M58 24 L64 25" stroke="${color}" stroke-width="2" />
        <circle cx="56" cy="24" r="1.5" fill="${secondaryColor}" />
        <path d="M56 20 L54 14 M58 20 L58 12 M60 20 L62 14" stroke="${color}" stroke-width="1.5" stroke-linecap="round" />
        <path d="M48 50 Q30 40 22 52 Q18 64 36 68 Q44 70 48 66" stroke="${color}" stroke-width="2.5" fill="none" />
        <circle cx="28" cy="56" r="3.5" fill="${secondaryColor}" />
        <circle cx="28" cy="56" r="1.5" fill="${color}" />
      </svg>`;

    case 'jharokha_arch':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" fill="none" stroke="${color}" stroke-width="3">
        <path d="M10 120 L10 60 Q10 40 30 40 Q40 40 50 30 Q60 20 80 20 Q90 10 100 2 Q110 10 120 20 Q140 20 150 30 Q160 40 170 40 Q190 40 190 60 L190 120" />
        <path d="M22 120 L22 65 Q22 48 38 48 Q46 48 56 38 Q64 30 82 30 Q91 22 100 14 Q109 22 118 30 Q136 30 144 38 Q154 48 162 48 Q178 48 178 65 L178 120" stroke-width="1.5" stroke-dasharray="3 3" />
      </svg>`;

    case 'garland':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" fill="none">
        <path d="M0 8 Q50 32 100 8 Q150 32 200 8" stroke="${color}" stroke-width="1.5" fill="none" stroke-dasharray="2 2" />
        <circle cx="35" cy="18" r="4" fill="#F59E0B" />
        <circle cx="65" cy="22" r="4" fill="#E11D48" />
        <circle cx="95" cy="18" r="4" fill="#F59E0B" />
        <circle cx="125" cy="22" r="4" fill="#E11D48" />
        <circle cx="155" cy="18" r="4" fill="#F59E0B" />
      </svg>`;

    case 'mandala':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="1.5">
        <circle cx="50" cy="50" r="45" stroke-dasharray="3 3" opacity="0.6" />
        <circle cx="50" cy="50" r="35" />
        <circle cx="50" cy="50" r="24" stroke-width="1" />
        <circle cx="50" cy="50" r="12" stroke-dasharray="2 2" />
        <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke-width="0.8" opacity="0.5" />
        <circle cx="50" cy="15" r="2.5" fill="${color}" stroke="none" />
        <circle cx="85" cy="50" r="2.5" fill="${color}" stroke="none" />
        <circle cx="50" cy="85" r="2.5" fill="${color}" stroke="none" />
        <circle cx="15" cy="50" r="2.5" fill="${color}" stroke="none" />
      </svg>`;

    case 'floral_corner':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" fill="none" stroke="${color}" stroke-width="2">
        <path d="M4 56 L4 12 Q4 4 12 4 L56 4" stroke-linecap="round" />
        <path d="M10 48 L10 16 Q10 10 16 10 L48 10" stroke-width="1" stroke-dasharray="2 2" />
        <circle cx="16" cy="16" r="3" fill="${color}" />
        <path d="M16 16 Q28 8 36 16 Q28 28 16 16" fill="${secondaryColor}" opacity="0.8" />
      </svg>`;

    case 'ornate_border':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="${color}" stroke-width="2">
        <rect x="4" y="4" width="92" height="92" rx="8" />
        <rect x="8" y="8" width="84" height="84" rx="6" stroke-width="1" stroke-dasharray="4 3" opacity="0.7" />
      </svg>`;

    case 'divider':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 24" fill="none">
        <line x1="0" y1="12" x2="85" y2="12" stroke="${color}" stroke-width="1.5" />
        <polygon points="100,2 105,9 114,12 105,15 100,22 95,15 86,12 95,9" fill="${color}" />
        <line x1="115" y1="12" x2="200" y2="12" stroke="${color}" stroke-width="1.5" />
      </svg>`;

    case 'balloons':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <path d="M40 50 Q45 75 50 90 M50 46 Q50 72 50 90 M60 50 Q55 75 50 90" stroke="#94A3B8" stroke-width="1" />
        <ellipse cx="38" cy="34" rx="14" ry="18" fill="#F43F5E" transform="rotate(-12 38 34)" />
        <ellipse cx="62" cy="34" rx="14" ry="18" fill="#0EA5E9" transform="rotate(12 62 34)" />
        <ellipse cx="50" cy="26" rx="15" ry="20" fill="${color}" />
        <polygon points="50,46 47,50 53,50" fill="${color}" />
      </svg>`;

    case 'rings':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" fill="none" stroke="${color}" stroke-width="3">
        <ellipse cx="40" cy="46" rx="18" ry="22" transform="rotate(-15 40 46)" />
        <ellipse cx="60" cy="46" rx="18" ry="22" transform="rotate(15 60 46)" />
        <polygon points="68,22 74,28 68,34 62,28" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.5" />
        <circle cx="68" cy="28" r="1.5" fill="#FFFFFF" />
      </svg>`;

    case 'cradle':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="2.5">
        <line x1="20" y1="10" x2="30" y2="45" />
        <line x1="80" y1="10" x2="70" y2="45" />
        <path d="M26 48 C26 68 74 68 74 48 Z" fill="${secondaryColor}" opacity="0.3" stroke="${color}" stroke-width="2.5" />
        <path d="M32 50 C38 58 62 58 68 50" stroke="${color}" stroke-width="2" stroke-dasharray="3 2" />
      </svg>`;

    case 'flute':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <path d="M15 75 L85 25" stroke="${color}" stroke-width="4" stroke-linecap="round" />
        <circle cx="36" cy="60" r="1.5" fill="${secondaryColor}" />
        <circle cx="43" cy="55" r="1.5" fill="${secondaryColor}" />
        <circle cx="50" cy="50" r="1.5" fill="${secondaryColor}" />
        <circle cx="57" cy="45" r="1.5" fill="${secondaryColor}" />
        <circle cx="64" cy="40" r="1.5" fill="${secondaryColor}" />
        <path d="M78 20 C84 10 94 14 90 26 C86 36 78 28 78 20 Z" fill="#0D9488" stroke="${color}" stroke-width="1" />
        <circle cx="84" cy="22" r="3" fill="#0284C7" />
        <circle cx="84" cy="22" r="1.5" fill="#F59E0B" />
      </svg>`;

    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="${color}" /></svg>`;
  }
}

export function getMotifDataUri(
  type: DecorativeType,
  color: string = '#D4AF37',
  secondaryColor: string = '#BE185D'
): string {
  const svg = getMotifSvgString(type, color, secondaryColor);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
