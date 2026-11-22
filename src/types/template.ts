export type EventCategory =
  | 'wedding'
  | 'birthday'
  | 'engagement'
  | 'anniversary'
  | 'baby-shower'
  | 'housewarming'
  | 'religious'
  | 'other';

export type TemplateType = 'card' | 'video';

export interface Template {
  id: string;
  title: string;
  titleHindi?: string;
  slug: string;
  category: EventCategory;
  type: TemplateType;
  previewImage: string;
  description: string;
  tags: string[];
  isNew?: boolean;
  isTrending?: boolean;
  isPopular?: boolean;
  orientation: 'portrait' | 'landscape' | 'square';
  dimensions: { width: number; height: number };
  colorScheme: string[];
  languageSupport: ('en' | 'hi')[];
}
