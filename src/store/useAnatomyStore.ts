import { create } from 'zustand';
import { AnatomicalSystem, AnatomyPartData, RenderMode } from '../types/anatomy';
import { getDetailedAnatomyRecord } from '../data/anatomyParser';
import { ANATOMY_PARTS } from '../data/anatomyData';

interface AnatomyState {
  // Selection & Hover
  selectedPartId: string | null;
  selectedPartData: AnatomyPartData | null;
  hoveredPartId: string | null;
  hoveredPartData: AnatomyPartData | null;
  isolatedPartId: string | null;

  // Dissection Tool
  dissectedPartIds: string[];

  // Muscle Opacity (0.0 to 1.0)
  muscleOpacity: number;

  // Camera Target
  cameraTarget: [number, number, number] | null;

  // System Layer Toggles
  systemVisibility: Record<AnatomicalSystem, boolean>;

  // Visual & Presentation Modes
  renderMode: RenderMode;
  explodedView: boolean;

  // UI Drawer / Search State
  isSidebarOpen: boolean;
  searchTerm: string;

  // Store Actions
  selectPart: (
    id: string | null,
    targetCoords?: [number, number, number],
    userData?: Record<string, any>
  ) => void;
  hoverPart: (id: string | null, userData?: Record<string, any>) => void;
  setMuscleOpacity: (opacity: number) => void;
  dissectPart: (id: string) => void;
  restoreDissections: () => void;
  toggleSystem: (system: AnatomicalSystem) => void;
  setSystemVisibility: (system: AnatomicalSystem, visible: boolean) => void;
  setRenderMode: (mode: RenderMode) => void;
  setIsolatedPart: (id: string | null) => void;
  toggleExplodedView: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSearchTerm: (term: string) => void;
  resetView: () => void;

  // Computed Helpers
  getSelectedPartData: () => AnatomyPartData | null;
}

const DEFAULT_SYSTEM_VISIBILITY: Record<AnatomicalSystem, boolean> = {
  skeletal: true,
  muscular: true,
  cardiovascular: true,
  respiratory: true,
  digestive: true,
  nervous: true,
};

export const useAnatomyStore = create<AnatomyState>((set, get) => ({
  selectedPartId: null,
  selectedPartData: null,
  hoveredPartId: null,
  hoveredPartData: null,
  isolatedPartId: null,

  dissectedPartIds: [],
  muscleOpacity: 1.0,

  cameraTarget: null,

  systemVisibility: { ...DEFAULT_SYSTEM_VISIBILITY },
  renderMode: 'standard',
  explodedView: false,

  isSidebarOpen: true,
  searchTerm: '',

  selectPart: (id, targetCoords, userData) => {
    if (!id) {
      set({ selectedPartId: null, selectedPartData: null, cameraTarget: null });
      return;
    }

    const record =
      userData?.record ||
      ANATOMY_PARTS[id] ||
      getDetailedAnatomyRecord(id, userData);

    const coords = targetCoords || record?.coordinates || null;

    set({
      selectedPartId: id,
      selectedPartData: record,
      cameraTarget: coords,
      isSidebarOpen: true,
    });
  },

  hoverPart: (id, userData) => {
    if (!id) {
      set({ hoveredPartId: null, hoveredPartData: null });
      return;
    }

    const record =
      userData?.record ||
      ANATOMY_PARTS[id] ||
      getDetailedAnatomyRecord(id, userData);

    set({ hoveredPartId: id, hoveredPartData: record });
  },

  setMuscleOpacity: (opacity) => {
    set({ muscleOpacity: Math.max(0, Math.min(1, opacity)) });
  },

  dissectPart: (id) => {
    set((state) => ({
      dissectedPartIds: state.dissectedPartIds.includes(id)
        ? state.dissectedPartIds
        : [...state.dissectedPartIds, id],
      selectedPartId: null,
      selectedPartData: null,
    }));
  },

  restoreDissections: () => {
    set({ dissectedPartIds: [] });
  },

  toggleSystem: (system) => {
    set((state) => ({
      systemVisibility: {
        ...state.systemVisibility,
        [system]: !state.systemVisibility[system],
      },
    }));
  },

  setSystemVisibility: (system, visible) => {
    set((state) => ({
      systemVisibility: {
        ...state.systemVisibility,
        [system]: visible,
      },
    }));
  },

  setRenderMode: (mode) => {
    set({ renderMode: mode });
  },

  setIsolatedPart: (id) => {
    if (id === get().isolatedPartId) {
      set({ isolatedPartId: null });
    } else {
      set({ isolatedPartId: id, selectedPartId: id });
    }
  },

  toggleExplodedView: () => {
    set((state) => ({ explodedView: !state.explodedView }));
  },

  setSidebarOpen: (isOpen) => {
    set({ isSidebarOpen: isOpen });
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },

  resetView: () => {
    set({
      selectedPartId: null,
      selectedPartData: null,
      hoveredPartId: null,
      hoveredPartData: null,
      isolatedPartId: null,
      dissectedPartIds: [],
      muscleOpacity: 1.0,
      cameraTarget: [0, 0, 0],
      systemVisibility: { ...DEFAULT_SYSTEM_VISIBILITY },
      renderMode: 'standard',
      explodedView: false,
    });
  },

  getSelectedPartData: () => {
    const { selectedPartData, selectedPartId } = get();
    if (selectedPartData) return selectedPartData;
    if (selectedPartId) return ANATOMY_PARTS[selectedPartId] || getDetailedAnatomyRecord(selectedPartId);
    return null;
  },
}));

if (typeof window !== 'undefined') {
  (window as any).__anatomyStore = useAnatomyStore;
}

