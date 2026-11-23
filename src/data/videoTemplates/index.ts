import { TemplateDefinition } from '@/types/template';
import { WEDDING_VIDEO_TEMPLATES } from './weddings';
import { CEREMONIES_VIDEO_TEMPLATES } from './ceremonies';
import { CELEBRATIONS_VIDEO_TEMPLATES } from './celebrations';

export {
  WEDDING_VIDEO_TEMPLATES,
  CEREMONIES_VIDEO_TEMPLATES,
  CELEBRATIONS_VIDEO_TEMPLATES,
};

export const ALL_VIDEO_TEMPLATES: TemplateDefinition[] = [
  ...WEDDING_VIDEO_TEMPLATES,
  ...CEREMONIES_VIDEO_TEMPLATES,
  ...CELEBRATIONS_VIDEO_TEMPLATES,
];

export const VIDEO_TEMPLATES_BY_ID = new Map<string, TemplateDefinition>(
  ALL_VIDEO_TEMPLATES.map((t) => [t.id, t])
);

export function getVideoTemplateById(id: string): TemplateDefinition | undefined {
  return VIDEO_TEMPLATES_BY_ID.get(id);
}
