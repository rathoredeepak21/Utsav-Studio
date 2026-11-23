'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditorStore, SidebarTab } from '@/lib/store/useEditorStore';
import { ALL_TEMPLATES } from '@/data/templates';
import { AVAILABLE_MOTIFS, getMotifDataUri } from '@/lib/editor/motifSvgHelper';
import { getAllUploadedImages, saveUploadedImage, deleteUploadedImage } from '@/lib/storage/db';
import { UserUploadedImage, CanvasElement } from '@/types/editor';
import {
  LayoutGrid,
  Type,
  Upload,
  Palette,
  Sparkles,
  Shapes,
  Layers,
  Search,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  X,
  Image as ImageIcon,
} from 'lucide-react';

export function EditorLeftSidebar() {
  const {
    activeSidebarTab,
    setActiveSidebarTab,
    loadTemplate,
    addElement,
    setBackground,
    background,
    elements,
    selectedElementIds,
    selectElement,
    reorderElement,
    toggleLock,
    toggleVisibility,
    removeElement,
    dimensions,
  } = useEditorStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategory, setTemplateCategory] = useState<string>('all');
  const [uploadedImages, setUploadedImages] = useState<UserUploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load uploaded images from IndexedDB
  useEffect(() => {
    getAllUploadedImages().then((imgs) => setUploadedImages(imgs));
  }, []);

  const handleTabClick = (tab: SidebarTab) => {
    if (activeSidebarTab === tab && isDrawerOpen) {
      setIsDrawerOpen(false);
    } else {
      setActiveSidebarTab(tab);
      setIsDrawerOpen(true);
    }
  };

  // Handle local image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please upload a valid JPG, PNG, or WebP image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = async () => {
        const newUpload: UserUploadedImage = {
          id: `up-${Date.now()}`,
          name: file.name,
          dataUrl,
          width: img.naturalWidth || 400,
          height: img.naturalHeight || 400,
          size: file.size,
          createdAt: Date.now(),
        };

        await saveUploadedImage(newUpload);
        setUploadedImages((prev) => [newUpload, ...prev]);
        setIsUploading(false);

        // Also insert onto canvas immediately
        handleAddImageToCanvas(newUpload);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDeleteUpload = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteUploadedImage(id);
    setUploadedImages((prev) => prev.filter((u) => u.id !== id));
  };

  const handleAddImageToCanvas = (img: UserUploadedImage) => {
    const scale = Math.min(600 / img.width, 600 / img.height, 1);
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);

    const newElement: CanvasElement = {
      id: `img-${Date.now().toString(36)}`,
      name: `Photo: ${img.name.slice(0, 15)}`,
      type: 'image',
      src: img.dataUrl,
      originalWidth: img.width,
      originalHeight: img.height,
      x: Math.round((dimensions.width - w) / 2),
      y: Math.round((dimensions.height - h) / 2),
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      isLocked: false,
      isVisible: true,
      zIndex: elements.length + 1,
    };
    addElement(newElement);
  };

  // Add text preset
  const handleAddText = (
    text: string,
    fontSize: number,
    fontFamily: string,
    fontStyle: 'normal' | 'bold' = 'normal',
    color = '#FFFFFF',
    role?: string
  ) => {
    const newElement: CanvasElement = {
      id: `txt-${Date.now().toString(36)}`,
      name: role ? `Text: ${role}` : 'Custom Text',
      type: 'text',
      text,
      fontSize,
      fontFamily,
      fill: color,
      align: 'center',
      fontStyle,
      x: 140,
      y: Math.round(dimensions.height * 0.4),
      width: Math.min(800, dimensions.width - 280),
      height: Math.round(fontSize * 1.5),
      rotation: 0,
      opacity: 1,
      isLocked: false,
      isVisible: true,
      zIndex: elements.length + 1,
      role,
    };
    addElement(newElement);
  };

  // Add motif / sticker preset
  const handleAddMotif = (motif: (typeof AVAILABLE_MOTIFS)[0]) => {
    const dataUri = getMotifDataUri(
      motif.type,
      motif.defaultColor,
      motif.defaultSecondaryColor
    );
    const newElement: CanvasElement = {
      id: `motif-${motif.type}-${Date.now().toString(36)}`,
      name: motif.name,
      type: 'sticker',
      stickerType: motif.type,
      color: motif.defaultColor,
      secondaryColor: motif.defaultSecondaryColor,
      svgDataUri: dataUri,
      x: Math.round((dimensions.width - motif.defaultWidth) / 2),
      y: Math.round((dimensions.height - motif.defaultHeight) / 2),
      width: motif.defaultWidth,
      height: motif.defaultHeight,
      rotation: 0,
      opacity: 1,
      isLocked: false,
      isVisible: true,
      zIndex: elements.length + 1,
    };
    addElement(newElement);
  };

  // Add shape preset
  const handleAddShape = (shapeType: 'rect' | 'circle' | 'star' | 'heart' | 'line') => {
    const w = shapeType === 'line' ? 600 : 200;
    const h = shapeType === 'line' ? 4 : 200;
    const newElement: CanvasElement = {
      id: `shape-${shapeType}-${Date.now().toString(36)}`,
      name: `Shape: ${shapeType}`,
      type: 'shape',
      shapeType,
      fill: '#D4AF37',
      stroke: '#FFFFFF',
      strokeWidth: 0,
      x: Math.round((dimensions.width - w) / 2),
      y: Math.round((dimensions.height - h) / 2),
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      cornerRadius: shapeType === 'rect' ? 8 : 0,
      isLocked: false,
      isVisible: true,
      zIndex: elements.length + 1,
    };
    addElement(newElement);
  };

  // Filter templates
  const filteredTemplates = ALL_TEMPLATES.filter((t) => {
    const matchesCat = templateCategory === 'all' || t.category === templateCategory;
    const matchesSearch =
      !templateSearch ||
      t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.nameHindi.includes(templateSearch);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex h-full relative z-30 select-none">
      {/* 1. Slim Left Navigation Rail */}
      <nav className="w-16 sm:w-18 bg-stone-950 border-r border-stone-800 flex flex-col items-center py-3 space-y-1.5 shrink-0 text-[10px] font-medium text-stone-400">
        {[
          { tab: 'templates', label: 'Templates', icon: LayoutGrid },
          { tab: 'text', label: 'Text', icon: Type },
          { tab: 'uploads', label: 'Uploads', icon: Upload },
          { tab: 'backgrounds', label: 'Background', icon: Palette },
          { tab: 'motifs', label: 'Motifs', icon: Sparkles },
          { tab: 'shapes', label: 'Shapes', icon: Shapes },
          { tab: 'layers', label: 'Layers', icon: Layers },
        ].map(({ tab, label, icon: Icon }) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab as SidebarTab)}
            className={`w-14 sm:w-16 py-2.5 px-1 rounded-xl flex flex-col items-center justify-center space-y-1 transition-all ${
              activeSidebarTab === tab && isDrawerOpen
                ? 'bg-royal-900 text-gold-300 font-bold border border-gold-500/40 shadow-sm'
                : 'hover:bg-stone-900 hover:text-stone-200'
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>

      {/* 2. Drawer Panel Content */}
      {isDrawerOpen && (
        <aside className="w-72 sm:w-80 bg-stone-900 border-r border-stone-800 flex flex-col h-full overflow-hidden text-stone-200">
          {/* Header */}
          <div className="p-3.5 border-b border-stone-800 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gold-300">
            <span>{activeSidebarTab}</span>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1 hover:bg-stone-800 rounded text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 overflow-y-auto flex-1 space-y-5 text-xs">
            {/* TAB 1: TEMPLATES */}
            {activeSidebarTab === 'templates' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="Search 40 templates..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                  {['all', 'wedding', 'birthday', 'engagement', 'anniversary'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setTemplateCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-[10px] capitalize whitespace-nowrap ${
                        templateCategory === cat
                          ? 'bg-gold-500 text-royal-950 font-bold'
                          : 'bg-stone-800 text-stone-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {filteredTemplates.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => loadTemplate(t)}
                      className="group cursor-pointer rounded-xl bg-stone-950 border border-stone-800 hover:border-gold-400/80 p-2 text-center transition-all hover:scale-[1.02]"
                    >
                      <div className="aspect-[9/16] rounded-lg bg-stone-900 border border-stone-800 mb-2 overflow-hidden flex items-center justify-center relative">
                        <span className="text-[10px] text-gold-400 font-bold px-2 py-1 bg-black/70 rounded">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-white line-clamp-1 group-hover:text-gold-300">
                        {t.name}
                      </p>
                      <p className="font-hindi text-[10px] text-stone-400 line-clamp-1">
                        {t.nameHindi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: TEXT */}
            {activeSidebarTab === 'text' && (
              <div className="space-y-4">
                {/* Standard text elements */}
                <div className="space-y-2">
                  <span className="text-stone-400 uppercase tracking-wider text-[10px] font-bold">
                    Standard Text
                  </span>
                  <button
                    onClick={() => handleAddText('ADD A HEADING', 64, 'Cinzel', 'bold', '#FCD34D')}
                    className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-gold-400 text-left transition-colors"
                  >
                    <span className="font-serif text-lg font-bold text-white block">Add a Heading</span>
                    <span className="text-[10px] text-stone-400">Royal Cinzel (64px)</span>
                  </button>

                  <button
                    onClick={() => handleAddText('Add a Subheading Line', 36, 'Plus Jakarta Sans', 'normal', '#E2E8F0')}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-gold-400 text-left transition-colors"
                  >
                    <span className="text-sm font-semibold text-stone-200 block">Add a Subheading</span>
                    <span className="text-[10px] text-stone-400">Clean Sans (36px)</span>
                  </button>

                  <button
                    onClick={() => handleAddText('Ceremony details and warm family invitation text goes here.', 26, 'Noto Sans Devanagari', 'normal', '#CBD5E1')}
                    className="w-full p-2 rounded-xl bg-stone-950 border border-stone-800 hover:border-gold-400 text-left transition-colors"
                  >
                    <span className="text-xs text-stone-300 block">Add body text or schedule details</span>
                    <span className="text-[10px] text-stone-400">Regular Text (26px)</span>
                  </button>
                </div>

                {/* Auspicious Shlokas */}
                <div className="space-y-2 pt-2 border-t border-stone-800">
                  <span className="text-gold-400 uppercase tracking-wider text-[10px] font-bold block">
                    ★ Auspicious Sanskrit / Hindi Shlokas
                  </span>
                  {[
                    { title: 'Shri Ganesh Shloka', text: '|| श्री गणेशाय नमः ||' },
                    { title: 'Om Shri Ganeshaya', text: '|| ॐ श्री गणेशाय नमः ||' },
                    { title: 'Veda Mangalam', text: '|| मंगलम भगवान विष्णुः मंगलम गरुड़ध्वजः ||' },
                    { title: 'Devi Durga Shloka', text: '|| सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके ||' },
                    { title: 'Vastu Shanti Shloka', text: '|| ॐ वास्तु पुरुषाय नमः ||' },
                    { title: 'Om Namo Bhagavate', text: '|| ॐ नमो भगवते वासुदेवाय नमः ||' },
                  ].map((s) => (
                    <button
                      key={s.text}
                      onClick={() => handleAddText(s.text, 34, 'Noto Sans Devanagari', 'bold', '#FDE68A', 'shloka')}
                      className="w-full p-2 rounded-lg bg-stone-950 hover:bg-royal-950/80 border border-stone-800 hover:border-gold-400 text-left transition-colors flex items-center justify-between"
                    >
                      <span className="font-hindi text-xs font-bold text-gold-300">{s.text}</span>
                      <Plus className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                  ))}
                </div>

                {/* Ceremonial presets */}
                <div className="space-y-2 pt-2 border-t border-stone-800">
                  <span className="text-stone-400 uppercase tracking-wider text-[10px] font-bold block">
                    Ceremonial Text Lines
                  </span>
                  {[
                    { label: 'Shubh Vivah (शुभ विवाह)', text: 'SHUBH VIVAH' },
                    { label: 'Couple Names (आरव एवं अनन्या)', text: 'Aarav & Ananya' },
                    { label: 'Host Line (विनीत परिवार)', text: 'Mr. & Mrs. Sharma cordially invite you' },
                    { label: 'Date & Time', text: 'Sunday, 24th December 2026 | 7:00 PM' },
                    { label: 'Venue Address', text: 'The Grand Palace, Amber Fort Road, Jaipur' },
                  ].map((c) => (
                    <button
                      key={c.label}
                      onClick={() => handleAddText(c.text, 36, 'Cinzel', 'bold', '#FCD34D')}
                      className="w-full p-2 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-left transition-colors flex items-center justify-between"
                    >
                      <span className="text-xs text-stone-200">{c.label}</span>
                      <Plus className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: UPLOADS */}
            {activeSidebarTab === 'uploads' && (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full py-4 border-2 border-dashed border-gold-400/60 hover:border-gold-400 rounded-2xl bg-stone-950 hover:bg-stone-800 flex flex-col items-center justify-center space-y-1.5 transition-colors"
                >
                  <Upload className="w-6 h-6 text-gold-400" />
                  <span className="text-xs font-bold text-white">
                    {isUploading ? 'Uploading Image...' : 'Upload Image (JPG, PNG)'}
                  </span>
                  <span className="text-[10px] text-stone-400">100% Client-Side Privacy (Max 10MB)</span>
                </button>

                <div>
                  <span className="text-stone-400 uppercase tracking-wider text-[10px] font-bold block mb-2">
                    Your Uploaded Photos ({uploadedImages.length})
                  </span>

                  {uploadedImages.length === 0 ? (
                    <div className="text-center py-8 text-stone-500 bg-stone-950 rounded-xl border border-stone-800">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No photos uploaded yet.</p>
                      <p className="text-[10px] text-stone-600 mt-1">Uploaded photos stay strictly in your browser.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedImages.map((img) => (
                        <div
                          key={img.id}
                          onClick={() => handleAddImageToCanvas(img)}
                          className="group relative aspect-square rounded-xl overflow-hidden bg-stone-950 border border-stone-800 hover:border-gold-400 cursor-pointer"
                        >
                          <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                          <button
                            onClick={(e) => handleDeleteUpload(img.id, e)}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: BACKGROUNDS */}
            {activeSidebarTab === 'backgrounds' && (
              <div className="space-y-4">
                <div>
                  <span className="text-stone-400 uppercase tracking-wider text-[10px] font-bold block mb-2">
                    Solid Colors
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      '#FAF6EE', '#FFFDF9', '#4A0E4E', '#BE185D', '#4C0519',
                      '#1E1B4B', '#042F2E', '#1C1917', '#0F172A', '#FEF3C7',
                    ].map((col) => (
                      <button
                        key={col}
                        onClick={() => setBackground({ type: 'solid', color: col, gradient: undefined })}
                        className="w-10 h-10 rounded-xl border border-stone-700 shadow-sm hover:scale-105 transition-transform"
                        style={{ backgroundColor: col }}
                        title={col}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800">
                  <span className="text-stone-400 uppercase tracking-wider text-[10px] font-bold block mb-2">
                    Festive Gradients
                  </span>
                  <div className="space-y-2">
                    {[
                      { name: 'Royal Palace Shahi', from: '#3D0738', via: '#240322', to: '#120112' },
                      { name: 'Auspicious Crimson & Gold', from: '#4C0519', via: '#27020B', to: '#120005' },
                      { name: 'Imperial Emerald & Peacock', from: '#134E4A', via: '#042F2E', to: '#021C1C' },
                      { name: 'Midnight Diamond Indigo', from: '#1E1B4B', via: '#0F172A', to: '#020617' },
                      { name: 'Haldi Turmeric Glow', from: '#FFFBEB', via: '#FEF3C7', to: '#FDE68A' },
                    ].map((grad) => (
                      <button
                        key={grad.name}
                        onClick={() =>
                          setBackground({
                            type: 'gradient',
                            gradient: { type: 'radial', from: grad.from, via: grad.via, to: grad.to, angle: 180 },
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-800 hover:border-gold-400 flex items-center justify-between text-left"
                      >
                        <span className="text-xs text-white font-medium">{grad.name}</span>
                        <div
                          className="w-12 h-6 rounded-lg border border-stone-600"
                          style={{
                            background: `linear-gradient(to right, ${grad.from}, ${grad.to})`,
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: MOTIFS / STICKERS */}
            {activeSidebarTab === 'motifs' && (
              <div className="space-y-4">
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Click any sacred Indian vector motif to insert it on your canvas:
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {AVAILABLE_MOTIFS.map((m) => {
                    const dataUri = getMotifDataUri(m.type, m.defaultColor, m.defaultSecondaryColor);
                    return (
                      <button
                        key={m.type}
                        onClick={() => handleAddMotif(m)}
                        className="p-3 bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-gold-400 rounded-xl text-center flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105"
                      >
                        <img src={dataUri} alt={m.name} className="w-12 h-12 object-contain" />
                        <div>
                          <p className="text-[11px] font-semibold text-white">{m.name}</p>
                          <p className="font-hindi text-[10px] text-gold-400">{m.nameHindi}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 6: SHAPES */}
            {activeSidebarTab === 'shapes' && (
              <div className="space-y-3">
                <span className="text-stone-400 uppercase tracking-wider text-[10px] font-bold block">
                  Basic Shapes & Lines
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'Rectangle', type: 'rect' as const },
                    { label: 'Circle', type: 'circle' as const },
                    { label: 'Star', type: 'star' as const },
                    { label: 'Heart', type: 'heart' as const },
                    { label: 'Dividing Line', type: 'line' as const },
                  ].map((s) => (
                    <button
                      key={s.label}
                      onClick={() => handleAddShape(s.type)}
                      className="p-3 bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-gold-400 rounded-xl text-center transition-colors"
                    >
                      <span className="text-xs font-semibold text-white">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: LAYERS */}
            {activeSidebarTab === 'layers' && (
              <div className="space-y-2">
                <span className="text-stone-400 uppercase tracking-wider text-[10px] font-bold block mb-1">
                  Layer Ordering ({elements.length})
                </span>
                {elements.length === 0 ? (
                  <p className="text-stone-500 py-4 text-center">No elements on canvas.</p>
                ) : (
                  [...elements]
                    .sort((a, b) => b.zIndex - a.zIndex)
                    .map((el) => {
                      const isSelected = selectedElementIds.includes(el.id);
                      return (
                        <div
                          key={el.id}
                          onClick={() => selectElement(el.id)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-royal-950 border-gold-400 text-white'
                              : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-900'
                          }`}
                        >
                          <div className="truncate mr-2">
                            <p className="text-xs font-bold truncate">{el.name}</p>
                            <p className="text-[10px] text-stone-400 capitalize">{el.type}</p>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                reorderElement(el.id, 'forward');
                              }}
                              className="p-1 text-stone-400 hover:text-white"
                              title="Move Up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                reorderElement(el.id, 'backward');
                              }}
                              className="p-1 text-stone-400 hover:text-white"
                              title="Move Down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLock(el.id);
                              }}
                              className={`p-1 ${el.isLocked ? 'text-amber-400' : 'text-stone-400 hover:text-white'}`}
                              title={el.isLocked ? 'Unlock' : 'Lock'}
                            >
                              {el.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleVisibility(el.id);
                              }}
                              className={`p-1 ${el.isVisible === false ? 'text-stone-600' : 'text-stone-400 hover:text-white'}`}
                              title={el.isVisible === false ? 'Show' : 'Hide'}
                            >
                              {el.isVisible === false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeElement(el.id);
                              }}
                              className="p-1 text-stone-400 hover:text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
