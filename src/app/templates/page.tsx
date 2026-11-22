'use client';

import React, { useState, useMemo } from 'react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { Button } from '@/components/common/Button';
import { SAMPLE_TEMPLATES } from '@/lib/constants/templates';
import { EventCategory, TemplateType } from '@/types/template';
import { Search, Filter, Sparkles, PlusCircle } from 'lucide-react';

const CATEGORIES: { label: string; labelHindi: string; value: 'all' | EventCategory }[] = [
  { label: 'All Celebrations', labelHindi: 'सभी उत्सव', value: 'all' },
  { label: 'Wedding', labelHindi: 'विवाह', value: 'wedding' },
  { label: 'Birthday', labelHindi: 'जन्मदिन', value: 'birthday' },
  { label: 'Engagement', labelHindi: 'सगाई', value: 'engagement' },
  { label: 'Anniversary', labelHindi: 'सालगिरह', value: 'anniversary' },
  { label: 'Other Events', labelHindi: 'अन्य समारोह', value: 'other' },
];

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | EventCategory>('all');
  const [selectedType, setSelectedType] = useState<'all' | TemplateType>('all');

  const filteredTemplates = useMemo(() => {
    return SAMPLE_TEMPLATES.filter((template) => {
      // Category filter
      if (selectedCategory !== 'all' && template.category !== selectedCategory) {
        return false;
      }
      // Type filter
      if (selectedType !== 'all' && template.type !== selectedType) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = template.title.toLowerCase().includes(query);
        const matchesHindi = template.titleHindi?.toLowerCase().includes(query);
        const matchesDescription = template.description.toLowerCase().includes(query);
        const matchesTags = template.tags.some((tag) => tag.toLowerCase().includes(query));
        return matchesTitle || matchesHindi || matchesDescription || matchesTags;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedType]);

  return (
    <div className="py-12 bg-ivory-50 min-h-screen">
      <Container>
        <SectionHeading
          badge="Invitation Gallery"
          badgeHindi="टेम्पलेट गैलरी"
          title="Explore Beautiful Invitation Templates"
          titleHindi="अपनी पसंद का डिजिटल निमंत्रण चुनें"
          subtitle="All designs are 100% free forever, without watermarks or hidden charges. Customize online in minutes."
        />

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 rounded-3xl border border-gold-200/80 shadow-card-warm mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search templates (e.g. Royal Vivah, Haldi, Safari Birthday, Griha Pravesh)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-ivory-50 border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent text-sm placeholder:text-stone-400"
              />
            </div>

            {/* Type Selector (Cards / Videos / All) */}
            <div className="md:col-span-4 flex items-center justify-end bg-ivory-100 p-1 rounded-full border border-gold-200/60">
              <button
                onClick={() => setSelectedType('all')}
                className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
                  selectedType === 'all'
                    ? 'bg-royal-800 text-white shadow-sm'
                    : 'text-stone-700 hover:text-royal-950'
                }`}
              >
                All Formats
              </button>
              <button
                onClick={() => setSelectedType('card')}
                className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
                  selectedType === 'card'
                    ? 'bg-royal-800 text-white shadow-sm'
                    : 'text-stone-700 hover:text-royal-950'
                }`}
              >
                Cards (कार्ड)
              </button>
              <button
                onClick={() => setSelectedType('video')}
                className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
                  selectedType === 'video'
                    ? 'bg-royal-800 text-white shadow-sm'
                    : 'text-stone-700 hover:text-royal-950'
                }`}
              >
                Videos (वीडियो)
              </button>
            </div>
          </div>

          {/* Category Tabs */}
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
        </div>

        {/* Results Counter & Blank Canvas CTA */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-stone-600 text-sm font-medium">
            Showing <span className="font-bold text-royal-950">{filteredTemplates.length}</span> free templates
          </p>

          <Button href="/card-editor" variant="outline" size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Start Blank Canvas
          </Button>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gold-200/60 p-8">
            <p className="font-serif text-xl font-bold text-royal-950 mb-2">
              No matching templates found
            </p>
            <p className="font-hindi text-magenta-700 text-sm mb-6">
              आपके खोज परिणाम के अनुसार कोई डिज़ाइन नहीं मिला।
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedType('all');
              }}
              variant="gold"
              size="md"
            >
              Reset Filters (फ़िल्टर रीसेट करें)
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
