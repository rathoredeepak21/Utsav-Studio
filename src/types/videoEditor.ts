import { EventCategory, DecorativeType } from './template';
import { CanvasBackground } from './editor';

export type VideoAspectRatio = '9:16' | '16:9' | '1:1';

export interface VideoDimensions {
  width: number;
  height: number;
  aspectRatio: VideoAspectRatio;
}

export type AnimationType =
  | 'none'
  | 'fade-in'
  | 'fade-out'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'zoom-in'
  | 'zoom-out'
  | 'rotate'
  | 'typewriter';

export type AnimationEasing =
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'bounce';

export interface ElementAnimationConfig {
  type: AnimationType;
  startTime: number; // In seconds from scene start
  duration: number; // In seconds
  easing: AnimationEasing;
}

export type TransitionType =
  | 'none'
  | 'crossfade'
  | 'fade-to-black'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in';

export interface SceneTransitionConfig {
  type: TransitionType;
  duration: number; // In seconds (e.g. 0.6s)
}

export interface VideoElementBase {
  id: string;
  name: string;
  type: 'text' | 'image' | 'sticker' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  zIndex: number;
  isLocked?: boolean;
  isVisible?: boolean;
  animation: ElementAnimationConfig;
}

export interface TextVideoElement extends VideoElementBase {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  align: 'left' | 'center' | 'right';
  fontStyle?: 'normal' | 'italic' | 'bold';
  lineHeight?: number;
  letterSpacing?: number;
  textShadow?: string;
}

export interface ImageVideoElement extends VideoElementBase {
  type: 'image';
  src: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  objectFit?: 'cover' | 'contain';
}

export interface StickerVideoElement extends VideoElementBase {
  type: 'sticker';
  stickerType: DecorativeType;
  color: string;
  secondaryColor?: string;
  svgDataUri: string;
}

export interface ShapeVideoElement extends VideoElementBase {
  type: 'shape';
  shapeType: 'rect' | 'circle' | 'star' | 'heart' | 'line';
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number;
}

export type VideoElement =
  | TextVideoElement
  | ImageVideoElement
  | StickerVideoElement
  | ShapeVideoElement;

export interface VideoScene {
  id: string;
  name: string;
  duration: number; // In seconds (e.g. 4.0)
  background: CanvasBackground;
  transition: SceneTransitionConfig;
  elements: VideoElement[];
}

export interface AudioTrackConfig {
  id: string;
  title: string;
  src: string; // Blob URL, Asset URL, or Synth preset
  isSynth?: boolean;
  synthPreset?: 'shehnai_sitar' | 'royal_dhol' | 'sacred_flute' | 'celebration' | 'acoustic_strings';
  volume: number; // 0 to 1
  startTime: number; // seconds in project timeline
  trimStart: number; // seconds inside audio file
  trimEnd?: number; // seconds inside audio file
  fadeInDuration: number; // seconds
  fadeOutDuration: number; // seconds
  isMuted: boolean;
}

export interface VideoProject {
  id: string;
  title: string;
  templateId?: string;
  category: EventCategory;
  aspectRatio: VideoAspectRatio;
  dimensions: { width: number; height: number };
  fps: number; // default 30
  scenes: VideoScene[];
  audio: AudioTrackConfig | null;
  lastModified: number;
  createdAt: number;
}

export interface StoredAudioTrack {
  id: string;
  name: string;
  blob: Blob;
  mimeType: string;
  duration: number;
  createdAt: number;
}

export interface VideoExportOptions {
  resolution: '1080p' | '720p' | '480p';
  format: 'mp4' | 'webm';
  fps: number;
  quality: 'high' | 'medium' | 'fast';
}
