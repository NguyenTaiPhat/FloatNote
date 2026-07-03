import { create } from 'zustand';

interface UIStore {
    isSearchOpen: boolean;
    isCommandPaletteOpen: boolean;
    isSidebarCollapsed: boolean;
    viewMode: 'grid' | 'list' | 'timeline';
    theme: 'dark' | 'light';

    toggleSearch: () => void;
    toggleCommandPalette: () => void;
    toggleSidebar: () => void;
    setViewMode: (mode: 'grid' | 'list' | 'timeline') => void;
    setTheme: (theme: 'dark' | 'light') => void;
}

export const useUIStore = create<UIStore>((set) => ({
    isSearchOpen: false,
    isCommandPaletteOpen: false,
    isSidebarCollapsed: false,
    viewMode: 'grid',
    theme: 'dark',

    toggleSearch: () => set(state => ({ isSearchOpen: !state.isSearchOpen })),
    toggleCommandPalette: () => set(state => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
    toggleSidebar: () => set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    setViewMode: (mode) => set({ viewMode: mode }),
    setTheme: (theme) => set({ theme }),
}));
