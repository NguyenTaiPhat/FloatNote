export const CARD_TYPES = [
    'note',
    'website',
    'github',
    'youtube',
    'spotify',
    'movie',
    'tv',
    'reddit',
    'medium',
    'pdf',
    'image',
    'folder',
    'file',
    'todo',
    'checklist',
    'countdown',
    'calendar',
] as const;

export type CardType = typeof CARD_TYPES[number];

export const WIDGET_TYPES = [
    'todo',
    'movie-progress',
    'bookmarks',
    'countdown',
    'github-stars',
    'weather',
    'quote',
    'calendar',
    'clock',
    'system-monitor',
] as const;

export type WidgetType = typeof WIDGET_TYPES[number];

export const WORKSPACE_TYPES = [
    'personal',
    'coding',
    'movies',
    'school',
    'business',
    'photography',
] as const;

export type WorkspaceType = typeof WORKSPACE_TYPES[number];

export const SHORTCUTS = {
    GLOBAL_SEARCH: 'Alt+Space',
    COMMAND_PALETTE: 'Ctrl+Shift+P',
    BOSS_MODE: 'Ctrl+Alt+B',
    NEW_CARD: 'Ctrl+N',
    SAVE: 'Ctrl+S',
    DELETE: 'Delete',
    ESCAPE: 'Escape',
} as const;

// API Keys - now loaded from settings
// Users can configure these in Settings → API Keys
let cachedTmdbApiKey: string | undefined;
let cachedGithubToken: string | undefined;
let cachedYoutubeApiKey: string | undefined;

export async function getTmdbApiKey(): Promise<string | undefined> {
    if (typeof window === 'undefined') return undefined;

    if (!cachedTmdbApiKey) {
        const w = window as any;
        if (w.api?.settings) {
            cachedTmdbApiKey = await w.api.settings.get('tmdbApiKey');
        }
    }
    return cachedTmdbApiKey;
}

export async function getGithubToken(): Promise<string | undefined> {
    if (typeof window === 'undefined') return undefined;

    if (!cachedGithubToken) {
        const w = window as any;
        if (w.api?.settings) {
            cachedGithubToken = await w.api.settings.get('githubToken');
        }
    }
    return cachedGithubToken;
}

export async function getYoutubeApiKey(): Promise<string | undefined> {
    if (typeof window === 'undefined') return undefined;

    if (!cachedYoutubeApiKey) {
        const w = window as any;
        if (w.api?.settings) {
            cachedYoutubeApiKey = await w.api.settings.get('youtubeApiKey');
        }
    }
    return cachedYoutubeApiKey;
}

// Clear cache when settings change
export function clearApiKeyCache() {
    cachedTmdbApiKey = undefined;
    cachedGithubToken = undefined;
    cachedYoutubeApiKey = undefined;
}

// Legacy exports (deprecated - use async functions above)
export const TMDB_API_KEY = '';
export const GITHUB_TOKEN = '';

// Workspace colors
export const WORKSPACE_COLORS = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Green', value: '#10b981' },
    { name: 'Emerald', value: '#059669' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Sky', value: '#0ea5e9' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Fuchsia', value: '#d946ef' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Slate', value: '#64748b' },
] as const;

// Legacy colors (deprecated - use WORKSPACE_COLORS)
export const COLORS = {
    primary: '#3b82f6',
    purple: '#a855f7',
    pink: '#ec4899',
    orange: '#f97316',
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444',
    blue: '#3b82f6',
} as const;
