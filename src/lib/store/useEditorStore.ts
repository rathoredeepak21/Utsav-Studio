import { create } from 'zustand';
import {
  CanvasDimensions,
  CanvasBackground,
  CanvasElement,
  CanvasHistoryState,
  CanvasDimensionPreset,
} from '@/types/editor';
import { TemplateDefinition } from '@/types/template';
import { convertTemplateToCanvas } from '../editor/templateConverter';
import { saveLocalProject } from '../storage/db';

const MAX_HISTORY = 30;

export type SidebarTab =
  | 'templates'
  | 'text'
  | 'uploads'
  | 'backgrounds'
  | 'motifs'
  | 'shapes'
  | 'layers';

interface EditorState {
  // Project metadata
  projectId: string;
  projectTitle: string;
  templateId?: string;
  category: string;

  // Canvas layout
  dimensions: CanvasDimensions;
  background: CanvasBackground;
  elements: CanvasElement[];
  selectedElementIds: string[];
  editingTextId: string | null;

  // Viewport / Camera
  zoom: number;
  pan: { x: number; y: number };

  // UI state
  activeSidebarTab: SidebarTab;
  isPreviewOpen: boolean;

  // Persistence
  saveStatus: 'saved' | 'saving' | 'unsaved';
  lastSavedAt?: number;

  // History for Undo / Redo
  past: CanvasHistoryState[];
  future: CanvasHistoryState[];

  // Actions
  initBlankProject: (preset?: CanvasDimensionPreset) => void;
  loadTemplate: (template: TemplateDefinition) => void;
  setProjectTitle: (title: string) => void;
  setDimensions: (width: number, height: number, preset: CanvasDimensionPreset) => void;
  setBackground: (background: Partial<CanvasBackground>) => void;
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, partial: Partial<CanvasElement>, skipHistory?: boolean) => void;
  removeElement: (id: string) => void;
  removeSelectedElements: () => void;
  duplicateElement: (id: string) => void;
  selectElement: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  reorderElement: (id: string, direction: 'front' | 'back' | 'forward' | 'backward') => void;
  toggleLock: (id: string) => void;
  toggleVisibility: (id: string) => void;
  setEditingTextId: (id: string | null) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setPan: (pan: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  setActiveSidebarTab: (tab: SidebarTab) => void;
  setIsPreviewOpen: (open: boolean) => void;
  recordHistory: () => void;
  undo: () => void;
  redo: () => void;
  saveProject: () => Promise<void>;
}

const DEFAULT_BACKGROUND: CanvasBackground = {
  type: 'gradient',
  color: '#FAF6EE',
  gradient: {
    type: 'linear',
    from: '#3D0738',
    via: '#240322',
    to: '#120112',
    angle: 180,
  },
  pattern: 'mandala',
  patternOpacity: 0.08,
};

