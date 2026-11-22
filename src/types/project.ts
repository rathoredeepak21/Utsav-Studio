import { EventCategory, TemplateType } from './template';

export interface LocalProject {
  id: string;
  title: string;
  templateId?: string;
  type: TemplateType;
  category: EventCategory;
  thumbnail?: string;
  createdAt: number;
  lastModified: number;
  data: {
    canvasWidth: number;
    canvasHeight: number;
    background?: string;
    elements: Array<{
      id: string;
      type: 'text' | 'image' | 'shape' | 'motif' | 'frame';
      x: number;
      y: number;
      width: number;
      height: number;
      rotation?: number;
      opacity?: number;
      content?: string;
      fontSize?: number;
      fontFamily?: string;
      fill?: string;
      align?: 'left' | 'center' | 'right';
      src?: string;
    }>;
  };
}
