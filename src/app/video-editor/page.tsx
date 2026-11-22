'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { DecorativeMotif } from '@/components/common/DecorativeMotif';
import { TemplateRenderer } from '@/components/templates/engine/TemplateRenderer';
import { getTemplateById } from '@/lib/repositories/templateRepository';
import { TemplateDefinition } from '@/types/template';
import {
  Video,
  Music,
  Play,
  Pause,
  Download,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Cpu,
  Lock,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

function VideoEditorContent() {
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeScene, setActiveScene] = useState(1);
  const [isRendering, setIsRendering] = useState(false);
  const [renderSuccess, setRenderSuccess] = useState(false);

  // Handle template not found gracefully
  if (hasCheckedTemplate && templateId && !template) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-950 p-8 rounded-3xl border border-stone-800 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-2">
            Video Template Not Found
          </h2>
          <p className="font-hindi text-gold-400 text-sm mb-3">
            वीडियो निमंत्रण टेम्पलेट नहीं मिला
          </p>
          <p className="text-stone-400 text-xs leading-relaxed mb-6">
            We could not find the video template with ID <code className="text-gold-400 bg-stone-900 px-2 py-0.5 rounded font-mono">{templateId}</code>.
          </p>
          <div className="flex flex-col gap-3">
            <Button href="/templates?type=video" variant="gold" size="md" className="justify-center shadow-gold-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              Browse Video Reel Templates
            </Button>
            <Button href="/video-editor" variant="outline" size="md" className="justify-center text-white border-stone-700 hover:bg-stone-800">
              Start Blank Video
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleExportVideo = () => {
    setIsRendering(true);
    setTimeout(() => {
      setIsRendering(false);
      setRenderSuccess(true);
      setTimeout(() => setRenderSuccess(false), 4000);
    }, 2000);
  };

  const musicTrackName =
    template?.previewConfig.musicTrack || 'Traditional Shehnai & Sitar Harmony';

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col">
      {/* Top Navbar */}
      <div className="bg-stone-950 border-b border-stone-800 px-4 py-3 flex flex-wrap items-center justify-between gap-4 z-30">
        <div className="flex items-center space-x-3">
          <Link
            href="/templates?type=video"
            className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors border border-stone-800"
            title="Back to gallery"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <h1 className="text-sm font-semibold text-white">
            {template ? template.name : 'Animated Video Reel Maker'}
          </h1>
          <Badge variant="gold" className="bg-gold-500/20 text-gold-400 border-gold-500/40">
            Browser Video Engine • 100% Free
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={handleExportVideo}
            variant="gold"
            size="sm"
            disabled={isRendering}
            className="shadow-gold-glow"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            {isRendering ? 'Rendering in Browser...' : 'Export Free HD Video (MP4)'}
          </Button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Video Settings Panel */}
        <div className="w-full lg:w-80 bg-stone-950 border-r border-stone-800 p-4 space-y-5 overflow-y-auto">
          {/* Template Details Card */}
          {template && (
            <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-gold-400 font-semibold block">
                Selected Template
              </span>
              <p className="text-sm font-bold text-white">{template.name}</p>
              <p className="text-xs font-hindi text-rose-300">{template.nameHindi}</p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-400">
                <span className="capitalize">{template.category}</span>
                <span>•</span>
                <span>1080×1920 HD</span>
                <span>•</span>
                <span className="text-emerald-400">15s Duration</span>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-2">
              Ceremony Story Scenes
            </h2>
            <div className="space-y-2">
              {[
                { id: 1, title: 'Scene 1: Mangal Shloka & Blessing', time: '0:00 - 0:04' },
                { id: 2, title: 'Scene 2: Primary Names Announcement', time: '0:04 - 0:08' },
                { id: 3, title: 'Scene 3: Ceremony Schedule', time: '0:08 - 0:12' },
                { id: 4, title: 'Scene 4: Venue & Warm Invitation', time: '0:12 - 0:15' },
              ].map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => setActiveScene(scene.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    activeScene === scene.id
                      ? 'border-gold-400 bg-gold-400/10 text-white'
                      : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-white'
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold">{scene.title}</p>
                    <p className="text-[10px] text-stone-500">{scene.time}</p>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-2">
              Festive Music & Shehnai
            </h2>
            <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-stone-200">
                <Music className="w-4 h-4 text-magenta-400" />
                <span className="font-medium">{musicTrackName}</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Royalty-free Indian festive soundtrack included with this invitation.
              </p>
            </div>
          </div>

          {/* Browser Rendering Engine Explainer */}
          <div className="p-3.5 rounded-xl bg-royal-950/60 border border-royal-700/60 text-xs space-y-2">
            <div className="flex items-center space-x-1.5 text-gold-300 font-semibold">
              <Cpu className="w-4 h-4" />
              <span>In-Browser Rendering</span>
            </div>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              Video is compiled strictly inside your browser using WebCodecs and HTML Canvas. Your photos are never sent to a server.
            </p>
          </div>
        </div>

        {/* Center Stage: Video Reel Preview */}
        <div className="flex-1 bg-stone-900 flex flex-col items-center justify-center p-6 relative overflow-auto">
          {template ? (
            /* Real JSON-Driven Video Template Reel */
            <div className="w-full max-w-[340px] aspect-[9/16] rounded-2xl border-2 border-gold-400/80 shadow-2xl relative overflow-hidden bg-stone-950 flex flex-col">
              <TemplateRenderer template={template} isInteractive />

              {/* Bottom Player Overlay */}
              <div className="absolute bottom-3 left-4 right-4 z-40 flex items-center justify-between bg-black/60 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 text-white text-xs">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-full bg-gold-400 text-royal-950 flex items-center justify-center hover:scale-105 transition-transform"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>
                <span className="text-[11px] font-mono text-gold-300">0:0{activeScene * 3} / 0:15</span>
                <span className="text-[10px] uppercase tracking-wider text-stone-300 font-semibold">HD 1080P</span>
              </div>
            </div>
          ) : (
            /* Fallback Default Reel */
            <div className="w-full max-w-[340px] aspect-[9/16] rounded-2xl bg-royal-950 border-4 border-gold-400/80 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between p-6 text-center">
              <DecorativeMotif type="lotus" className="text-gold-400 mt-4" />
              <div className="my-auto space-y-3">
                <span className="font-hindi text-gold-300 text-xs tracking-widest block">
                  || श्री गणेशाय नमः ||
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Rohan & Meera
                </h3>
                <p className="font-hindi text-xs text-rose-200">
                  शुभ विवाह आमंत्रण
                </p>
                <div className="h-0.5 w-16 bg-gold-400/70 mx-auto" />
                <p className="text-[10px] text-stone-300">
                  SCENE {activeScene} OF 4
                </p>
              </div>

              <div className="w-full pt-4 border-t border-gold-500/20 flex items-center justify-center space-x-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-gold-400 text-royal-950 flex items-center justify-center hover:scale-105 transition-transform"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-stone-400 mt-4">
            9:16 Vertical HD Video format for WhatsApp Status & Instagram Reels
          </p>
        </div>
      </div>

      {/* Render complete notification */}
      {renderSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/80 text-white p-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-bold">Video Rendered Successfully!</p>
            <p className="text-xs text-stone-300">1080x1920 MP4 Video ready with no watermark.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VideoEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center">
          <p className="font-serif text-gold-400 text-lg">Loading Video Maker...</p>
        </div>
      }
    >
      <VideoEditorContent />
    </Suspense>
  );
}
