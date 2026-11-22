import { TemplateDefinition, EventCategory, TemplateType } from '@/types/template';
import { ALL_TEMPLATES } from '@/data/templates';

export interface TemplateQueryOptions {
  category?: EventCategory | 'all';
  type?: TemplateType | 'all';
  language?: 'all' | 'en' | 'hi';
  searchQuery?: string;
  sortBy?: 'popular' | 'newest' | 'trending' | 'name-asc';
  onlyFavorites?: boolean;
  favoriteIds?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Cloudinary asset URL builder.
 * Safe for client-side execution (only uses public cloud name, zero API secrets).
 */
export function getCloudinaryAssetUrl(
  publicId?: string,
  options: { width?: number; height?: number; crop?: string; quality?: string } = {}
): string {
  if (!publicId) return '';
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return publicId;
  }
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utsav-studio';
  const transformations: string[] = ['f_auto'];
  if (options.quality) transformations.push(`q_${options.quality}`);
  else transformations.push('q_auto');
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);

  const transformString = transformations.join(',');
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
}

/**
 * Template Repository Interface for future Supabase / Database interchangeability.
 */
export interface ITemplateRepository {
  getAllTemplates(): Promise<TemplateDefinition[]>;
  getTemplates(options?: TemplateQueryOptions): Promise<TemplateDefinition[]>;
  getTemplateById(id: string): Promise<TemplateDefinition | null>;
  getTemplatesByCategory(category: EventCategory): Promise<TemplateDefinition[]>;
  getFeaturedTemplates(limit?: number): Promise<TemplateDefinition[]>;
}

/**
 * Local JSON + Ready-for-Supabase Template Repository
 */
class LocalTemplateRepository implements ITemplateRepository {
  private templates: TemplateDefinition[] = ALL_TEMPLATES;

  /**
   * Returns all static templates (or queries Supabase when SUPABASE_URL configured)
   */
  async getAllTemplates(): Promise<TemplateDefinition[]> {
    return this.templates;
  }

  /**
   * Filters and sorts templates based on query criteria
   */
  async getTemplates(options: TemplateQueryOptions = {}): Promise<TemplateDefinition[]> {
    const {
      category = 'all',
      type = 'all',
      language = 'all',
      searchQuery = '',
      sortBy = 'popular',
      onlyFavorites = false,
      favoriteIds = [],
      limit,
      offset = 0,
    } = options;

    let filtered = [...this.templates];

    // Favorites filter
    if (onlyFavorites) {
      const favSet = new Set(favoriteIds);
      filtered = filtered.filter((t) => favSet.has(t.id));
    }

    // Category filter
    if (category !== 'all') {
      filtered = filtered.filter((t) => t.category === category);
    }

    // Format (Card / Video) filter
    if (type !== 'all') {
      filtered = filtered.filter((t) => t.type === type);
    }

    // Language filter
    if (language !== 'all') {
      filtered = filtered.filter((t) => t.languageSupport.includes(language));
    }

    // Search query filter (matches English name, Hindi name, tags, description, theme)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((t) => {
        return (
          t.name.toLowerCase().includes(query) ||
          t.nameHindi.includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.descriptionHindi.includes(query) ||
          t.theme.toLowerCase().includes(query) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'trending') {
        if (a.isTrending && !b.isTrending) return -1;
        if (!a.isTrending && b.isTrending) return 1;
      }
      if (sortBy === 'newest') {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      // default: 'popular'
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return 0;
    });

    // Pagination slice
    if (limit) {
      return filtered.slice(offset, offset + limit);
    }

    return filtered;
  }

  /**
   * Retrieves single template by its unique ID
   */
  async getTemplateById(id: string): Promise<TemplateDefinition | null> {
    const template = this.templates.find((t) => t.id === id);
    return template || null;
  }

  /**
   * Retrieves templates for a specific celebration category
   */
  async getTemplatesByCategory(category: EventCategory): Promise<TemplateDefinition[]> {
    return this.templates.filter((t) => t.category === category);
  }

  /**
   * Retrieves featured templates for home and hero showcases
   */
  async getFeaturedTemplates(limit: number = 6): Promise<TemplateDefinition[]> {
    const featured = this.templates.filter((t) => t.isPopular || t.isTrending);
    return featured.slice(0, limit);
  }
}

// Singleton repository export
export const templateRepository = new LocalTemplateRepository();

// Direct convenience function exports
export const getTemplates = (opts?: TemplateQueryOptions) => templateRepository.getTemplates(opts);
export const getTemplateById = (id: string) => templateRepository.getTemplateById(id);
export const getTemplatesByCategory = (category: EventCategory) => templateRepository.getTemplatesByCategory(category);
export const getFeaturedTemplates = (limit?: number) => templateRepository.getFeaturedTemplates(limit);
