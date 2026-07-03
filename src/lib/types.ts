import type { CardType, WidgetType, WorkspaceType } from './constants';

export interface Card {
    id: string;
    type: CardType;
    title: string;
    description?: string;
    content?: string;
    url?: string;
    metadata?: Record<string, unknown>;
    tags?: string[];
    category?: string;
    color?: string;
    favorite?: boolean;
    archived?: boolean;
    workspaceId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface NoteCard extends Card {
    type: 'note';
    content: string;
}

export interface WebsiteCard extends Card {
    type: 'website';
    url: string;
    metadata: {
        favicon?: string;
        ogImage?: string;
        dominantColor?: string;
        readingTime?: number;
        language?: string;
        lastVisited?: string;
    };
}

export interface GitHubCard extends Card {
    type: 'github';
    url: string;
    metadata: {
        owner: string;
        repo: string;
        description: string;
        language: string;
        stars: number;
        forks: number;
        license?: string;
        topics?: string[];
        avatar?: string;
        readme?: string;
    };
}

export interface YouTubeCard extends Card {
    type: 'youtube';
    url: string;
    metadata: {
        videoId: string;
        thumbnail: string;
        duration: string;
        channel: string;
        views: number;
        uploadDate: string;
        watchLater?: boolean;
    };
}

export interface MovieCard extends Card {
    type: 'movie';
    metadata: {
        tmdbId: number;
        imdbId?: string;
        poster: string;
        backdrop?: string;
        rating: number;
        genres: string[];
        runtime: number;
        releaseDate: string;
        trailer?: string;
        watchStatus?: 'want' | 'watching' | 'completed';
    };
}

export interface TodoCard extends Card {
    type: 'todo';
    content: string;
    metadata: {
        completed: boolean;
        dueDate?: string;
        priority?: 'low' | 'medium' | 'high';
    };
}

export interface Widget {
    id: string;
    type: WidgetType;
    cardId?: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    mode: 'compact' | 'normal' | 'expanded';
    opacity: number;
    alwaysOnTop: boolean;
    settings?: Record<string, unknown>;
    createdAt: string;
}

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

export interface Relationship {
    id: string;
    sourceCardId: string;
    targetCardId: string;
    type: 'related' | 'similar' | 'referenced' | 'derived';
    strength: number;
    createdAt: string;
}

export interface HistoryEntry {
    id: string;
    cardId: string;
    action: 'created' | 'updated' | 'deleted' | 'archived';
    snapshot?: Partial<Card>;
    timestamp: string;
}

export interface SearchResult {
    card: Card;
    score: number;
    matches: string[];
}
