export type EventCategory =
  | 'wedding'
  | 'birthday'
  | 'engagement'
  | 'anniversary'
  | 'baby-shower'
  | 'housewarming'
  | 'mundan'
  | 'other';

export type TemplateType = 'card' | 'video';

export type TextRole =
  | 'shloka'
  | 'title'
  | 'subtitle'
  | 'hosts'
  | 'primary_names'
  | 'secondary_names'
  | 'date_time'
  | 'venue'
  | 'rsvp'
  | 'ceremony_schedule'
  | 'footer_blessing';

export type DecorativeType =
  | 'ganesha'
  | 'om'
  | 'swastik'
  | 'kalash'
  | 'lotus'
  | 'diya'
  | 'peacock'
  | 'jharokha_arch'
  | 'garland'
  | 'mandala'
  | 'floral_corner'
  | 'ornate_border'
  | 'divider'
  | 'balloons'
  | 'rings'
  | 'cradle'
  | 'flute';

export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'pattern';
  color?: string;
  gradient?: {
    type: 'linear' | 'radial';
    from: string;
    via?: string;
    to: string;
    angle?: number;
  };
  pattern?: 'mandala' | 'dots' | 'damask' | 'gold_dust' | 'none';
  patternOpacity?: number;
}

export interface DecorativeElement {
  id: string;
  type: DecorativeType;
  x: number; // percentage (0-100) or pixel in 1080x1920
  y: number;
  width: number;
  height: number;
  color?: string;
  secondaryColor?: string;
  opacity?: number;
  rotation?: number;
  zIndex: number;
  animation?: 'pulse' | 'spin_slow' | 'float' | 'none';
}

export interface TextElement {
  id: string;
  role: TextRole;
  content: string;
  contentHindi?: string;
  x: number; // 0 to 1080 coordinate
  y: number; // 0 to 1920 coordinate
  width: number;
  height?: number;
  fontSize: number; // base pixel at 1080 width
  fontFamily: 'serif' | 'display' | 'hindi' | 'sans' | 'cursive';
  color: string;
  align: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  textTransform?: 'uppercase' | 'capitalize' | 'none';
  textShadow?: string;
  zIndex: number;
  isEditable: boolean;
}

export interface ImagePlaceholder {
  id: string;
  role: 'couple_photo' | 'baby_photo' | 'portrait' | 'family_photo';
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'rect' | 'circle' | 'arch' | 'oval';
  borderWidth?: number;
  borderColor?: string;
  zIndex: number;
  isEditable: boolean;
  placeholderSrc?: string;
  cloudinaryPublicId?: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  nameHindi: string;
  // Optional backwards compatibility aliases
  title?: string;
  titleHindi?: string;
  previewImage?: string;
  orientation?: 'portrait' | 'landscape';
  slug: string;
  category: EventCategory;
  type: TemplateType;
  languageSupport: ('en' | 'hi')[];
  defaultLanguage: 'en' | 'hi';
  dimensions: { width: number; height: number };
  aspectRatio: '9:16';
  description: string;
  descriptionHindi: string;
  tags: string[];
  theme: string;
  colorScheme: string[];
  fonts: string[];
  background: BackgroundConfig;
  decorations: DecorativeElement[];
  texts: TextElement[];
  placeholders: ImagePlaceholder[];
  layerOrder?: string[];
  editableFields: string[];
  previewConfig: {
    thumbnail?: string;
    cloudinaryPublicId?: string;
    accentColor: string;
    musicTrack?: string;
    durationSeconds?: number;
  };
  isPopular?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
}

// Backwards compatibility alias for components that import Template
export type Template = TemplateDefinition;
