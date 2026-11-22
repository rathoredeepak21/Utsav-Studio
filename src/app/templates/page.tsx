'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { TemplatePreviewModal } from '@/components/templates/TemplatePreviewModal';
import { Button } from '@/components/common/Button';
import { getTemplates } from '@/lib/services/templates';
import { Template, EventCategory, TemplateType } from '@/types/template';
import {
  Search,
  Filter,
  Sparkles,
  PlusCircle,
  X,
  FileImage,
  Video,
  Languages,
  RotateCcw,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const CATEGORIES: { label: string; labelHindi: string; value: 'all' | EventCategory }[] = [
  { label: 'All Celebrations', labelHindi: 'सभी उत्सव', value: 'all' },
  { label: 'Wedding', labelHindi: 'विवाह', value: 'wedding' },
  { label: 'Birthday', labelHindi: 'जन्मदिन', value: 'birthday' },
  { label: 'Engagement', labelHindi: 'सगाई', value: 'engagement' },
  { label: 'Anniversary', labelHindi: 'सालगिरह', value: 'anniversary' },
  { label: 'Other Events', labelHindi: 'अन्य समारोह', value: 'other' },
];

function TemplatesGalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = (searchParams.get('category') as EventCategory) || 'all';
  const initialType = (searchParams.get('type') as TemplateType) || 'all';

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | EventCategory>(initialCategory);
  const [selectedType, setSelectedType] = useState<'all' | TemplateType>(initialType);
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'hi' | 'en'>('all');
  const [sortBy, setSortBy] = useState<'trending' | 'popular' | 'newest'>('trending');

  // Preview modal state
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync state with URL params if they change
  useEffect(() => {
    const cat = searchParams.get('category') as EventCategory;
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
    }
    const t = searchParams.get('type') as TemplateType;
    if (t && t !== selectedType) {
      setSelectedType(t);
    }
  }, [searchParams]);

  // Fetch templates using service
  const fetchTemplatesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTemplates({
        category: selectedCategory,
        type: selectedType,
        language: selectedLanguage,
        search: searchQuery,
        sortBy,
      });
      setTemplates(data);
    } catch (err: unknown) {
      console.error('Failed to load templates:', err);
      setError('Could not load templates. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplatesData();
  }, [selectedCategory, selectedType, selectedLanguage, searchQuery, sortBy]);

  const handleOpenPreview = (template: Template) => {
    setPreviewTemplate(template);
    setIsModalOpen(true);
  };

  const handleClosePreview = () => {
    setIsModalOpen(false);
    setPreviewTemplate(null);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedLanguage('all');
    setSortBy('trending');
    router.push('/templates');
  };

  return (
    <div className="py-12 bg-ivory-50 min-h-screen">
      <Container>
        <SectionHeading
          badge="Complete Collection"
          badgeHindi="संपूर्ण टेम्पलेट गैलरी"
          title="Digital Invitation Templates"
          titleHindi="अपनी खुशियों के लिए चुनें मनपसंद निमंत्रण पत्र"
          subtitle="Explore 100% free wedding cards, birthday reels, and festive ceremony invitations. No watermark, instant customization."
        />

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gold-200/80 shadow-card-warm mb-10 space-y-5">
          {/* Top Row: Search and Format Toggles */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="lg:col-span-7 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search templates (e.g. Royal Vivah, Haldi, Safari, Griha Pravesh)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-full bg-ivory-50 border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent text-sm placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Type Selector (Cards / Videos / All) */}
            <div className="lg:col-span-5 flex items-center justify-end bg-ivory-100 p-1 rounded-full border border-gold-200/60">
              <button
                onClick={() => setSelectedType('all')}
                className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all text-center ${
                  selectedType === 'all'
                    ? 'bg-royal-800 text-white shadow-sm'
                    : 'text-stone-700 hover:text-royal-950'
                }`}
              >
                All Formats
              </button>
              <button
                onClick={() => setSelectedType('card')}
                className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1 ${
                  selectedType === 'card'
                    ? 'bg-royal-800 text-white shadow-sm'
                    : 'text-stone-700 hover:text-royal-950'
                }`}
              >
                <FileImage className="w-3.5 h-3.5" />
                Cards (कार्ड)
              </button>
              <button
                onClick={() => setSelectedType('video')}
                className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1 ${
                  selectedType === 'video'
                    ? 'bg-royal-800 text-white shadow-sm'
                    : 'text-stone-700 hover:text-royal-950'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                Videos (वीडियो)
              </button>
            </div>
          </div>

          {/* Middle Row: Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 no-scrollbar border-t border-stone-100">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-magenta-700 text-white shadow-sm font-semibold'
                    : 'bg-ivory-50 text-stone-700 hover:bg-ivory-200 border border-gold-200/70'
                }`}
              >
                {cat.label} <span className="font-hindi opacity-90">({cat.labelHindi})</span>
              </button>
            ))}
          </div>

          {/* Bottom Row: Language & Sort Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-100 text-xs">
            {/* Language filter */}
            <div className="flex items-center space-x-2">
              <span className="text-stone-500 font-medium flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-gold-600" />
                Language:
              </span>
              <div className="inline-flex rounded-lg border border-stone-200 bg-ivory-50 p-0.5">
                <button
                  onClick={() => setSelectedLanguage('all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                    selectedLanguage === 'all' ? 'bg-royal-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedLanguage('hi')}
                  className={`px-2.5 py-1 rounded-md text-xs font-hindi ${
                    selectedLanguage === 'hi' ? 'bg-royal-800 text-white shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  हिंदी / Bilingual
                </button>
                <button
                  onClick={() => setSelectedLanguage('en')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                    selectedLanguage === 'en' ? 'bg-royal-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-stone-500 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'trending' | 'popular' | 'newest')}
                className="bg-ivory-50 border border-gold-200 rounded-lg px-3 py-1.5 text-xs text-stone-700 font-semibold focus:outline-none focus:ring-1 focus:ring-gold-400"
              >
                <option value="trending">Trending Now</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newly Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <p className="text-stone-600 text-sm font-medium">
            Showing <span className="font-bold text-royal-950">{templates.length}</span> free templates
            {selectedCategory !== 'all' && (
              <span className="capitalize ml-1 text-magenta-700">in {selectedCategory}</span>
            )}
            {selectedType !== 'all' && (
              <span className="capitalize ml-1 text-royal-800">({selectedType}s)</span>
            )}
          </p>

          <div className="flex items-center gap-3">
            {(selectedCategory !== 'all' || selectedType !== 'all' || selectedLanguage !== 'all' || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-700 hover:text-rose-900 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}

            <Button href="/card-editor" variant="outline" size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Start Blank Canvas
            </Button>
          </div>
        </div>

        {/* Loading State: Skeleton Cards */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl overflow-hidden border border-gold-200/60 p-4 space-y-4 animate-pulse shadow-sm"
              >
                <div className="aspect-[9/16] bg-ivory-200 rounded-2xl w-full" />
                <div className="h-4 bg-ivory-200 rounded w-3/4" />
                <div className="h-3 bg-ivory-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-16 bg-white rounded-3xl border border-rose-200 p-8 max-w-lg mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-royal-950 mb-2">
              Unable to Load Templates
            </h3>
            <p className="text-stone-600 text-sm mb-6">{error}</p>
            <Button onClick={fetchTemplatesData} variant="primary" size="md">
              Try Again
            </Button>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && templates.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {templates.map((template, idx) => (
              <TemplateCard
                key={template.id}
                template={template}
                priority={idx < 3}
                onPreview={handleOpenPreview}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && templates.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gold-200/70 p-8 max-w-xl mx-auto shadow-card-warm">
            <div className="w-16 h-16 rounded-full bg-gold-50 border border-gold-300 flex items-center justify-center mx-auto text-gold-600 mb-4 shadow-sm">
              <Search className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-royal-950 mb-2">
              No matching templates found
            </h3>
            <p className="font-hindi text-magenta-700 text-base mb-2">
              आपके खोज परिणाम के अनुसार कोई डिज़ाइन नहीं मिला।
            </p>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              Try adjusting your search terms or clearing your filters to see our full festive collection.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button onClick={resetFilters} variant="gold" size="md">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All Filters
              </Button>
              <Button href="/card-editor" variant="outline" size="md">
                <PlusCircle className="w-4 h-4 mr-2" />
                Start with Blank Canvas
              </Button>
            </div>
          </div>
        )}

        {/* Interactive Template Preview Modal */}
        <TemplatePreviewModal
          template={previewTemplate}
          isOpen={isModalOpen}
          onClose={handleClosePreview}
        />
      </Container>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory-50 flex items-center justify-center">
          <p className="font-serif text-royal-950 text-lg">Loading Gallery...</p>
        </div>
      }
    >
      <TemplatesGalleryContent />
    </Suspense>
  );
}
