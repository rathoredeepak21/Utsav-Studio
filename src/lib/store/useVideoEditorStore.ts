import { create } from 'zustand';
import {
  VideoProject,
  VideoScene,
  VideoElement,
  AudioTrackConfig,
  VideoAspectRatio,
  SceneTransitionConfig,
} from '@/types/videoEditor';
import { TemplateDefinition } from '@/types/template';
import { convertTemplateToVideoProject } from '../video/templateToVideoConverter';
import { saveVideoProject } from '../storage/db';
import { startAudioPlayback, stopAudioPlayback, setAudioPlaybackVolume } from '../video/audioEngine';

export type VideoSidebarTab =
  | 'scenes'
  | 'templates'
  | 'text'
  | 'photos'
  | 'backgrounds'
  | 'stickers'
  | 'music'
  | 'transitions';

interface HistorySnapshot {
  scenes: VideoScene[];
  audioTrack: AudioTrackConfig | null;
}

const MAX_HISTORY = 25;

interface VideoEditorState {
  // Project
  projectId: string;
  projectTitle: string;
  templateId?: string;
  category: string;
  aspectRatio: VideoAspectRatio;
  dimensions: { width: number; height: number };
  fps: number;

  // Scenes & Elements
  scenes: VideoScene[];
  activeSceneId: string;
  selectedElementId: string | null;

  // Audio
  audioTrack: AudioTrackConfig | null;

  // Playback
  isPlaying: boolean;
  currentTime: number; // in seconds
  zoom: number;

  // Navigation & UI
  activeSidebarTab: VideoSidebarTab;
  isExportModalOpen: boolean;
  isPreviewModalOpen: boolean;

  // Persistence
  saveStatus: 'saved' | 'saving' | 'unsaved';
  lastSavedAt?: number;

  // Undo / Redo
  past: HistorySnapshot[];
  future: HistorySnapshot[];

  // Computed helper
  getTotalDuration: () => number;
  getActiveScene: () => VideoScene | undefined;
  getSelectedElement: () => VideoElement | undefined;

  // Actions
  initBlankProject: (ratio?: VideoAspectRatio) => void;
  loadProject: (project: VideoProject) => void;
  loadTemplate: (template: TemplateDefinition) => void;
  setProjectTitle: (title: string) => void;
  setAspectRatio: (ratio: VideoAspectRatio) => void;

  // Playback controls
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  stepTime: (time: number) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;

  // Scene management
  setActiveSceneId: (id: string) => void;
  addScene: (afterId?: string) => void;
  duplicateScene: (id: string) => void;
  deleteScene: (id: string) => void;
  reorderScenes: (startIndex: number, endIndex: number) => void;
  updateScene: (id: string, partial: Partial<VideoScene>) => void;
  updateSceneDuration: (id: string, duration: number) => void;
  updateSceneTransition: (id: string, transition: SceneTransitionConfig) => void;

  // Element management
  addElementToActiveScene: (element: VideoElement) => void;
  updateElement: (id: string, partial: Partial<VideoElement>, skipHistory?: boolean) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  selectElement: (id: string | null) => void;

  // Audio management
  setAudioTrack: (track: AudioTrackConfig | null) => void;
  updateAudioVolume: (volume: number) => void;
  updateAudioTrim: (trimStart: number, trimEnd?: number) => void;

  // UI state
  setActiveSidebarTab: (tab: VideoSidebarTab) => void;
  setIsExportModalOpen: (open: boolean) => void;
  setIsPreviewModalOpen: (open: boolean) => void;

  // History & Save
  recordHistory: () => void;
  undo: () => void;
  redo: () => void;
  saveProject: () => Promise<void>;
}

