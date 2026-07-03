"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
const cards_1 = require("./ipc/cards");
const workspaces_1 = require("./ipc/workspaces");
const settings_1 = require("./ipc/settings");
const backup_1 = require("./backup");
const updater_1 = require("./updater");
let mainWindow = null;
let floatingWindows = new Map();
let edgeDock = null;
let bossMode = false;
let backupManager = null;
const isDev = !electron_1.app.isPackaged;
function createMainWindow() {
    const iconPath = isDev
        ? path_1.default.join(__dirname, '../assets/icon.ico')
        : path_1.default.join(process.resourcesPath, 'assets/icon.ico');
    mainWindow = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        frame: false,
        transparent: false,
        backgroundColor: '#0a0a0a',
        icon: iconPath,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false
        },
    });
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path_1.default.join(__dirname, '../dist/index.html'));
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
function createFloatingWidget(options) {
    const widget = new electron_1.BrowserWindow({
        width: options.width || 300,
        height: options.height || 400,
        frame: false,
        transparent: true,
        alwaysOnTop: options.alwaysOnTop !== false,
        skipTaskbar: true,
        resizable: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            preload: path_1.default.join(__dirname, 'preload.js'),
        },
    });
    const widgetUrl = isDev
        ? `http://localhost:5173/#/widget/${options.type}`
        : `file://${path_1.default.join(__dirname, '../dist/index.html#/widget/')}${options.type}`;
    widget.loadURL(widgetUrl);
    const id = Date.now().toString();
    floatingWindows.set(id, widget);
    widget.on('closed', () => {
        floatingWindows.delete(id);
    });
    return id;
}
function createEdgeDock() {
    const { screen } = require('electron');
    const display = screen.getPrimaryDisplay();
    const { height } = display.workAreaSize;
    edgeDock = new electron_1.BrowserWindow({
        width: 4,
        height: height,
        x: 0,
        y: 0,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            preload: path_1.default.join(__dirname, 'preload.js'),
        },
    });
    const dockUrl = isDev
        ? 'http://localhost:5173/#/edge-dock'
        : `file://${path_1.default.join(__dirname, '../dist/index.html#/edge-dock')}`;
    edgeDock.loadURL(dockUrl);
    edgeDock.setIgnoreMouseEvents(false);
}
function toggleBossMode() {
    bossMode = !bossMode;
    if (bossMode) {
        if (mainWindow)
            mainWindow.hide();
        floatingWindows.forEach(widget => widget.hide());
        if (edgeDock)
            edgeDock.hide();
    }
    else {
        if (mainWindow)
            mainWindow.show();
        floatingWindows.forEach(widget => widget.show());
        if (edgeDock)
            edgeDock.show();
    }
}
electron_1.app.whenReady().then(() => {
    // Initialize database
    (0, database_1.initDatabase)();
    // Initialize backup manager
    const dbPath = path_1.default.join(electron_1.app.getPath('userData'), 'floatnote.db');
    backupManager = new backup_1.BackupManager(dbPath);
    backupManager.start(60); // Auto backup every 60 minutes
    // Setup IPC handlers
    (0, cards_1.setupCardHandlers)();
    (0, workspaces_1.setupWorkspaceHandlers)();
    (0, settings_1.setupSettingsHandlers)();
    // Shell handlers
    electron_1.ipcMain.handle('shell:openExternal', async (_event, url) => {
        await electron_1.shell.openExternal(url);
    });
    createMainWindow();
    // Setup auto-updater
    if (mainWindow && !isDev) {
        (0, updater_1.setupAutoUpdater)(mainWindow);
    }
    // Global shortcuts
    electron_1.globalShortcut.register('Alt+Space', () => {
        if (mainWindow) {
            mainWindow.webContents.send('global-search-toggle');
        }
    });
    electron_1.globalShortcut.register('CommandOrControl+Shift+P', () => {
        if (mainWindow) {
            mainWindow.webContents.send('command-palette-toggle');
        }
    });
    electron_1.globalShortcut.register('CommandOrControl+Alt+B', () => {
        toggleBossMode();
    });
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (backupManager) {
        backupManager.stop();
    }
    (0, database_1.closeDatabase)();
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('will-quit', () => {
    electron_1.globalShortcut.unregisterAll();
    if (backupManager) {
        backupManager.stop();
    }
    (0, database_1.closeDatabase)();
});
// Window IPC handlers
electron_1.ipcMain.on('window-minimize', () => {
    if (mainWindow)
        mainWindow.minimize();
});
electron_1.ipcMain.on('window-maximize', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        }
        else {
            mainWindow.maximize();
        }
    }
});
electron_1.ipcMain.on('window-close', () => {
    if (mainWindow)
        mainWindow.close();
});
electron_1.ipcMain.handle('create-floating-widget', (_event, options) => {
    return createFloatingWidget(options);
});
electron_1.ipcMain.handle('close-floating-widget', (_event, id) => {
    const widget = floatingWindows.get(id);
    if (widget) {
        widget.close();
        return true;
    }
    return false;
});
electron_1.ipcMain.on('toggle-edge-dock', () => {
    if (edgeDock) {
        edgeDock.close();
        edgeDock = null;
    }
    else {
        createEdgeDock();
    }
});
electron_1.ipcMain.on('toggle-boss-mode', () => {
    toggleBossMode();
});
// Backup IPC handlers
electron_1.ipcMain.handle('backup:create', () => {
    return backupManager?.createBackup() || false;
});
electron_1.ipcMain.handle('backup:list', () => {
    return backupManager?.listBackups() || [];
});
electron_1.ipcMain.handle('backup:restore', (_event, backupPath) => {
    return backupManager?.restoreBackup(backupPath) || false;
});
electron_1.ipcMain.handle('backup:delete', (_event, backupPath) => {
    return backupManager?.deleteBackup(backupPath) || false;
});
electron_1.ipcMain.handle('backup:export', async () => {
    if (!mainWindow)
        return false;
    const result = await electron_1.dialog.showSaveDialog(mainWindow, {
        title: 'Export Database',
        defaultPath: `floatnote-export-${new Date().toISOString().split('T')[0]}.db`,
        filters: [
            { name: 'Database Files', extensions: ['db'] },
            { name: 'All Files', extensions: ['*'] },
        ],
    });
    if (result.canceled || !result.filePath) {
        return false;
    }
    return backupManager?.exportDatabase(result.filePath) || false;
});
