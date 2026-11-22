import { create } from 'zustand';
import { CanvasElement, EditorState, EditorTool } from '@/types/editor';

const INITIAL_CANVAS_WIDTH = 1080;
const INITIAL_CANVAS_HEIGHT = 1920;

export const useEditorStore = create<EditorState>((set, get) => ({
  currentProjectId: null,
  projectTitle: 'Untitled Celebration',
  activeTool: 'select',
  zoom: 0.5,
  selectedElementId: null,
  elements: [],
  canvasWidth: INITIAL_CANVAS_WIDTH,
  canvasHeight: INITIAL_CANVAS_HEIGHT,
  isDirty: false,
  history: [[]],
  historyIndex: 0,

  setProjectTitle: (title: string) => set({ projectTitle: title, isDirty: true }),

  setActiveTool: (tool: EditorTool) => set({ activeTool: tool }),

  setZoom: (zoom: number) => set({ zoom: Math.max(0.1, Math.min(2.0, zoom)) }),

  selectElement: (id: string | null) => set({ selectedElementId: id }),

  addElement: (element: CanvasElement) => {
    const { elements, history, historyIndex } = get();
    const newElements = [...elements, element];
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);

    set({
      elements: newElements,
      selectedElementId: element.id,
      isDirty: true,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  updateElement: (id: string, updates: Partial<CanvasElement>) => {
    const { elements } = get();
    const newElements = elements.map((el) => (el.id === id ? { ...el, ...updates } : el));
    set({ elements: newElements, isDirty: true });
  },

  deleteElement: (id: string) => {
    const { elements, history, historyIndex, selectedElementId } = get();
    const newElements = elements.filter((el) => el.id !== id);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);

    set({
      elements: newElements,
      selectedElementId: selectedElementId === id ? null : selectedElementId,
      isDirty: true,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      set({
        historyIndex: prevIndex,
        elements: history[prevIndex],
        selectedElementId: null,
        isDirty: true,
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      set({
        historyIndex: nextIndex,
        elements: history[nextIndex],
        selectedElementId: null,
        isDirty: true,
      });
    }
  },

  resetEditor: () =>
    set({
      currentProjectId: null,
      projectTitle: 'Untitled Celebration',
      activeTool: 'select',
      zoom: 0.5,
      selectedElementId: null,
      elements: [],
      canvasWidth: INITIAL_CANVAS_WIDTH,
      canvasHeight: INITIAL_CANVAS_HEIGHT,
      isDirty: false,
      history: [[]],
      historyIndex: 0,
    }),
}));
