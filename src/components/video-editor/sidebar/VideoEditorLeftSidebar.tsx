'use client';

import React, { useState, useEffect } from 'react';
import { useVideoEditorStore, VideoSidebarTab } from '@/lib/store/useVideoEditorStore';
import { ALL_TEMPLATES } from '@/data/templates';
import { TemplateDefinition, DecorativeType } from '@/types/template';
import {
  TextVideoElement,
  StickerVideoElement,
  ImageVideoElement,
  ShapeVideoElement,
  TransitionType,
  AudioTrackConfig,
} from '@/types/videoEditor';
import { getMotifDataUri } from '@/lib/editor/motifSvgHelper';
import {
  saveUploadedImage,
  getAllUploadedImages,
  saveAudioTrack,
  getAllAudioTracks,
  deleteAudioTrack,
} from '@/lib/storage/db';
import { decodeAudioBlob, cacheAudioBuffer, evictAudioBuffer } from '@/lib/video/audioEngine';
import {
  Layers,
  LayoutGrid,
  Type,
  Image as ImageIcon,
  Palette,
  Sparkles,
  Music,
  SlidersHorizontal,
  Plus,
  Trash2,
  Copy,
  Upload,
  Volume2,
  Check,
} from 'lucide-react';

const MOTIFS: { type: DecorativeType; label: string; labelHindi: string }[] = [
  { type: 'ganesha', label: 'Lord Ganesha', labelHindi: 'श्री गणेश' },
  { type: 'om', label: 'Sacred Om', labelHindi: 'ॐ' },
  { type: 'swastik', label: 'Swastik', labelHindi: 'स्वस्तिक' },
  { type: 'kalash', label: 'Mangal Kalash', labelHindi: 'मंगल कलश' },
  { type: 'lotus', label: 'Kamal / Lotus', labelHindi: 'कमल पुष्प' },
  { type: 'diya', label: 'Ceremonial Diya', labelHindi: 'दीपक' },
  { type: 'jharokha_arch', label: 'Jharokha Arch', labelHindi: 'झरोखा मेहराब' },
  { type: 'mandala', label: 'Mandala Art', labelHindi: 'मंडला' },
  { type: 'peacock', label: 'Royal Peacock', labelHindi: 'मयूर' },
  { type: 'garland', label: 'Floral Garland', labelHindi: 'पुष्प माला' },
  { type: 'divider', label: 'Ornate Divider', labelHindi: 'स्वर्ण डिवाइडर' },
  { type: 'floral_corner', label: 'Corner Flourish', labelHindi: 'कोना सज्जा' },
  { type: 'rings', label: 'Wedding Rings', labelHindi: 'अंगूठी' },
  { type: 'balloons', label: 'Balloons', labelHindi: 'गुब्बारे' },
  { type: 'cradle', label: 'Baby Cradle', labelHindi: 'पालना' },
  { type: 'flute', label: 'Divine Flute', labelHindi: 'बांसुरी' },
];

const SYNTH_TRACKS: {
  id: AudioTrackConfig['synthPreset'];
  title: string;
  desc: string;
}[] = [
  {
    id: 'shehnai_sitar',
    title: 'Mangal Shehnai & Sitar Harmony',
    desc: 'Traditional Royal Indian Wedding Raga with temple bells',
  },
  {
    id: 'royal_dhol',
    title: 'Royal Rajasthani Dhol & Shenai',
    desc: 'Festive Baraat & Grand Entry celebration beats',
  },
  {
    id: 'sacred_flute',
    title: 'Devotional Flute & Santoor',
    desc: 'Sacred Puja, Mundan & Griha Pravesh melodies',
  },
  {
    id: 'celebration',
    title: 'Celebration Beats & Strings',
    desc: 'Uplifting joyful strings for Birthdays & Anniversaries',
  },
  {
    id: 'acoustic_strings',
    title: 'Soulful Acoustic Mandolin',
    desc: 'Warm romantic harmony for Engagements & Receptions',
  },
];