export const useVideoEditorStore = create<VideoEditorState>((set, get) => ({
  projectId: `vproj-${Date.now()}`,
  projectTitle: 'Grand Indian Wedding Video Invitation',
  category: 'wedding',
  aspectRatio: '9:16',
  dimensions: { width: 1080, height: 1920 },
  fps: 30,

  scenes: [],
  activeSceneId: '',
  selectedElementId: null,

  audioTrack: {
    id: `audio-${Date.now()}`,
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
  },

  isPlaying: false,
  currentTime: 0,
  zoom: 1,

  activeSidebarTab: 'scenes',
  isExportModalOpen: false,
  isPreviewModalOpen: false,

  saveStatus: 'saved',
  past: [],
  future: [],

  getTotalDuration: () => {
    return get().scenes.reduce((sum, s) => sum + s.duration, 0);
  },

  getActiveScene: () => {
    const { scenes, activeSceneId } = get();
    return scenes.find((s) => s.id === activeSceneId) || scenes[0];
  },

  getSelectedElement: () => {
    const { scenes, selectedElementId } = get();
    if (!selectedElementId) return undefined;
    for (const scene of scenes) {
      const found = scene.elements.find((el) => el.id === selectedElementId);
      if (found) return found;
    }
    return undefined;
  },

  initBlankProject: (ratio = '9:16') => {
    const width = ratio === '9:16' ? 1080 : ratio === '16:9' ? 1920 : 1080;
    const height = ratio === '9:16' ? 1920 : ratio === '16:9' ? 1080 : 1080;

    const initialScene: VideoScene = {
      id: `scene-1-${Date.now()}`,
      name: 'Scene 1: Introduction',
      duration: 4.0,
      background: {
        type: 'gradient',
        color: '#2B052A',
        gradient: {
          type: 'linear',
          from: '#3B0736',
          via: '#240322',
          to: '#120112',
          angle: 180,
        },
        pattern: 'mandala',
        patternOpacity: 0.08,
      },
      transition: { type: 'crossfade', duration: 0.6 },
      elements: [
        {
          id: `txt-welcome-${Date.now()}`,
          name: 'Welcome Text',
          type: 'text',
          text: 'Har Khushi Ka Digital Nimantaran',
          fontSize: 48,
          fontFamily: 'Rozha One',
          fill: '#FCD34D',
          align: 'center',
          fontStyle: 'bold',
          x: 100,
          y: 860,
          width: 880,
          height: 120,
          zIndex: 10,
          animation: {
            type: 'fade-in',
            startTime: 0.2,
            duration: 0.8,
            easing: 'ease-out',
          },
        },
      ],
    };

    set({
      projectId: `vproj-${Date.now()}`,
      projectTitle: 'My Video Invitation',
      aspectRatio: ratio,
      dimensions: { width, height },
      scenes: [initialScene],
      activeSceneId: initialScene.id,
      selectedElementId: null,
      currentTime: 0,
      isPlaying: false,
      saveStatus: 'unsaved',
      past: [],
      future: [],
    });
  },

  loadProject: (project) => {
    stopAudioPlayback();
    set({
      projectId: project.id,
      projectTitle: project.title,
      templateId: project.templateId,
      category: project.category,
      aspectRatio: project.aspectRatio,
      dimensions: project.dimensions,
      fps: project.fps || 30,
      scenes: project.scenes,
      activeSceneId: project.scenes[0]?.id || '',
      selectedElementId: null,
      audioTrack: project.audio,
      currentTime: 0,
      isPlaying: false,
      saveStatus: 'saved',
      past: [],
      future: [],
    });
  },

  loadTemplate: (template) => {
    stopAudioPlayback();
    const project = convertTemplateToVideoProject(template);
    set({
      projectId: project.id,
      projectTitle: project.title,
      templateId: project.templateId,
      category: project.category,
      aspectRatio: project.aspectRatio,
      dimensions: project.dimensions,
      fps: project.fps,
      scenes: project.scenes,
      activeSceneId: project.scenes[0]?.id || '',
      selectedElementId: null,
      audioTrack: project.audio,
      currentTime: 0,
      isPlaying: false,
      saveStatus: 'unsaved',
      past: [],
      future: [],
    });
  },

  setProjectTitle: (title) => {
    set({ projectTitle: title, saveStatus: 'unsaved' });
  },

  setAspectRatio: (ratio) => {
    const width = ratio === '9:16' ? 1080 : ratio === '16:9' ? 1920 : 1080;
    const height = ratio === '9:16' ? 1920 : ratio === '16:9' ? 1080 : 1080;
    set({
      aspectRatio: ratio,
      dimensions: { width, height },
      saveStatus: 'unsaved',
    });
  },

  // Playback
  play: () => {
    const { currentTime, audioTrack, getTotalDuration } = get();
    const total = getTotalDuration();
    if (currentTime >= total) {
      set({ currentTime: 0 });
    }
    set({ isPlaying: true });
    startAudioPlayback(audioTrack, get().currentTime, total);
  },

  pause: () => {
    set({ isPlaying: false });
    stopAudioPlayback();
  },

  togglePlay: () => {
    const { isPlaying, play, pause } = get();
    if (isPlaying) pause();
    else play();
  },

  seek: (time) => {
    const total = get().getTotalDuration();
    const clampedTime = Math.max(0, Math.min(total, time));

    let accum = 0;
    let targetSceneId = get().scenes[0]?.id || '';
    for (const s of get().scenes) {
      if (clampedTime >= accum && clampedTime <= accum + s.duration) {
        targetSceneId = s.id;
        break;
      }
      accum += s.duration;
    }

    set({ currentTime: clampedTime, activeSceneId: targetSceneId });

    if (get().isPlaying) {
      startAudioPlayback(get().audioTrack, clampedTime, total);
    } else {
      stopAudioPlayback();
    }
  },

  stepTime: (time) => {
    const total = get().getTotalDuration();
    const clampedTime = Math.max(0, Math.min(total, time));

    let accum = 0;
    let targetSceneId = get().scenes[0]?.id || '';
    for (const s of get().scenes) {
      if (clampedTime >= accum && clampedTime <= accum + s.duration) {
        targetSceneId = s.id;
        break;
      }
      accum += s.duration;
    }

    set({ currentTime: clampedTime, activeSceneId: targetSceneId });
  },

  setZoom: (zoom) => {
    set((state) => ({
      zoom: typeof zoom === 'function' ? zoom(state.zoom) : zoom,
    }));
  },

  setActiveSceneId: (id) => {
    // Jump time to start of this scene
    let accum = 0;
    for (const s of get().scenes) {
      if (s.id === id) break;
      accum += s.duration;
    }
    set({ activeSceneId: id, currentTime: accum, selectedElementId: null });
  },

  // Scene CRUD
  addScene: (afterId) => {
    get().recordHistory();
    const { scenes } = get();
    const newScene: VideoScene = {
      id: `scene-${Date.now()}`,
      name: `Scene ${scenes.length + 1}`,
      duration: 3.5,
      background: {
        type: 'gradient',
        color: '#240322',
        gradient: {
          type: 'linear',
          from: '#3D0738',
          via: '#240322',
          to: '#120112',
          angle: 180,
        },
        pattern: 'mandala',
        patternOpacity: 0.08,
      },
      transition: { type: 'crossfade', duration: 0.6 },
      elements: [],
    };

    let updatedScenes: VideoScene[];
    if (afterId) {
      const idx = scenes.findIndex((s) => s.id === afterId);
      if (idx !== -1) {
        updatedScenes = [
          ...scenes.slice(0, idx + 1),
          newScene,
          ...scenes.slice(idx + 1),
        ];
      } else {
        updatedScenes = [...scenes, newScene];
      }
    } else {
      updatedScenes = [...scenes, newScene];
    }

    set({
      scenes: updatedScenes,
      activeSceneId: newScene.id,
      selectedElementId: null,
      saveStatus: 'unsaved',
    });
  },

  duplicateScene: (id) => {
    get().recordHistory();
    const { scenes } = get();
    const target = scenes.find((s) => s.id === id);
    if (!target) return;

    const cloned: VideoScene = {
      ...JSON.parse(JSON.stringify(target)),
      id: `scene-copy-${Date.now()}`,
      name: `${target.name} (Copy)`,
    };

    const idx = scenes.findIndex((s) => s.id === id);
    const updated = [
      ...scenes.slice(0, idx + 1),
      cloned,
      ...scenes.slice(idx + 1),
    ];

    set({
      scenes: updated,
      activeSceneId: cloned.id,
      selectedElementId: null,
      saveStatus: 'unsaved',
    });
  },

  deleteScene: (id) => {
    const { scenes } = get();
    if (scenes.length <= 1) {
      alert('A video invitation must have at least one scene.');
      return;
    }
    get().recordHistory();

    const updated = scenes.filter((s) => s.id !== id);
    const nextActiveId = updated[0]?.id || '';

    set({
      scenes: updated,
      activeSceneId: nextActiveId,
      selectedElementId: null,
      saveStatus: 'unsaved',
    });
  },

  reorderScenes: (startIndex, endIndex) => {
    get().recordHistory();
    const { scenes } = get();
    const result = Array.from(scenes);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    set({ scenes: result, saveStatus: 'unsaved' });
  },

  updateScene: (id, partial) => {
    set((state) => ({
      scenes: state.scenes.map((s) => (s.id === id ? { ...s, ...partial } : s)),
      saveStatus: 'unsaved',
    }));
  },

  updateSceneDuration: (id, duration) => {
    get().recordHistory();
    const clamped = Math.max(1, Math.min(30, duration));
    set((state) => ({
      scenes: state.scenes.map((s) => (s.id === id ? { ...s, duration: clamped } : s)),
      saveStatus: 'unsaved',
    }));
  },

  updateSceneTransition: (id, transition) => {
    get().recordHistory();
    set((state) => ({
      scenes: state.scenes.map((s) =>
        s.id === id ? { ...s, transition } : s
      ),
      saveStatus: 'unsaved',
    }));
  },

  // Element CRUD
  addElementToActiveScene: (element) => {
    get().recordHistory();
    const { scenes, activeSceneId } = get();
    const updated = scenes.map((s) => {
      if (s.id === activeSceneId) {
        return {
          ...s,
          elements: [...s.elements, element],
        };
      }
      return s;
    });

    set({
      scenes: updated,
      selectedElementId: element.id,
      saveStatus: 'unsaved',
    });
  },

  updateElement: (id, partial, skipHistory = false) => {
    if (!skipHistory) {
      get().recordHistory();
    }
    set((state) => ({
      scenes: state.scenes.map((scene) => ({
        ...scene,
        elements: scene.elements.map((el) =>
          el.id === id ? ({ ...el, ...partial } as VideoElement) : el
        ),
      })),
      saveStatus: 'unsaved',
    }));
  },

  deleteElement: (id) => {
    get().recordHistory();
    set((state) => ({
      scenes: state.scenes.map((scene) => ({
        ...scene,
        elements: scene.elements.filter((el) => el.id !== id),
      })),
      selectedElementId: null,
      saveStatus: 'unsaved',
    }));
  },

  duplicateElement: (id) => {
    get().recordHistory();
    const { scenes, activeSceneId } = get();
    const activeScene = scenes.find((s) => s.id === activeSceneId);
    if (!activeScene) return;

    const el = activeScene.elements.find((e) => e.id === id);
    if (!el) return;

    const cloned: VideoElement = {
      ...JSON.parse(JSON.stringify(el)),
      id: `${el.id}-copy-${Date.now()}`,
      name: `${el.name} (Copy)`,
      x: el.x + 30,
      y: el.y + 30,
      zIndex: el.zIndex + 1,
    };

    const updated = scenes.map((s) =>
      s.id === activeSceneId ? { ...s, elements: [...s.elements, cloned] } : s
    );

    set({
      scenes: updated,
      selectedElementId: cloned.id,
      saveStatus: 'unsaved',
    });
  },

  selectElement: (id) => {
    set({ selectedElementId: id });
  },

  // Audio
  setAudioTrack: (track) => {
    get().recordHistory();
    stopAudioPlayback();
    set({ audioTrack: track, saveStatus: 'unsaved' });
    if (get().isPlaying) {
      startAudioPlayback(track, get().currentTime, get().getTotalDuration());
    }
  },

  updateAudioVolume: (volume) => {
    const clamped = Math.max(0, Math.min(1, volume));
    set((state) => ({
      audioTrack: state.audioTrack ? { ...state.audioTrack, volume: clamped } : null,
      saveStatus: 'unsaved',
    }));
    setAudioPlaybackVolume(clamped);
  },

  updateAudioTrim: (trimStart, trimEnd) => {
    get().recordHistory();
    set((state) => ({
      audioTrack: state.audioTrack
        ? { ...state.audioTrack, trimStart, trimEnd }
        : null,
      saveStatus: 'unsaved',
    }));
  },

  // UI Navigation
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  setIsExportModalOpen: (open) => set({ isExportModalOpen: open }),
  setIsPreviewModalOpen: (open) => set({ isPreviewModalOpen: open }),

  // History & Undo / Redo
  recordHistory: () => {
    const { scenes, audioTrack, past } = get();
    const snapshot: HistorySnapshot = {
      scenes: JSON.parse(JSON.stringify(scenes)),
      audioTrack: audioTrack ? JSON.parse(JSON.stringify(audioTrack)) : null,
    };
    set({
      past: [...past.slice(-MAX_HISTORY), snapshot],
      future: [],
    });
  },

  undo: () => {
    const { past, future, scenes, audioTrack } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);

    const currentSnapshot: HistorySnapshot = {
      scenes: JSON.parse(JSON.stringify(scenes)),
      audioTrack: audioTrack ? JSON.parse(JSON.stringify(audioTrack)) : null,
    };

    set({
      scenes: previous.scenes,
      audioTrack: previous.audioTrack,
      past: newPast,
      future: [currentSnapshot, ...future],
      saveStatus: 'unsaved',
    });
  },

  redo: () => {
    const { past, future, scenes, audioTrack } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    const currentSnapshot: HistorySnapshot = {
      scenes: JSON.parse(JSON.stringify(scenes)),
      audioTrack: audioTrack ? JSON.parse(JSON.stringify(audioTrack)) : null,
    };

    set({
      scenes: next.scenes,
      audioTrack: next.audioTrack,
      past: [...past, currentSnapshot],
      future: newFuture,
      saveStatus: 'unsaved',
    });
  },

  // Save Project to IndexedDB
  saveProject: async () => {
    const state = get();
    set({ saveStatus: 'saving' });

    const project: VideoProject = {
      id: state.projectId,
      title: state.projectTitle,
      templateId: state.templateId,
      category: state.category as VideoProject['category'],
      aspectRatio: state.aspectRatio,
      dimensions: state.dimensions,
      fps: state.fps,
      scenes: state.scenes,
      audio: state.audioTrack,
      lastModified: Date.now(),
      createdAt: Date.now(),
    };

    try {
      await saveVideoProject(project);
      set({ saveStatus: 'saved', lastSavedAt: Date.now() });
    } catch (err) {
      console.error('Failed to save video project in IndexedDB:', err);
      set({ saveStatus: 'unsaved' });
    }
  },
}));
