import { TemplateDefinition } from '@/types/template';
import { WEDDING_TEMPLATES } from './weddings';
import { BIRTHDAY_TEMPLATES } from './birthdays';
import { ENGAGEMENT_TEMPLATES } from './engagements';
import { ANNIVERSARY_TEMPLATES } from './anniversaries';
import { BABY_SHOWER_TEMPLATES } from './babyshowers';
import { HOUSEWARMING_TEMPLATES } from './housewarmings';
import { MUNDAN_TEMPLATES } from './mundans';
import { OTHER_TEMPLATES } from './others';

export {
  WEDDING_TEMPLATES,
  BIRTHDAY_TEMPLATES,
  ENGAGEMENT_TEMPLATES,
  ANNIVERSARY_TEMPLATES,
  BABY_SHOWER_TEMPLATES,
  HOUSEWARMING_TEMPLATES,
  MUNDAN_TEMPLATES,
  OTHER_TEMPLATES,
};

export const ALL_TEMPLATES: TemplateDefinition[] = [
  ...WEDDING_TEMPLATES,
  ...BIRTHDAY_TEMPLATES,
  ...ENGAGEMENT_TEMPLATES,
  ...ANNIVERSARY_TEMPLATES,
  ...BABY_SHOWER_TEMPLATES,
  ...HOUSEWARMING_TEMPLATES,
  ...MUNDAN_TEMPLATES,
  ...OTHER_TEMPLATES,
];