const TRANSITION_PRESETS: { type: TransitionType; label: string; desc: string }[] = [
  { type: 'crossfade', label: 'Crossfade', desc: 'Smooth dissolve blend between scenes' },
  { type: 'fade-to-black', label: 'Fade to Black', desc: 'Cinematic fade through black' },
  { type: 'slide-left', label: 'Slide Left', desc: 'Next scene enters smoothly from right' },
  { type: 'slide-right', label: 'Slide Right', desc: 'Next scene enters smoothly from left' },
  { type: 'zoom-in', label: 'Zoom In', desc: 'Dynamic scale transition into next scene' },
  { type: 'none', label: 'Cut (None)', desc: 'Instant cut without transition' },
];

export function VideoEditorLeftSidebar() {
  const {
    activeSidebarTab,
    setActiveSidebarTab,
    scenes,
    activeSceneId,
    setActiveSceneId,
    addScene,
    duplicateScene,
    deleteScene,
    updateSceneDuration,
    updateSceneTransition,
    updateScene,
    loadTemplate,
    addElementToActiveScene,
    audioTrack,
    setAudioTrack,
    updateAudioVolume,
  } = useVideoEditorStore();

  const [uploadedPhotos, setUploadedPhotos] = useState<any[]>([]);
  const [userAudioList, setUserAudioList] = useState<any[]>([]);

  // Load photos and audio from IndexedDB
  useEffect(() => {
    getAllUploadedImages().then(setUploadedPhotos);
    getAllAudioTracks().then(setUserAudioList);
  }, []);

  const activeScene = scenes.find((s) => s.id === activeSceneId) || scenes[0];

  // Photo Upload Handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const uploadedItem = {
        id: `upload-${Date.now()}`,
        dataUrl,
        name: file.name,
        width: 800,
        height: 800,
        size: file.size,
        createdAt: Date.now(),
      };
      await saveUploadedImage(uploadedItem);
      setUploadedPhotos((prev) => [uploadedItem, ...prev]);

      // Add to current scene
      const imageEl: ImageVideoElement = {
        id: `img-${Date.now()}`,
        name: file.name,
        type: 'image',
        src: dataUrl,
        x: 240,
        y: 400,
        width: 600,
        height: 600,
        borderRadius: 24,
        borderColor: '#D4AF37',
        borderWidth: 4,
        zIndex: 15,
        animation: {
          type: 'zoom-in',
          startTime: 0.2,
          duration: 0.8,
          easing: 'ease-out',
        },
      };
      addElementToActiveScene(imageEl);
    };
    reader.readAsDataURL(file);
  };

  // Custom Audio Upload Handler with immediate decoding and buffer caching
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so re-selecting the same file always triggers onChange
    e.target.value = '';

    try {
      const decoded = await decodeAudioBlob(file);
      const trackId = `audio-user-${Date.now()}`;

      const audioTrackItem = {
        id: trackId,
        name: file.name,
        blob: file,
        mimeType: file.type || 'audio/mp3',
        duration: decoded.duration,
        createdAt: Date.now(),
      };

      await saveAudioTrack(audioTrackItem);
      cacheAudioBuffer(trackId, decoded);
      setUserAudioList((prev) => [audioTrackItem, ...prev]);

      const blobUrl = URL.createObjectURL(file);
      setAudioTrack({
        id: trackId,
        title: file.name,
        src: blobUrl,
        blobId: trackId,
        duration: decoded.duration,
        isSynth: false,
        volume: 0.85,
        startTime: 0,
        trimStart: 0,
        trimEnd: decoded.duration,
        fadeInDuration: 1.0,
        fadeOutDuration: 1.5,
        isMuted: false,
      });
    } catch (err) {
      console.error('Audio decode error:', err);
      alert('Could not decode this audio file. Please upload a standard MP3, WAV, or AAC audio file.');
    }
  };

  const handleSelectUploadedTrack = (track: any) => {
    const blobUrl = URL.createObjectURL(track.blob);
    setAudioTrack({
      id: track.id,
      title: track.name,
      src: blobUrl,
      blobId: track.id,
      duration: track.duration,
      isSynth: false,
      volume: 0.85,
      startTime: 0,
      trimStart: 0,
      trimEnd: track.duration,
      fadeInDuration: 1.0,
      fadeOutDuration: 1.5,
      isMuted: false,
    });
  };

  const handleDeleteUploadedTrack = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteAudioTrack(id);
    evictAudioBuffer(id);
    setUserAudioList((prev) => prev.filter((t) => t.id !== id));
    if (audioTrack?.id === id) {
      setAudioTrack({
        id: 'synth-shehnai_sitar',
        title: 'Mangal Shehnai & Sitar Harmony',
        src: 'synth',
        isSynth: true,
        synthPreset: 'shehnai_sitar',
        volume: 0.85,
        startTime: 0,
        trimStart: 0,
        fadeInDuration: 1.0,
        fadeOutDuration: 1.5,
        isMuted: false,
      });
    }
  };

  // Add Motif
  const handleAddMotif = (type: DecorativeType) => {
    const color = '#D4AF37';
    const secondaryColor = '#BE185D';
    const uri = getMotifDataUri(type, color, secondaryColor);

    const motifEl: StickerVideoElement = {
      id: `motif-${type}-${Date.now()}`,
      name: `Motif: ${type}`,
      type: 'sticker',
      stickerType: type,
      x: 390,
      y: 400,
      width: 300,
      height: 300,
      color,
      secondaryColor,
      svgDataUri: uri,
      zIndex: 10,
      animation: {
        type: 'zoom-in',
        startTime: 0.2,
        duration: 0.8,
        easing: 'ease-out',
      },
    };
    addElementToActiveScene(motifEl);
  };

  // Add Text Preset
  const handleAddText = (
    text: string,
    fontSize: number,
    fontFamily: string,
    fill = '#FFFFFF',
    fontStyle: 'normal' | 'bold' = 'normal',
    animType: TextVideoElement['animation']['type'] = 'fade-in'
  ) => {
    const textEl: TextVideoElement = {
      id: `txt-${Date.now()}`,
      name: text.slice(0, 16),
      type: 'text',
      text,
      fontSize,
      fontFamily,
      fill,
      fontStyle,
      align: 'center',
      x: 140,
      y: 600,
      width: 800,
      height: fontSize * 1.5,
      zIndex: 20,
      animation: {
        type: animType,
        startTime: 0.3,
        duration: 0.8,
        easing: 'ease-out',
      },
    };
    addElementToActiveScene(textEl);
  };

  return (
    <div className="w-80 sm:w-96 bg-stone-950 border-r border-stone-800 flex select-none z-20 shrink-0">
      {/* 1. Vertical Icon Rail */}
      <div className="w-16 bg-stone-950 border-r border-stone-800/80 flex flex-col items-center py-3 space-y-1 shrink-0">
        {[
          { id: 'scenes', label: 'Scenes', icon: Layers },
          { id: 'templates', label: 'Templates', icon: LayoutGrid },
          { id: 'text', label: 'Text', icon: Type },
          { id: 'photos', label: 'Photos', icon: ImageIcon },
          { id: 'backgrounds', label: 'Theme', icon: Palette },
          { id: 'stickers', label: 'Motifs', icon: Sparkles },
          { id: 'music', label: 'Music', icon: Music },
          { id: 'transitions', label: 'Effects', icon: SlidersHorizontal },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSidebarTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSidebarTab(tab.id as VideoSidebarTab)}
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center space-y-1 transition-all ${
                isActive
                  ? 'bg-royal-950 text-gold-300 border border-gold-500/40 shadow-xs'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-medium leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Drawer Panel Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs text-stone-200">
        {/* ================= SCENES TAB ================= */}
        {activeSidebarTab === 'scenes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="font-serif text-sm font-bold text-white">Video Scenes</span>
              <button
                onClick={() => addScene()}
                className="flex items-center gap-1 text-[11px] bg-royal-950 border border-gold-500/30 text-gold-300 px-2 py-1 rounded hover:bg-royal-900 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Scene</span>
              </button>
            </div>

            <div className="space-y-2">
              {scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  onClick={() => setActiveSceneId(scene.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    scene.id === activeSceneId
                      ? 'border-gold-400 bg-stone-900 shadow-gold-glow/10'
                      : 'border-stone-800 bg-stone-900/40 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">
                      {idx + 1}. {scene.name}
                    </span>
                    <span className="text-[10px] font-mono text-gold-400 bg-stone-950 px-1.5 py-0.5 rounded">
                      {scene.duration.toFixed(1)}s
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span>{scene.elements.length} Elements</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateScene(scene.id);
                        }}
                        className="p-1 rounded text-stone-400 hover:text-gold-400"
                        title="Duplicate Scene"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {scenes.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteScene(scene.id);
                          }}
                          className="p-1 rounded text-stone-400 hover:text-rose-400"
                          title="Delete Scene"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TEMPLATES TAB ================= */}
        {activeSidebarTab === 'templates' && (
          <div className="space-y-3">
            <span className="font-serif text-sm font-bold text-white block border-b border-stone-800 pb-2">
              Choose Video Template
            </span>
            <div className="space-y-2">
              {ALL_TEMPLATES.filter((t) => t.type === 'video').map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => loadTemplate(tpl)}
                  className="p-2.5 rounded-xl border border-stone-800 bg-stone-900/60 hover:border-gold-400 transition-all cursor-pointer group"
                >
                  <p className="font-semibold text-white text-xs group-hover:text-gold-300">
                    {tpl.name}
                  </p>
                  <p className="text-[10px] text-gold-400 font-hindi">{tpl.nameHindi}</p>
                  <span className="inline-block mt-1 text-[9px] bg-royal-950 text-gold-300 px-1.5 py-0.5 rounded uppercase">
                    {tpl.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TEXT TAB ================= */}
        {activeSidebarTab === 'text' && (
          <div className="space-y-4">
            <span className="font-serif text-sm font-bold text-white block border-b border-stone-800 pb-2">
              Ceremonial Typography Presets
            </span>

            <div className="space-y-2">
              <button
                onClick={() =>
                  handleAddText(
                    '॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ॥',
                    34,
                    'Noto Sans Devanagari',
                    '#FDE68A',
                    'bold',
                    'fade-in'
                  )
                }
                className="w-full text-left p-3 rounded-xl border border-stone-800 bg-stone-900/60 hover:border-gold-400 transition-colors"
              >
                <p className="font-hindi text-gold-300 text-sm">॥ वक्रतुण्ड महाकाय ॥</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Sacred Sanskrit Shloka</p>
              </button>

              <button
                onClick={() =>
                  handleAddText(
                    'देव एवं मीरा',
                    76,
                    'Rozha One',
                    '#FCD34D',
                    'bold',
                    'typewriter'
                  )
                }
                className="w-full text-left p-3 rounded-xl border border-stone-800 bg-stone-900/60 hover:border-gold-400 transition-colors"
              >
                <p className="font-hindi font-bold text-lg text-gold-400">वर एवं वधू के नाम</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Primary Celebrant Names (Typewriter)</p>
              </button>

              <button
                onClick={() =>
                  handleAddText(
                    'गुरुवार, 18 दिसंबर 2026 | सायं 7:00 बजे',
                    36,
                    'Noto Sans Devanagari',
                    '#FDE68A',
                    'bold',
                    'slide-up'
                  )
                }
                className="w-full text-left p-3 rounded-xl border border-stone-800 bg-stone-900/60 hover:border-gold-400 transition-colors"
              >
                <p className="font-hindi font-semibold text-white">शुभ मुहूर्त व दिनांक</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Muhurat Date & Time</p>
              </button>

              <button
                onClick={() =>
                  handleAddText(
                    'उम्मेद भवन पैलेस, जोधपुर, राजस्थान',
                    32,
                    'Noto Sans Devanagari',
                    '#E2E8F0',
                    'normal',
                    'slide-up'
                  )
                }
                className="w-full text-left p-3 rounded-xl border border-stone-800 bg-stone-900/60 hover:border-gold-400 transition-colors"
              >
                <p className="font-hindi text-white">कार्यक्रम स्थल / Venue</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Ceremony Venue Address</p>
              </button>

              <button
                onClick={() =>
                  handleAddText(
                    'RSVP: समस्त परिवार | मो. 9876543210',
                    30,
                    'Noto Sans Devanagari',
                    '#F59E0B',
                    'normal',
                    'fade-in'
                  )
                }
                className="w-full text-left p-3 rounded-xl border border-stone-800 bg-stone-900/60 hover:border-gold-400 transition-colors"
              >
                <p className="text-white">RSVP & Warm Regards</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Host Contact & Blessings</p>
              </button>
            </div>
          </div>
        )}

        {/* ================= PHOTOS TAB ================= */}
        {activeSidebarTab === 'photos' && (
          <div className="space-y-4">
            <span className="font-serif text-sm font-bold text-white block border-b border-stone-800 pb-2">
              Photos & Uploads
            </span>

            {/* Upload Button */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-700 hover:border-gold-400 rounded-2xl p-4 cursor-pointer bg-stone-900/50 hover:bg-stone-900 transition-all text-center">
              <Upload className="w-6 h-6 text-gold-400 mb-2" />
              <span className="font-semibold text-xs text-white">Upload Photo</span>
              <span className="text-[10px] text-stone-400 mt-1">100% Client-Side in Browser</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>

            {/* Gallery of Uploads */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {uploadedPhotos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const imageEl: ImageVideoElement = {
                      id: `img-${Date.now()}`,
                      name: item.name || 'Photo',
                      type: 'image',
                      src: item.dataUrl,
                      x: 240,
                      y: 400,
                      width: 600,
                      height: 600,
                      borderRadius: 24,
                      borderColor: '#D4AF37',
                      borderWidth: 4,
                      zIndex: 15,
                      animation: {
                        type: 'zoom-in',
                        startTime: 0.2,
                        duration: 0.8,
                        easing: 'ease-out',
                      },
                    };
                    addElementToActiveScene(imageEl);
                  }}
                  className="aspect-square rounded-xl overflow-hidden border border-stone-800 hover:border-gold-400 relative cursor-pointer group"
                >
                  <img
                    src={item.dataUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= BACKGROUNDS TAB ================= */}
        {activeSidebarTab === 'backgrounds' && (
          <div className="space-y-4">
            <span className="font-serif text-sm font-bold text-white block border-b border-stone-800 pb-2">
              Scene Background
            </span>

            <div className="space-y-2">
              {[
                { name: 'Royal Crimson & Gold', from: '#4A0E4E', via: '#290627', to: '#120112' },
                { name: 'Deep Burgundy Wine', from: '#3D0738', via: '#240322', to: '#120112' },
                { name: 'Sacred Ochre Gold', from: '#362002', via: '#1E1201', to: '#0A0600' },
                { name: 'Midnight Royal Blue', from: '#0C1E40', via: '#071026', to: '#02050D' },
                { name: 'Emerald Festive Green', from: '#062B1D', via: '#03170F', to: '#010A07' },
              ].map((grad, i) => (
                <button
                  key={i}
                  onClick={() => {
                    updateScene(activeScene.id, {
                      background: {
                        type: 'gradient',
                        color: grad.from,
                        gradient: {
                          type: 'linear',
                          from: grad.from,
                          via: grad.via,
                          to: grad.to,
                          angle: 180,
                        },
                        pattern: 'mandala',
                        patternOpacity: 0.1,
                      },
                    });
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${grad.from}, ${grad.via}, ${grad.to})`,
                  }}
                  className="w-full p-3 rounded-xl border border-stone-700 hover:border-gold-400 text-left text-white font-medium text-xs flex items-center justify-between transition-colors shadow-xs"
                >
                  <span>{grad.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= STICKERS / MOTIFS TAB ================= */}
        {activeSidebarTab === 'stickers' && (
          <div className="space-y-3">
            <span className="font-serif text-sm font-bold text-white block border-b border-stone-800 pb-2">
              Traditional Indian Motifs
            </span>

            <div className="grid grid-cols-2 gap-2">
              {MOTIFS.map((m) => (
                <button
                  key={m.type}
                  onClick={() => handleAddMotif(m.type)}
                  className="p-3 rounded-xl border border-stone-800 bg-stone-900/60 hover:border-gold-400 hover:bg-stone-900 flex flex-col items-center text-center space-y-1.5 transition-all group"
                >
                  <img
                    src={getMotifDataUri(m.type, '#D4AF37', '#BE185D')}
                    alt={m.label}
                    className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
                  />
                  <span className="text-[11px] text-stone-200 group-hover:text-gold-300 font-medium">
                    {m.label}
                  </span>
                  <span className="text-[9px] text-stone-500 font-hindi">{m.labelHindi}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= MUSIC TAB ================= */}
        {activeSidebarTab === 'music' && (
          <div className="space-y-4">
            <span className="font-serif text-sm font-bold text-white block border-b border-stone-800 pb-2">
              Ceremonial Background Music
            </span>

            {/* Custom Upload */}
            <label className="flex items-center justify-center space-x-2 border border-dashed border-stone-700 hover:border-gold-400 rounded-xl p-3 cursor-pointer bg-stone-900/50 hover:bg-stone-900 transition-all text-center">
              <Upload className="w-4 h-4 text-gold-400" />
              <span className="font-semibold text-xs text-white">Upload Audio (.mp3, .wav, .m4a)</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
              />
            </label>

            {/* User Uploaded Tracks List */}
            {userAudioList.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 block">
                  Your Uploaded Songs ({userAudioList.length})
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {userAudioList.map((t) => {
                    const isSelected = audioTrack?.id === t.id && !audioTrack?.isSynth;
                    const mins = Math.floor((t.duration || 0) / 60);
                    const secs = Math.floor((t.duration || 0) % 60).toString().padStart(2, '0');

                    return (
                      <div
                        key={t.id}
                        onClick={() => handleSelectUploadedTrack(t)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-gold-400 bg-royal-950/70 shadow-gold-glow/20 ring-1 ring-gold-400/50'
                            : 'border-stone-800 bg-stone-900/40 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex-1 min-w-0 mr-2">
                          <p className="font-semibold text-white text-xs truncate">{t.name}</p>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {mins}:{secs} • Uploaded Song
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 shrink-0">
                          {isSelected && <Check className="w-4 h-4 text-gold-400 mr-1" />}
                          <button
                            onClick={(e) => handleDeleteUploadedTrack(t.id, e)}
                            className="p-1 rounded text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                            title="Delete uploaded track"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Synth Ceremonial Presets */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 block">
                Ceremonial Raga Presets (Built-in)
              </span>

              {SYNTH_TRACKS.map((t) => {
                const isSelected = audioTrack?.synthPreset === t.id && audioTrack?.isSynth;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setAudioTrack({
                        id: `synth-${t.id}`,
                        title: t.title,
                        src: 'synth',
                        isSynth: true,
                        synthPreset: t.id,
                        volume: 0.85,
                        startTime: 0,
                        trimStart: 0,
                        fadeInDuration: 1.0,
                        fadeOutDuration: 1.5,
                        isMuted: false,
                      });
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-gold-400 bg-royal-950/60 shadow-gold-glow/20'
                        : 'border-stone-800 bg-stone-900/40 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-xs">{t.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-gold-400" />}
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1">{t.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Volume Control */}
            {audioTrack && (
              <div className="pt-3 border-t border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-300">Volume</span>
                  <span className="font-mono text-gold-400 font-semibold">
                    {Math.round((audioTrack.volume || 0.85) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioTrack.volume ?? 0.85}
                  onChange={(e) => updateAudioVolume(parseFloat(e.target.value))}
                  className="w-full accent-gold-400"
                />
              </div>
            )}
          </div>
        )}

        {/* ================= TRANSITIONS TAB ================= */}
        {activeSidebarTab === 'transitions' && (
          <div className="space-y-4">
            <span className="font-serif text-sm font-bold text-white block border-b border-stone-800 pb-2">
              Scene Transition Effects
            </span>

            <p className="text-[11px] text-stone-400">
              Select the transition effect applied when entering{' '}
              <strong className="text-gold-300">{activeScene.name}</strong>.
            </p>

            <div className="space-y-2">
              {TRANSITION_PRESETS.map((tr) => {
                const isSelected = activeScene.transition?.type === tr.type;
                return (
                  <div
                    key={tr.type}
                    onClick={() => {
                      updateSceneTransition(activeScene.id, {
                        type: tr.type,
                        duration: activeScene.transition?.duration || 0.6,
                      });
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-gold-400 bg-royal-950/60 shadow-gold-glow/20'
                        : 'border-stone-800 bg-stone-900/40 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-xs">{tr.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-gold-400" />}
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1">{tr.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Transition Duration */}
            <div className="pt-3 border-t border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-stone-300">Transition Duration</span>
                <span className="font-mono text-gold-400 font-semibold">
                  {(activeScene.transition?.duration || 0.6).toFixed(1)}s
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={activeScene.transition?.duration || 0.6}
                onChange={(e) =>
                  updateSceneTransition(activeScene.id, {
                    type: activeScene.transition?.type || 'crossfade',
                    duration: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-gold-400"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
