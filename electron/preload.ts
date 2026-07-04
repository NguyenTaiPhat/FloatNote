import { contextBridge, ipcRenderer } from 'electron';
import type { Card, Workspace } from './types';

contextBridge.exposeInMainWorld('electron', {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    createWidget: (options: any) => ipcRenderer.invoke('create-floating-widget', options),
    closeWidget: (id: string) => ipcRenderer.invoke('close-floating-widget', id),
    toggleEdgeDock: () => ipcRenderer.send('toggle-edge-dock'),
    toggleBossMode: () => ipcRenderer.send('toggle-boss-mode'),
    onGlobalSearch: (callback: () => void) => ipcRenderer.on('global-search-toggle', callback),
    onCommandPalette: (callback: () => void) => ipcRenderer.on('command-palette-toggle', callback),
    openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url),

    // Updater
    checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    onUpdateAvailable: (callback: (info: any) => void) => ipcRenderer.on('update-available', (_event, info) => callback(info)),
    onUpdateNotAvailable: (callback: () => void) => ipcRenderer.on('update-not-available', callback),
    onUpdateError: (callback: (error: string) => void) => ipcRenderer.on('update-error', (_event, error) => callback(error)),
});

contextBridge.exposeInMainWorld('api', {
    cards: {
        create: (card: Card) => ipcRenderer.invoke('cards:create', card),
        findById: (id: string) => ipcRenderer.invoke('cards:findById', id),
        findAll: (filters?: {
            type?: string;
            workspaceId?: string;
            favorite?: boolean;
            archived?: boolean;
        }) => ipcRenderer.invoke('cards:findAll', filters),
        update: (id: string, updates: Partial<Card>) => ipcRenderer.invoke('cards:update', id, updates),
        delete: (id: string) => ipcRenderer.invoke('cards:delete', id),
        search: (query: string) => ipcRenderer.invoke('cards:search', query),
    },
    workspaces: {
        create: (workspace: Workspace) => ipcRenderer.invoke('workspaces:create', workspace),
        findById: (id: string) => ipcRenderer.invoke('workspaces:findById', id),
        findAll: () => ipcRenderer.invoke('workspaces:findAll'),
        update: (id: string, updates: Partial<Workspace>) => ipcRenderer.invoke('workspaces:update', id, updates),
        delete: (id: string) => ipcRenderer.invoke('workspaces:delete', id),
    },
    backup: {
        create: () => ipcRenderer.invoke('backup:create'),
        list: () => ipcRenderer.invoke('backup:list'),
        restore: (backupPath: string) => ipcRenderer.invoke('backup:restore', backupPath),
        delete: (backupPath: string) => ipcRenderer.invoke('backup:delete', backupPath),
        export: () => ipcRenderer.invoke('backup:export'),
    },
    settings: {
        get: (key: string) => ipcRenderer.invoke('settings:get', key),
        getAll: () => ipcRenderer.invoke('settings:getAll'),
        set: (key: string, value: any) => ipcRenderer.invoke('settings:set', key, value),
        setMultiple: (updates: any) => ipcRenderer.invoke('settings:setMultiple', updates),
        delete: (key: string) => ipcRenderer.invoke('settings:delete', key),
        reset: () => ipcRenderer.invoke('settings:reset'),
    },
});