export const useEditorStore = create<EditorState>((set, get) => ({
  projectId: `proj-${Date.now()}`,
  projectTitle: 'My Invitation Card',
  templateId: undefined,
  category: 'wedding',

  dimensions: {
    width: 1080,
    height: 1920,
    preset: 'portrait',
  },
  background: DEFAULT_BACKGROUND,
  elements: [],
  selectedElementIds: [],
  editingTextId: null,

  zoom: 0.35,
  pan: { x: 0, y: 0 },

  activeSidebarTab: 'text',
  isPreviewOpen: false,

  saveStatus: 'saved',
  lastSavedAt: undefined,

  past: [],
  future: [],

  initBlankProject: (preset = 'portrait') => {
    let width = 1080;
    let height = 1920;
    if (preset === 'landscape') {
      width = 1920;
      height = 1080;
    } else if (preset === 'square') {
      width = 1080;
      height = 1080;
    }

    set({
      projectId: `proj-${Date.now()}`,
      projectTitle: 'Untitled Invitation Card',
      templateId: undefined,
      category: 'wedding',
      dimensions: { width, height, preset },
      background: {
        type: 'solid',
        color: '#FAF6EE',
      },
      elements: [],
      selectedElementIds: [],
      editingTextId: null,
      saveStatus: 'saved',
      past: [],
      future: [],
    });
  },

  loadTemplate: (template: TemplateDefinition) => {
    const converted = convertTemplateToCanvas(template);
    set({
      projectId: `proj-${Date.now()}`,
      projectTitle: converted.title,
      templateId: converted.templateId,
      category: converted.category,
      dimensions: converted.dimensions,
      background: converted.background,
      elements: converted.elements,
      selectedElementIds: [],
      editingTextId: null,
      saveStatus: 'saved',
      past: [],
      future: [],
    });
  },

  setProjectTitle: (title: string) => {
    set({ projectTitle: title, saveStatus: 'unsaved' });
  },

  setDimensions: (width: number, height: number, preset: CanvasDimensionPreset) => {
    get().recordHistory();
    set({
      dimensions: { width, height, preset },
      saveStatus: 'unsaved',
    });
  },

  setBackground: (partial: Partial<CanvasBackground>) => {
    get().recordHistory();
    set((state) => ({
      background: { ...state.background, ...partial },
      saveStatus: 'unsaved',
    }));
  },

  addElement: (element: CanvasElement) => {
    get().recordHistory();
    set((state) => {
      const maxZ = state.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
      const newElement = { ...element, zIndex: maxZ + 1 };
      return {
        elements: [...state.elements, newElement],
        selectedElementIds: [newElement.id],
        saveStatus: 'unsaved',
      };
    });
  },

  updateElement: (id: string, partial: Partial<CanvasElement>, skipHistory = false) => {
    if (!skipHistory) {
      get().recordHistory();
    }
    set((state) => ({
      elements: state.elements.map((el) => (el.id === id ? ({ ...el, ...partial } as CanvasElement) : el)),
      saveStatus: 'unsaved',
    }));
  },

  removeElement: (id: string) => {
    get().recordHistory();
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElementIds: state.selectedElementIds.filter((elId) => elId !== id),
      saveStatus: 'unsaved',
    }));
  },

  removeSelectedElements: () => {
    const { selectedElementIds, elements } = get();
    if (selectedElementIds.length === 0) return;
    get().recordHistory();
    set({
      elements: elements.filter((el) => !selectedElementIds.includes(el.id)),
      selectedElementIds: [],
      saveStatus: 'unsaved',
    });
  },

  duplicateElement: (id: string) => {
    const el = get().elements.find((e) => e.id === id);
    if (!el) return;
    get().recordHistory();
    const maxZ = get().elements.reduce((max, e) => Math.max(max, e.zIndex), 0);
    const duplicated: CanvasElement = {
      ...JSON.parse(JSON.stringify(el)),
      id: `${el.type}-${Date.now().toString(36)}`,
      name: `${el.name} (Copy)`,
      x: el.x + 30,
      y: el.y + 30,
      zIndex: maxZ + 1,
    };
    set((state) => ({
      elements: [...state.elements, duplicated],
      selectedElementIds: [duplicated.id],
      saveStatus: 'unsaved',
    }));
  },

  selectElement: (id: string, multiSelect = false) => {
    set((state) => {
      if (multiSelect) {
        if (state.selectedElementIds.includes(id)) {
          return { selectedElementIds: state.selectedElementIds.filter((elId) => elId !== id) };
        }
        return { selectedElementIds: [...state.selectedElementIds, id] };
      }
      return { selectedElementIds: [id] };
    });
  },

  clearSelection: () => {
    set({ selectedElementIds: [], editingTextId: null });
  },

  reorderElement: (id: string, direction: 'front' | 'back' | 'forward' | 'backward') => {
    get().recordHistory();
    set((state) => {
      const elements = [...state.elements].sort((a, b) => a.zIndex - b.zIndex);
      const index = elements.findIndex((el) => el.id === id);
      if (index === -1) return {};

      if (direction === 'front') {
        const item = elements.splice(index, 1)[0];
        elements.push(item);
      } else if (direction === 'back') {
        const item = elements.splice(index, 1)[0];
        elements.unshift(item);
      } else if (direction === 'forward' && index < elements.length - 1) {
        const temp = elements[index];
        elements[index] = elements[index + 1];
        elements[index + 1] = temp;
      } else if (direction === 'backward' && index > 0) {
        const temp = elements[index];
        elements[index] = elements[index - 1];
        elements[index - 1] = temp;
      }

      const reindexed = elements.map((el, idx) => ({ ...el, zIndex: idx + 1 }));
      return { elements: reindexed, saveStatus: 'unsaved' };
    });
  },

  toggleLock: (id: string) => {
    get().recordHistory();
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? ({ ...el, isLocked: !el.isLocked } as CanvasElement) : el
      ),
      saveStatus: 'unsaved',
    }));
  },

  toggleVisibility: (id: string) => {
    get().recordHistory();
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? ({ ...el, isVisible: !el.isVisible } as CanvasElement) : el
      ),
      saveStatus: 'unsaved',
    }));
  },

  setEditingTextId: (id: string | null) => {
    set({ editingTextId: id });
  },

  setZoom: (zoom) => {
    set((state) => ({
      zoom: Math.min(Math.max(typeof zoom === 'function' ? zoom(state.zoom) : zoom, 0.15), 3.0),
    }));
  },

  setPan: (pan) => {
    set((state) => ({
      pan: typeof pan === 'function' ? pan(state.pan) : pan,
    }));
  },

  setActiveSidebarTab: (tab: SidebarTab) => {
    set({ activeSidebarTab: tab });
  },

  setIsPreviewOpen: (open: boolean) => {
    set({ isPreviewOpen: open });
  },

  recordHistory: () => {
    const { elements, background, dimensions, past } = get();
    const snapshot: CanvasHistoryState = {
      elements: JSON.parse(JSON.stringify(elements)),
      background: JSON.parse(JSON.stringify(background)),
      dimensions: { ...dimensions },
    };

    set({
      past: [...past.slice(-MAX_HISTORY), snapshot],
      future: [],
    });
  },

  undo: () => {
    const { past, future, elements, background, dimensions } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);

    const currentSnapshot: CanvasHistoryState = {
      elements: JSON.parse(JSON.stringify(elements)),
      background: JSON.parse(JSON.stringify(background)),
      dimensions: { ...dimensions },
    };

    set({
      past: newPast,
      future: [currentSnapshot, ...future],
      elements: previous.elements,
      background: previous.background,
      dimensions: previous.dimensions,
      selectedElementIds: [],
      editingTextId: null,
      saveStatus: 'unsaved',
    });
  },

  redo: () => {
    const { past, future, elements, background, dimensions } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    const currentSnapshot: CanvasHistoryState = {
      elements: JSON.parse(JSON.stringify(elements)),
      background: JSON.parse(JSON.stringify(background)),
      dimensions: { ...dimensions },
    };

    set({
      past: [...past, currentSnapshot],
      future: newFuture,
      elements: next.elements,
      background: next.background,
      dimensions: next.dimensions,
      selectedElementIds: [],
      editingTextId: null,
      saveStatus: 'unsaved',
    });
  },

  saveProject: async () => {
    const state = get();
    set({ saveStatus: 'saving' });
    try {
      await saveLocalProject({
        id: state.projectId,
        title: state.projectTitle,
        templateId: state.templateId,
        type: 'card',
        category: (state.category as any) || 'wedding',
        createdAt: Date.now(),
        lastModified: Date.now(),
        data: {
          canvasWidth: state.dimensions.width,
          canvasHeight: state.dimensions.height,
          background: state.background.color,
          elements: state.elements.map((el) => ({
            id: el.id,
            type: el.type === 'sticker' ? 'motif' : (el.type as any),
            x: el.x,
            y: el.y,
            width: el.width,
            height: el.height,
            rotation: el.rotation,
            opacity: el.opacity,
            content: el.type === 'text' ? el.text : undefined,
            fontSize: el.type === 'text' ? el.fontSize : undefined,
            fontFamily: el.type === 'text' ? el.fontFamily : undefined,
            fill: el.type === 'text' ? el.fill : undefined,
            align: el.type === 'text' ? el.align : undefined,
            src: el.type === 'image' ? el.src : undefined,
          })),
        },
      });
      set({ saveStatus: 'saved', lastSavedAt: Date.now() });
    } catch (err) {
      console.error('Failed to auto-save to IndexedDB:', err);
      set({ saveStatus: 'unsaved' });
    }
  },
}));
