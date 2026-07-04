import type { Card, Workspace } from '@lib/types';

export interface ElectronAPI {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    createWidget: (options: any) => Promise<string>;
    closeWidget: (id: string) => Promise<boolean>;
    toggleEdgeDock: () => void;
    toggleBossMode: () => void;
    onGlobalSearch: (callback: () => void) => void;
    onCommandPalette: (callback: () => void) => void;
    getAppVersion?: () => Promise<string>;
    checkForUpdates?: () => void;
    installUpdate?: () => void;
    setAutoUpdate?: (enabled: boolean) => void;
    onUpdateAvailable?: (callback: (info: any) => void) => void;
    onUpdateNotAvailable?: (callback: () => void) => void;
    onDownloadProgress?: (callback: (progress: number) => void) => void;
    onUpdateDownloaded?: (callback: (info: any) => void) => void;
    onUpdateError?: (callback: (error: string) => void) => void;
}

export interface API {
    cards: {
        create: (card: Card) => Promise<Card>;
        findById: (id: string) => Promise<Card | null>;
        findAll: (filters?: {
            type?: string;
            workspaceId?: string;
            favorite?: boolean;
            archived?: boolean;
        }) => Promise<Card[]>;
        update: (id: string, updates: Partial<Card>) => Promise<void>;
        delete: (id: string) => Promise<void>;
        search: (query: string) => Promise<Card[]>;
    };
    workspaces: {
        create: (workspace: Workspace) => Promise<Workspace>;
        findById: (id: string) => Promise<Workspace | null>;
        findAll: () => Promise<Workspace[]>;
        update: (id: string, updates: Partial<Workspace>) => Promise<void>;
        delete: (id: string) => Promise<void>;
    };
    backup: {
        create: () => Promise<boolean>;
        list: () => Promise<Array<{ name: string; path: string; date: Date; size: number }>>;
        restore: (backupPath: string) => Promise<boolean>;
        delete: (backupPath: string) => Promise<boolean>;
        export: () => Promise<boolean>;
    };
    settings: {
        get: (key: string) => Promise<any>;
        getAll: () => Promise<Record<string, any>>;
        set: (key: string, value: any) => Promise<boolean>;
        setMultiple: (updates: Record<string, any>) => Promise<boolean>;
        delete: (key: string) => Promise<boolean>;
        reset: () => Promise<boolean>;
    };
}

declare global {
    interface Window {
        electron: ElectronAPI;
        api: API;
    }
}
