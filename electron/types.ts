// Shared types for Electron process
// Duplicated from src/lib/types.ts to avoid compilation issues

export type CardType =
    | 'note'
    | 'website'
    | 'github'
    | 'youtube'
    | 'movie'
    | 'tv'
    | 'reddit'
    | 'medium'
    | 'pdf'
    | 'image'
    | 'folder'
    | 'file'
    | 'todo'
    | 'checklist'
    | 'countdown'
    | 'calendar';

export interface Card {
    id: string;
    type: CardType;
    title: string;
    description?: string;
    content?: string;
    url?: string;
    metadata?: Record<string, any>;
    tags?: string[];
    category?: string;
    color?: string;
    favorite?: boolean;
    archived?: boolean;
    workspaceId?: string;
    createdAt: string;
    updatedAt: string;
}

export type WorkspaceType = 'personal' | 'coding' | 'movies' | 'school' | 'business' | 'photography';

export interface Workspace {
    id: string;
    name: string;
    type: WorkspaceType;
    color: string;
    icon?: string;
    description?: string;
    pinned?: boolean;
    createdAt: string;
    updatedAt: string;
}
