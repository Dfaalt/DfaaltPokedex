import { create } from "zustand";

// --- utils kecil (supaya file ini self-contained) ---
function getInitialDarkMode(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return true; // default ke dark
  } catch {
    return true; // default ke dark
  }
}

function applyTheme(isDark: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", isDark);
  try {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  } catch {}
}

export interface ExplorerState {
  // Search & Filter
  searchQuery: string;
  selectedTypes: string[];
  selectedGeneration: number | null;
  minBST: number;
  maxBST: number;

  // Sort
  sortBy:
    | "name-asc"
    | "name-desc"
    | "bst-asc"
    | "bst-desc"
    | "speed-asc"
    | "speed-desc"
    | "id-asc"
    | "id-desc";

  // Pagination
  currentPage: number;
  itemsPerPage: number;

  // UI State
  isDarkMode: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  toggleType: (type: string) => void;
  clearTypes: () => void;
  setGeneration: (gen: number | null) => void;
  setBSTRange: (min: number, max: number) => void;
  setSortBy: (sort: ExplorerState["sortBy"]) => void;
  setCurrentPage: (page: number) => void;
  toggleDarkMode: () => void;
  resetFilters: () => void;
}

export const useExplorerStore = create<ExplorerState>((set) => {
  const initialDark = getInitialDarkMode();
  // Terapkan tema sekali saat store dibuat (anti mismatch/FOUC)
  if (typeof document !== "undefined") applyTheme(initialDark);

  return {
    // Initial state
    searchQuery: "",
    selectedTypes: [],
    selectedGeneration: null,
    minBST: 0,
    maxBST: 800,
    sortBy: "id-asc",
    currentPage: 1,
    itemsPerPage: 20,
    isDarkMode: initialDark,

    // Actions
    setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),

    toggleType: (type) =>
      set((state) => ({
        selectedTypes: state.selectedTypes.includes(type)
          ? state.selectedTypes.filter((t) => t !== type)
          : [...state.selectedTypes, type],
        currentPage: 1,
      })),

    clearTypes: () => set({ selectedTypes: [], currentPage: 1 }),

    setGeneration: (gen) => set({ selectedGeneration: gen, currentPage: 1 }),

    setBSTRange: (min, max) =>
      set({ minBST: min, maxBST: max, currentPage: 1 }),

    setSortBy: (sort) => set({ sortBy: sort, currentPage: 1 }),

    setCurrentPage: (page) => set({ currentPage: page }),

    toggleDarkMode: () =>
      set((state) => {
        const newMode = !state.isDarkMode;
        applyTheme(newMode); // update <html> + simpan preferensi
        return { isDarkMode: newMode };
      }),

    resetFilters: () =>
      set({
        searchQuery: "",
        selectedTypes: [],
        selectedGeneration: null,
        minBST: 0,
        maxBST: 800,
        sortBy: "id-asc",
        currentPage: 1,
      }),
  };
});
