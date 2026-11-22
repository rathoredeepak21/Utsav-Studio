import { TemplateDefinition } from '@/types/template';
import { ALL_TEMPLATES } from '@/data/templates';

/**
 * SAMPLE_TEMPLATES provides backwards compatibility for components that consume
 * the template collection from constants. All 40 JSON-driven templates are included.
 */
export const SAMPLE_TEMPLATES: TemplateDefinition[] = ALL_TEMPLATES.map((tmpl) => ({
  ...tmpl,
  title: tmpl.name,
  titleHindi: tmpl.nameHindi,
  previewImage: tmpl.previewConfig.thumbnail || '',
  orientation: 'portrait',
}));
