"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    minimize: () => electron_1.ipcRenderer.send('window-minimize'),
    maximize: () => electron_1.ipcRenderer.send('window-maximize'),
    close: () => electron_1.ipcRenderer.send('window-close'),
    createWidget: (options) => electron_1.ipcRenderer.invoke('create-floating-widget', options),
    closeWidget: (id) => electron_1.ipcRenderer.invoke('close-floating-widget', id),
    toggleEdgeDock: () => electron_1.ipcRenderer.send('toggle-edge-dock'),
    toggleBossMode: () => electron_1.ipcRenderer.send('toggle-boss-mode'),
    onGlobalSearch: (callback) => electron_1.ipcRenderer.on('global-search-toggle', callback),
    onCommandPalette: (callback) => electron_1.ipcRenderer.on('command-palette-toggle', callback),
    openExternal: (url) => electron_1.ipcRenderer.invoke('shell:openExternal', url),
    // Updater
    checkForUpdates: () => electron_1.ipcRenderer.invoke('check-for-updates'),
    installUpdate: () => electron_1.ipcRenderer.invoke('install-update'),
    setAutoUpdate: (enabled) => electron_1.ipcRenderer.invoke('set-auto-download', enabled),
    getAppVersion: () => electron_1.ipcRenderer.invoke('get-app-version'),
    onUpdateAvailable: (callback) => electron_1.ipcRenderer.on('update-available', (_event, info) => callback(info)),
    onUpdateNotAvailable: (callback) => electron_1.ipcRenderer.on('update-not-available', callback),
    onDownloadProgress: (callback) => electron_1.ipcRenderer.on('download-progress', (_event, percent) => callback(percent)),
    onUpdateDownloaded: (callback) => electron_1.ipcRenderer.on('update-downloaded', (_event, info) => callback(info)),
    onUpdateError: (callback) => electron_1.ipcRenderer.on('update-error', (_event, error) => callback(error)),
});
electron_1.contextBridge.exposeInMainWorld('api', {
    cards: {
        create: (card) => electron_1.ipcRenderer.invoke('cards:create', card),
        findById: (id) => electron_1.ipcRenderer.invoke('cards:findById', id),
        findAll: (filters) => electron_1.ipcRenderer.invoke('cards:findAll', filters),
        update: (id, updates) => electron_1.ipcRenderer.invoke('cards:update', id, updates),
        delete: (id) => electron_1.ipcRenderer.invoke('cards:delete', id),
        search: (query) => electron_1.ipcRenderer.invoke('cards:search', query),
    },
    workspaces: {
        create: (workspace) => electron_1.ipcRenderer.invoke('workspaces:create', workspace),
        findById: (id) => electron_1.ipcRenderer.invoke('workspaces:findById', id),
        findAll: () => electron_1.ipcRenderer.invoke('workspaces:findAll'),
        update: (id, updates) => electron_1.ipcRenderer.invoke('workspaces:update', id, updates),
        delete: (id) => electron_1.ipcRenderer.invoke('workspaces:delete', id),
    },
    backup: {
        create: () => electron_1.ipcRenderer.invoke('backup:create'),
        list: () => electron_1.ipcRenderer.invoke('backup:list'),
        restore: (backupPath) => electron_1.ipcRenderer.invoke('backup:restore', backupPath),
        delete: (backupPath) => electron_1.ipcRenderer.invoke('backup:delete', backupPath),
        export: () => electron_1.ipcRenderer.invoke('backup:export'),
    },
    settings: {
        get: (key) => electron_1.ipcRenderer.invoke('settings:get', key),
        getAll: () => electron_1.ipcRenderer.invoke('settings:getAll'),
        set: (key, value) => electron_1.ipcRenderer.invoke('settings:set', key, value),
        setMultiple: (updates) => electron_1.ipcRenderer.invoke('settings:setMultiple', updates),
        delete: (key) => electron_1.ipcRenderer.invoke('settings:delete', key),
        reset: () => electron_1.ipcRenderer.invoke('settings:reset'),
    },
});
