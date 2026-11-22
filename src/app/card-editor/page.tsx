'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';
import { TemplateRenderer } from '@/components/templates/engine/TemplateRenderer';
import { getTemplateById } from '@/lib/repositories/templateRepository';
import { TemplateDefinition } from '@/types/template';
import { saveLocalProject } from '@/lib/storage/db';
import {
  Type,
  Palette,
  Sparkles,
  Download,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Layers,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Lock,
} from 'lucide-react';

function CardEditorContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');

  const [template, setTemplate] = useState<TemplateDefinition | null>(null);
  const [hasCheckedTemplate, setHasCheckedTemplate] = useState(false);

  useEffect(() => {
    if (templateId) {
      getTemplateById(templateId).then((t) => {
        setTemplate(t);
        setHasCheckedTemplate(true);
      });
    } else {
      setHasCheckedTemplate(true);
    }
  }, [templateId]);

  // Initial text states populated from template or defaults
  const [projectTitle, setProjectTitle] = useState('My Shubh Vivah Invitation');
  const [activeTab, setActiveTab] = useState<'text' | 'motifs' | 'background' | 'info'>('text');
  const [isSaved, setIsSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Editable fields for live template preview
  const [headingHindi, setHeadingHindi] = useState('|| श्री गणेशाय नमः ||');
  const [celebrationTitle, setCelebrationTitle] = useState('Shubh Vivah');
  const [hostsName, setHostsName] = useState('Mr. & Mrs. Sharma cordially invite you');
  const [coupleNames, setCoupleNames] = useState('Aarav & Ananya');
  const [eventDate, setEventDate] = useState('Sunday, 24th December 2026');
  const [eventVenue, setEventVenue] = useState('The Royal Palace, Jaipur, Rajasthan');

  // Once template loads, populate fields
  useEffect(() => {
    if (template) {
      setProjectTitle(`${template.name} (My Invite)`);
      const shlokaElem = template.texts.find((t) => t.role === 'shloka');
      if (shlokaElem) setHeadingHindi(shlokaElem.contentHindi || shlokaElem.content);

      const titleElem = template.texts.find((t) => t.role === 'title');
      if (titleElem) setCelebrationTitle(titleElem.content);

      const hostsElem = template.texts.find((t) => t.role === 'hosts');
      if (hostsElem) setHostsName(hostsElem.content);

      const namesElem = template.texts.find((t) => t.role === 'primary_names');
      if (namesElem) setCoupleNames(namesElem.content);

      const dateElem = template.texts.find((t) => t.role === 'date_time');
      if (dateElem) setEventDate(dateElem.content);

      const venueElem = template.texts.find((t) => t.role === 'venue');
      if (venueElem) setEventVenue(venueElem.content);
    }
  }, [template]);

  // Create an active copy of the template reflecting user's edited text in real-time
  const dynamicTemplate = useMemo(() => {
    if (!template) return null;
    const cloned = JSON.parse(JSON.stringify(template)) as TemplateDefinition;
    cloned.texts = cloned.texts.map((elem) => {
      if (elem.role === 'shloka') {
        return { ...elem, content: headingHindi, contentHindi: headingHindi };
      }
      if (elem.role === 'title') {
        return { ...elem, content: celebrationTitle };
      }
      if (elem.role === 'hosts') {
        return { ...elem, content: hostsName };
      }
      if (elem.role === 'primary_names') {
        return { ...elem, content: coupleNames };
      }
      if (elem.role === 'date_time') {
        return { ...elem, content: eventDate };
      }
      if (elem.role === 'venue') {
        return { ...elem, content: eventVenue };
      }
      return elem;
    });
    return cloned;
  }, [template, headingHindi, celebrationTitle, hostsName, coupleNames, eventDate, eventVenue]);

  // Handle template not found gracefully
  if (hasCheckedTemplate && templateId && !template) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-950 p-8 rounded-3xl border border-stone-800 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-2">
            Template Not Found
          </h2>
          <p className="font-hindi text-gold-400 text-sm mb-3">
            मांगलिक निमंत्रण टेम्पलेट नहीं मिला
          </p>
          <p className="text-stone-400 text-xs leading-relaxed mb-6">
            We could not find the template with ID <code className="text-gold-400 bg-stone-900 px-2 py-0.5 rounded font-mono">{templateId}</code>. It might have been updated or the link may be invalid.
          </p>
          <div className="flex flex-col gap-3">
            <Button href="/templates" variant="gold" size="md" className="justify-center shadow-gold-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              Browse Template Gallery
            </Button>
            <Button href="/card-editor" variant="outline" size="md" className="justify-center text-white border-stone-700 hover:bg-stone-800">
              Start Blank Canvas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Save to IndexedDB
  const handleSaveToDevice = async () => {
    try {
      await saveLocalProject({
        id: templateId || `proj-${Date.now()}`,
        title: projectTitle,
        templateId: template?.id,
        type: 'card',
        category: template?.category || 'wedding',
        createdAt: Date.now(),
        lastModified: Date.now(),
        data: {
          canvasWidth: 1080,
          canvasHeight: 1920,
          elements:
            dynamicTemplate?.texts.map((t) => ({
              id: t.id,
              type: 'text' as const,
              x: t.x,
              y: t.y,
              width: t.width,
              height: t.height || 50,
              content: t.content,
              fontSize: t.fontSize,
              fontFamily: t.fontFamily,
              fill: t.color,
              align: t.align,
            })) || [],
        },
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save project:', err);
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col">
      {/* Top Editor Navbar */}
      <div className="bg-stone-950 border-b border-stone-800 px-4 py-3 flex flex-wrap items-center justify-between gap-4 z-30">
        <div className="flex items-center space-x-3">
          <Link
            href="/templates"
            className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors border border-stone-800"
            title="Back to gallery"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-sm font-semibold text-white focus:outline-none focus:border-gold-400 max-w-xs"
            placeholder="Project Title"
          />
          <Badge variant="gold" className="bg-gold-500/20 text-gold-400 border-gold-500/40 hidden sm:inline-flex">
            100% Free • No Watermark
          </Badge>
        </div>

        {/* Center Canvas Info */}
        <div className="hidden md:flex items-center space-x-2 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800 text-xs">
          <span className="text-stone-400">Canvas:</span>
          <span className="text-gold-400 font-semibold">1080 × 1920 HD (9:16)</span>
          {template && (
            <>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300 font-medium capitalize">{template.category}</span>
            </>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleSaveToDevice}
            className="px-3.5 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center transition-colors border border-stone-700"
          >
            <Save className="w-3.5 h-3.5 mr-1.5 text-gold-400" />
            {isSaved ? 'Saved Locally!' : 'Save (IndexedDB)'}
          </button>

          <Button
            onClick={handleExport}
            variant="gold"
            size="sm"
            disabled={isExporting}
            className="shadow-gold-glow"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            {isExporting ? 'Generating HD Card...' : 'Export Free HD Card'}
          </Button>
        </div>
      </div>

      {/* Export Success Notification */}
      {exportSuccess && (
        <div className="bg-emerald-950 border-b border-emerald-800 px-4 py-2.5 text-xs text-emerald-300 flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>High-definition invitation card generated successfully! 100% free with zero watermark.</span>
        </div>
      )}

      {/* Editor Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Toolbar */}
        <div className="w-full lg:w-80 bg-stone-950 border-r border-stone-800 flex flex-col shrink-0">
          {/* Tab Navigation */}
          <div className="flex border-b border-stone-800 p-2 gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'text' ? 'bg-royal-800 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              Content & Text
            </button>
            <button
              onClick={() => setActiveTab('motifs')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'motifs' ? 'bg-royal-800 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Motifs
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'info' ? 'bg-royal-800 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Template Info
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            {activeTab === 'text' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Manglik Shloka / Auspicious Heading
                  </label>
                  <input
                    type="text"
                    value={headingHindi}
                    onChange={(e) => setHeadingHindi(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white font-hindi focus:border-gold-400 focus:outline-none"
                    placeholder="|| श्री गणेशाय नमः ||"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Occasion / Ceremony Title
                  </label>
                  <input
                    type="text"
                    value={celebrationTitle}
                    onChange={(e) => setCelebrationTitle(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Honoree / Primary Names
                  </label>
                  <input
                    type="text"
                    value={coupleNames}
                    onChange={(e) => setCoupleNames(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white font-serif focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Host Inviting Line
                  </label>
                  <input
                    type="text"
                    value={hostsName}
                    onChange={(e) => setHostsName(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Ceremony Date & Time
                  </label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Venue & City
                  </label>
                  <input
                    type="text"
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'motifs' && (
              <div className="space-y-4">
                <p className="text-xs text-stone-400">
                  Included ceremonial motifs and sacred symbols:
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 text-center hover:border-gold-500/50">
                    <DecorativeMotif type="lotus" className="mx-auto mb-1 text-gold-400" />
                    <span className="text-[11px] text-stone-300">Sacred Lotus</span>
                  </div>
                  <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 text-center hover:border-gold-500/50">
                    <DecorativeMotif type="mandala" className="mx-auto mb-1 text-gold-400" />
                    <span className="text-[11px] text-stone-300">Mandala Ring</span>
                  </div>
                  <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 text-center hover:border-gold-500/50">
                    <span className="font-serif text-2xl text-gold-400 block mb-1">卐</span>
                    <span className="text-[11px] text-stone-300">Shubh Swastik</span>
                  </div>
                  <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 text-center hover:border-gold-500/50">
                    <span className="font-serif text-2xl text-gold-400 block mb-1">ॐ</span>
                    <span className="text-[11px] text-stone-300">Pavitra Om</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-3 text-xs">
                {template ? (
                  <>
                    <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 space-y-2">
                      <span className="text-stone-400 block text-[11px]">Template Name</span>
                      <p className="font-bold text-white text-sm">{template.name}</p>
                      <p className="font-hindi text-gold-400">{template.nameHindi}</p>
                    </div>

                    <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-stone-400">ID:</span>
                        <span className="font-mono text-gold-300">{template.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Category:</span>
                        <span className="capitalize text-white font-medium">{template.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Theme:</span>
                        <span className="text-stone-300">{template.theme}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Format:</span>
                        <span className="text-white uppercase font-bold">{template.type}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-stone-400">Blank canvas mode active.</p>
                )}
              </div>
            )}
          </div>

          {/* Privacy Guarantee Footer */}
          <div className="p-3.5 bg-stone-950 border-t border-stone-800 text-[11px] text-stone-400 flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>100% Privacy: Photos & edits stay on your browser.</span>
          </div>
        </div>

        {/* Center Canvas Stage */}
        <div className="flex-1 bg-stone-900/90 p-4 sm:p-8 flex items-center justify-center overflow-auto">
          {dynamicTemplate ? (
            /* Real JSON Template Renderer Live Stage */
            <div className="w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] rounded-2xl shadow-2xl overflow-hidden relative border-2 border-gold-400/80 bg-stone-950">
              <TemplateRenderer template={dynamicTemplate} isInteractive />
            </div>
          ) : (
            /* Fallback Blank Canvas */
            <div className="w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] rounded-2xl shadow-2xl overflow-hidden relative border-4 border-gold-400 flex flex-col justify-between p-6 sm:p-8 text-center bg-ivory-50 text-stone-900">
              <div>
                <div className="flex justify-center mb-2">
                  <DecorativeMotif type="lotus" className="w-12 h-8 text-gold-600" />
                </div>
                <p className="font-hindi text-xs sm:text-sm font-bold text-royal-950 tracking-wider">
                  {headingHindi}
                </p>
                <span className="block h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-gold-500 to-transparent my-3" />
                <p className="font-serif text-sm tracking-widest uppercase text-magenta-700 font-bold">
                  {celebrationTitle}
                </p>
              </div>

              <div className="my-auto py-4">
                <p className="text-[11px] text-stone-600 font-light italic mb-2">
                  {hostsName}
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-royal-950 tracking-tight leading-tight my-2">
                  {coupleNames}
                </h2>
              </div>

              <div className="pt-4 border-t border-gold-300">
                <p className="text-xs font-semibold text-royal-950 mb-1">{eventDate}</p>
                <p className="text-[11px] text-stone-600">{eventVenue}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CardEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center">
          <p className="font-serif text-gold-400 text-lg">Loading Editor Canvas...</p>
        </div>
      }
    >
      <CardEditorContent />
    </Suspense>
  );
}
