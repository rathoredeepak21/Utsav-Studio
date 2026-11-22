export type EditorTool = 'select' | 'text' | 'stickers' | 'photos' | 'background' | 'audio' | 'layers';

export interface CanvasElement {
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
}

export interface EditorState {
  currentProjectId: string | null;
  projectTitle: string;
  activeTool: EditorTool;
  zoom: number;
  selectedElementId: string | null;
  elements: CanvasElement[];
  canvasWidth: number;
  canvasHeight: number;
  isDirty: boolean;
  history: CanvasElement[][];
  historyIndex: number;
  
  // Actions
  setProjectTitle: (title: string) => void;
  setActiveTool: (tool: EditorTool) => void;
  setZoom: (zoom: number) => void;
  selectElement: (id: string | null) => void;
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  undo: () => void;
  redo: () => void;
  resetEditor: () => void;
}
