'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';
import { SAMPLE_TEMPLATES } from '@/lib/constants/templates';
import { saveLocalProject } from '@/lib/storage/db';
import {
  Type,
  Image as ImageIcon,
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
  HelpCircle,
  Lock,
} from 'lucide-react';

function CardEditorContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');

  // Find template or default
  const selectedTemplate = SAMPLE_TEMPLATES.find((t) => t.id === templateId);

  const [projectTitle, setProjectTitle] = useState(
    selectedTemplate ? `${selectedTemplate.title} (My Invite)` : 'My Shubh Vivah Invitation'
  );
  const [activeTab, setActiveTab] = useState<'text' | 'motifs' | 'photos' | 'background' | 'layers'>('text');
  const [selectedFont, setSelectedFont] = useState('font-serif');
  const [accentColor, setAccentColor] = useState('#D4AF37');
  const [isSaved, setIsSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Editable fields for live preview
  const [headingHindi, setHeadingHindi] = useState('|| श्री गणेशाय नमः ||');
  const [celebrationTitle, setCelebrationTitle] = useState('Shubh Vivah');
  const [hostsName, setHostsName] = useState('Mr. & Mrs. Sharma cordially invite you');
  const [coupleNames, setCoupleNames] = useState('Aarav & Ananya');
  const [eventDate, setEventDate] = useState('Sunday, 24th December 2026');
  const [eventVenue, setEventVenue] = useState('The Royal Palace, Jaipur, Rajasthan');

  // Auto-save to IndexedDB
  const handleSaveToDevice = async () => {
    try {
      await saveLocalProject({
        id: templateId || `proj-${Date.now()}`,
        title: projectTitle,
        templateId: selectedTemplate?.id,
        type: 'card',
        category: selectedTemplate?.category || 'wedding',
        createdAt: Date.now(),
        lastModified: Date.now(),
        data: {
          canvasWidth: 1080,
          canvasHeight: 1920,
          elements: [],
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
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-sm font-semibold text-white focus:outline-none focus:border-gold-400 max-w-xs"
            placeholder="Project Title"
          />
          <Badge variant="gold" className="bg-gold-500/20 text-gold-400 border-gold-500/40">
            100% Free • No Watermark
          </Badge>
        </div>

        {/* Center Canvas Tools */}
        <div className="hidden md:flex items-center space-x-1 bg-stone-900 p-1 rounded-lg border border-stone-800">
          <button className="p-2 text-stone-400 hover:text-white rounded hover:bg-stone-800" title="Undo">
            <Undo className="w-4 h-4" />
          </button>
          <button className="p-2 text-stone-400 hover:text-white rounded hover:bg-stone-800" title="Redo">
            <Redo className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-stone-700 mx-1" />
          <button className="p-2 text-stone-400 hover:text-white rounded hover:bg-stone-800" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-stone-400 px-2 font-mono">100%</span>
          <button className="p-2 text-stone-400 hover:text-white rounded hover:bg-stone-800" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
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
              Text & Fonts
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
              onClick={() => setActiveTab('background')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'background' ? 'bg-royal-800 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Themes
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="p-4 flex-1 overflow-y-auto space-y-5 text-sm">
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Mangal Shloka / Blessing (हिंदी श्लोक)
                  </label>
                  <input
                    type="text"
                    value={headingHindi}
                    onChange={(e) => setHeadingHindi(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-gold-300 font-hindi focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Occasion / Title
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
                    Honoree / Couple Names
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

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">
                    Typography Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedFont('font-serif')}
                      className={`p-2 rounded-lg text-xs border text-left ${
                        selectedFont === 'font-serif' ? 'border-gold-400 bg-gold-400/10 text-gold-300' : 'border-stone-800 bg-stone-900 text-stone-300'
                      }`}
                    >
                      <span className="font-serif block font-bold">Royal Cinzel</span>
                      <span className="text-[10px] text-stone-500">Classic Ceremonial</span>
                    </button>
                    <button
                      onClick={() => setSelectedFont('font-hindi')}
                      className={`p-2 rounded-lg text-xs border text-left ${
                        selectedFont === 'font-hindi' ? 'border-gold-400 bg-gold-400/10 text-gold-300' : 'border-stone-800 bg-stone-900 text-stone-300'
                      }`}
                    >
                      <span className="font-hindi block font-bold">देवनागरी (Rozha)</span>
                      <span className="text-[10px] text-stone-500">Traditional Hindi</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'motifs' && (
              <div className="space-y-4">
                <p className="text-xs text-stone-400">
                  Select auspicious Indian ceremonial motifs and sacred symbols:
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 text-center hover:border-gold-500/50 cursor-pointer">
                    <DecorativeMotif type="lotus" className="mx-auto mb-1 text-gold-400" />
                    <span className="text-[11px] text-stone-300">Sacred Lotus</span>
                  </div>
                  <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 text-center hover:border-gold-500/50 cursor-pointer">
                    <DecorativeMotif type="mandala" className="mx-auto mb-1 text-gold-400" />
                    <span className="text-[11px] text-stone-300">Mandala Ring</span>
                  </div>
                  <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 text-center hover:border-gold-500/50 cursor-pointer">
                    <span className="font-serif text-2xl text-gold-400 block mb-1">卐</span>
                    <span className="text-[11px] text-stone-300">Shubh Swastik</span>
                  </div>
                  <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 text-center hover:border-gold-500/50 cursor-pointer">
                    <span className="font-serif text-2xl text-gold-400 block mb-1">ॐ</span>
                    <span className="text-[11px] text-stone-300">Pavitra Om</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'background' && (
              <div className="space-y-4">
                <p className="text-xs text-stone-400">
                  Select background palette for your ceremonial invitation:
                </p>
                <div className="space-y-2">
                  {[
                    { name: 'Royal Ivory & Gold', hex: '#FAF6EE', border: '#D4AF37' },
                    { name: 'Deep Royal Purple', hex: '#4A0E4E', border: '#D4AF37' },
                    { name: 'Rani Magenta & Crimson', hex: '#BE185D', border: '#F59E0B' },
                    { name: 'Midnight Emerald', hex: '#064E3B', border: '#D4AF37' },
                  ].map((bg) => (
                    <button
                      key={bg.name}
                      onClick={() => setAccentColor(bg.border)}
                      className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-900 flex items-center justify-between hover:border-gold-400"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span
                          className="w-5 h-5 rounded-full border"
                          style={{ backgroundColor: bg.hex, borderColor: bg.border }}
                        />
                        <span className="text-xs font-medium text-stone-300">{bg.name}</span>
                      </div>
                      <span className="text-[10px] text-stone-500">Free</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Privacy Guarantee Footer in Sidebar */}
          <div className="p-3.5 bg-stone-950 border-t border-stone-800 text-[11px] text-stone-400 flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Client-side only: Photos remain safely on your device.</span>
          </div>
        </div>

        {/* Center Canvas Stage */}
        <div className="flex-1 bg-stone-900/90 p-4 sm:p-8 flex items-center justify-center overflow-auto">
          {/* 9:16 Invitation Card Preview */}
          <div
            className="w-full max-w-[380px] aspect-[9/16] rounded-2xl shadow-2xl overflow-hidden relative border-4 flex flex-col justify-between p-6 sm:p-8 text-center"
            style={{
              backgroundColor: '#FAF6EE',
              borderColor: accentColor,
            }}
          >
            {/* Top Auspicious Border & Shloka */}
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

            {/* Middle Names and Invitation Text */}
            <div className="my-auto py-4">
              <p className="text-[11px] text-stone-600 font-light italic mb-2">
                {hostsName}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-royal-950 tracking-tight leading-tight my-2">
                {coupleNames}
              </h2>
              <p className="text-[11px] text-stone-500 font-hindi mt-1">
                के परिणय संस्कार में आपकी गरिमामयी उपस्थिति सादर प्रार्थनीय है
              </p>
            </div>

            {/* Bottom Ceremony Details */}
            <div className="pt-3 border-t border-gold-300/60">
              <p className="font-semibold text-xs sm:text-sm text-royal-950">
                {eventDate}
              </p>
              <p className="text-[11px] text-stone-600 mt-0.5">
                {eventVenue}
              </p>
              <div className="mt-3 flex items-center justify-center space-x-1 text-[10px] text-gold-700 font-hindi">
                <span>शुभकामनाएं सहित समस्त परिवार</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Success Modal Notification */}
      {exportSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/80 text-white p-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-bold">Invitation Ready!</p>
            <p className="text-xs text-stone-300">HD Invitation Card rendered with zero watermark.</p>
          </div>
        </div>
      )}
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
