import { TemplateDefinition } from '@/types/template';
import {
  CanvasDimensions,
  CanvasBackground,
  CanvasElement,
  TextCanvasElement,
  StickerCanvasElement,
  ImageCanvasElement,
} from '@/types/editor';
import { getMotifDataUri } from './motifSvgHelper';

export interface ConvertedTemplateData {
  title: string;
  templateId: string;
  category: string;
  dimensions: CanvasDimensions;
  background: CanvasBackground;
  elements: CanvasElement[];
}

export function convertTemplateToCanvas(template: TemplateDefinition): ConvertedTemplateData {
  const dimensions: CanvasDimensions = {
    width: template.dimensions?.width || 1080,
    height: template.dimensions?.height || 1920,
    preset: 'portrait',
  };

  // Convert background
  const bg = template.background;
  const background: CanvasBackground = {
    type: bg?.type || 'gradient',
    color: bg?.color || '#FAF6EE',
    gradient: bg?.gradient
      ? {
          type: bg.gradient.type,
          from: bg.gradient.from,
          via: bg.gradient.via,
          to: bg.gradient.to,
          angle: bg.gradient.angle || 180,
        }
      : undefined,
    pattern: bg?.pattern || 'mandala',
    patternOpacity: bg?.patternOpacity ?? 0.08,
  };

  const elements: CanvasElement[] = [];
  let zCounter = 1;

  // Convert decorative elements into stickers
  if (Array.isArray(template.decorations)) {
    template.decorations.forEach((dec, idx) => {
      const color = dec.color || '#D4AF37';
      const secondaryColor = dec.secondaryColor || '#BE185D';
      const dataUri = getMotifDataUri(dec.type, color, secondaryColor);

      const stickerEl: StickerCanvasElement = {
        id: `dec-${dec.id || idx + 1}-${Date.now().toString(36)}`,
        name: `Motif: ${dec.type}`,
        type: 'sticker',
        stickerType: dec.type,
        x: dec.x,
        y: dec.y,
        width: dec.width,
        height: dec.height,
        rotation: dec.rotation || 0,
        opacity: dec.opacity ?? 1,
        color,
        secondaryColor,
        svgDataUri: dataUri,
        isLocked: false,
        isVisible: true,
        zIndex: zCounter++,
      };
      elements.push(stickerEl);
    });
  }

  // Convert text elements
  if (Array.isArray(template.texts)) {
    template.texts.forEach((txt, idx) => {
      // Font family mapping to exact font names
      let fontFamilyName = 'Noto Sans Devanagari';
      if (txt.fontFamily === 'serif') fontFamilyName = 'Cinzel';
      else if (txt.fontFamily === 'display') fontFamilyName = 'Rozha One';
      else if (txt.fontFamily === 'sans') fontFamilyName = 'Plus Jakarta Sans';
      else if (txt.fontFamily === 'cursive') fontFamilyName = 'Great Vibes';
      else if (txt.fontFamily === 'hindi') fontFamilyName = 'Noto Sans Devanagari';

      const content =
        template.defaultLanguage === 'hi'
          ? txt.contentHindi || txt.content || ''
          : txt.content || txt.contentHindi || '';

      const textEl: TextCanvasElement = {
        id: `txt-${txt.id || idx + 1}-${Date.now().toString(36)}`,
        name: txt.role ? `Text: ${txt.role}` : `Text ${idx + 1}`,
        type: 'text',
        text: content,
        x: txt.x,
        y: txt.y,
        width: txt.width,
        height: txt.height || Math.round(txt.fontSize * 1.5),
        fontSize: txt.fontSize || 32,
        fontFamily: fontFamilyName,
        fill: txt.color || '#FFFFFF',
        align: txt.align || 'center',
        fontStyle: txt.fontWeight === 'bold' ? 'bold' : 'normal',
        lineHeight: txt.lineHeight || 1.25,
        letterSpacing: txt.letterSpacing || 0,
        rotation: 0,
        opacity: 1,
        isLocked: false,
        isVisible: true,
        zIndex: zCounter++,
        role: txt.role,
      };
      elements.push(textEl);
    });
  }

  // Convert image placeholders
  if (Array.isArray(template.placeholders)) {
    template.placeholders.forEach((ph, idx) => {
      const placeholderEl: ImageCanvasElement = {
        id: `ph-${ph.id || idx + 1}-${Date.now().toString(36)}`,
        name: `Photo: ${ph.role}`,
        type: 'image',
        src:
          ph.placeholderSrc ||
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="%23262626" stroke="%23D4AF37" stroke-width="4" stroke-dasharray="8 8"/><text x="50%" y="48%" font-family="sans-serif" font-size="20" fill="%23D4AF37" text-anchor="middle" font-weight="bold">Upload Photo</text><text x="50%" y="54%" font-family="sans-serif" font-size="14" fill="%239CA3AF" text-anchor="middle">Click to Replace with Your Photo</text></svg>',
        x: ph.x,
        y: ph.y,
        width: ph.width,
        height: ph.height,
        rotation: 0,
        opacity: 1,
        borderRadius: ph.shape === 'circle' ? ph.width / 2 : 12,
        isLocked: false,
        isVisible: true,
        zIndex: zCounter++,
      };
      elements.push(placeholderEl);
    });
  }

  return {
    title: `${template.name} (My Invitation)`,
    templateId: template.id,
    category: template.category,
    dimensions,
    background,
    elements,
  };
}
