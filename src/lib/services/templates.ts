import { TemplateDefinition, EventCategory, TemplateType } from '@/types/template';
import { templateRepository, TemplateQueryOptions as RepoQueryOptions } from '@/lib/repositories/templateRepository';

export interface TemplateQueryOptions {
  category?: EventCategory | 'all';
  type?: TemplateType | 'all';
  language?: 'all' | 'hi' | 'en';
  search?: string;
  sortBy?: 'trending' | 'popular' | 'newest' | 'name-asc';
  onlyFavorites?: boolean;
  favoriteIds?: string[];
}

/**
 * Service to fetch templates with search, filtering, and local favorites.
 * Integrates with template repository and is pre-configured for Supabase data fetching.
 */
export async function getTemplates(options: TemplateQueryOptions = {}): Promise<TemplateDefinition[]> {
  const repoOptions: RepoQueryOptions = {
    category: options.category,
    type: options.type,
    language: options.language,
    searchQuery: options.search,
    sortBy: options.sortBy,
    onlyFavorites: options.onlyFavorites,
    favoriteIds: options.favoriteIds,
  };

  return templateRepository.getTemplates(repoOptions);
}

export async function getTemplateById(id: string): Promise<TemplateDefinition | null> {
  return templateRepository.getTemplateById(id);
}
