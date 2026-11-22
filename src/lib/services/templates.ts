import { Template, EventCategory, TemplateType } from '@/types/template';
import { SAMPLE_TEMPLATES } from '@/lib/constants/templates';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface TemplateQueryOptions {
  category?: EventCategory | 'all';
  type?: TemplateType | 'all';
  language?: 'all' | 'hi' | 'en';
  search?: string;
  sortBy?: 'trending' | 'popular' | 'newest';
}

/**
 * Service to fetch templates with search and filtering.
 * Prepared for future Supabase remote catalog fetching with
 * seamless fallback to local verified dataset.
 */
export async function getTemplates(options: TemplateQueryOptions = {}): Promise<Template[]> {
  const {
    category = 'all',
    type = 'all',
    language = 'all',
    search = '',
    sortBy = 'trending',
  } = options;

  let templates: Template[] = [...SAMPLE_TEMPLATES];

  // If Supabase is connected in production, attempt to fetch from 'templates' table
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('templates').select('*');
      if (category !== 'all') {
        query = query.eq('category', category);
      }
      if (type !== 'all') {
        query = query.eq('type', type);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        templates = data as Template[];
      }
    } catch {
      // Graceful fallback to local dataset if remote table is not yet provisioned
      templates = [...SAMPLE_TEMPLATES];
    }
  }

  // Filter by category
  if (category !== 'all') {
    templates = templates.filter((t) => t.category === category);
  }

  // Filter by card/video type
  if (type !== 'all') {
    templates = templates.filter((t) => t.type === type);
  }

  // Filter by language support
  if (language !== 'all') {
    templates = templates.filter((t) => t.languageSupport.includes(language));
  }

  // Search keyword match
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    templates = templates.filter((t) => {
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchHindi = t.titleHindi?.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchTitle || matchHindi || matchDesc || matchTags;
    });
  }

  // Sorting
  if (sortBy === 'trending') {
    templates.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
  } else if (sortBy === 'popular') {
    templates.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
  } else if (sortBy === 'newest') {
    templates.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  return templates;
}

export async function getTemplateById(id: string): Promise<Template | undefined> {
  const templates = await getTemplates();
  return templates.find((t) => t.id === id);
}
