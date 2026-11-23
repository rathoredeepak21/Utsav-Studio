import { EventCategory, TemplateType, DecorativeType } from './template';

export type CanvasDimensionPreset = 'portrait' | 'landscape' | 'square' | 'custom';

export interface CanvasDimensions {
  width: number;
  height: number;
  preset: CanvasDimensionPreset;
}

export interface CanvasBackground {
  type: 'solid' | 'gradient' | 'pattern';
  color: string;
  gradient?: {
    type: 'linear' | 'radial';
    from: string;
    via?: string;
    to: string;
    angle?: number;
  };
  pattern?: 'mandala' | 'dots' | 'damask' | 'gold_dust' | 'none';
  patternOpacity?: number;
}

export type CanvasElementType = 'text' | 'image' | 'sticker' | 'shape';

export type ShapeType = 'rect' | 'circle' | 'star' | 'heart' | 'line';

export interface BaseCanvasElement {
  id: string;
  name: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  isLocked: boolean;
  isVisible: boolean;
  zIndex: number;
}

export interface TextCanvasElement extends BaseCanvasElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  align: 'left' | 'center' | 'right';
  fontStyle?: 'normal' | 'bold' | 'italic' | 'bold italic';
  lineHeight?: number;
  letterSpacing?: number;
  role?: string;
}

export interface ImageCanvasElement extends BaseCanvasElement {
  type: 'image';
  src: string;
  originalWidth?: number;
  originalHeight?: number;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  borderRadius?: number;
}

export interface StickerCanvasElement extends BaseCanvasElement {
  type: 'sticker';
  stickerType: DecorativeType;
  color: string;
  secondaryColor?: string;
  svgDataUri?: string;
}

export interface ShapeCanvasElement extends BaseCanvasElement {
  type: 'shape';
  shapeType: ShapeType;
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius?: number;
}

export type CanvasElement =
  | TextCanvasElement
  | ImageCanvasElement
  | StickerCanvasElement
  | ShapeCanvasElement;

export interface CanvasHistoryState {
  elements: CanvasElement[];
  background: CanvasBackground;
  dimensions: CanvasDimensions;
}

export interface UserUploadedImage {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
  size: number;
  createdAt: number;
}
