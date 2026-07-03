import { app, BrowserWindow, globalShortcut, ipcMain, dialog, shell } from 'electron';
import path from 'path';
import { initDatabase, closeDatabase } from './database';
import { setupCardHandlers } from './ipc/cards';
import { setupWorkspaceHandlers } from './ipc/workspaces';
import { setupSettingsHandlers } from './ipc/settings';
import { BackupManager } from './backup';
import { setupAutoUpdater } from './updater';

let mainWindow: BrowserWindow | null = null;
let floatingWindows = new Map<string, BrowserWindow>();
let edgeDock: BrowserWindow | null = null;
let bossMode = false;
let backupManager: BackupManager | null = null;

const isDev = !app.isPackaged;

function createMainWindow(): void {
    const iconPath = isDev
        ? path.join(__dirname, '../assets/icon.ico')
        : path.join(process.resourcesPath, 'assets/icon.ico');

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        frame: false,
        transparent: false,
        backgroundColor: '#0a0a0a',
        icon: iconPath,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false
        },
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createFloatingWidget(options: {
    type: string;
    width?: number;
    height?: number;
    alwaysOnTop?: boolean;
}): string {
    const widget = new BrowserWindow({
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
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    const widgetUrl = isDev
        ? `http://localhost:5173/#/widget/${options.type}`
        : `file://${path.join(__dirname, '../dist/index.html#/widget/')}${options.type}`;

    widget.loadURL(widgetUrl);

    const id = Date.now().toString();
    floatingWindows.set(id, widget);

    widget.on('closed', () => {
        floatingWindows.delete(id);
    });

    return id;
}

function createEdgeDock(): void {
    const { screen } = require('electron');
    const display = screen.getPrimaryDisplay();
    const { height } = display.workAreaSize;

    edgeDock = new BrowserWindow({
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
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    const dockUrl = isDev
        ? 'http://localhost:5173/#/edge-dock'
        : `file://${path.join(__dirname, '../dist/index.html#/edge-dock')}`;

    edgeDock.loadURL(dockUrl);

    edgeDock.setIgnoreMouseEvents(false);
}

function toggleBossMode(): void {
    bossMode = !bossMode;

    if (bossMode) {
        if (mainWindow) mainWindow.hide();
        floatingWindows.forEach(widget => widget.hide());
        if (edgeDock) edgeDock.hide();
    } else {
        if (mainWindow) mainWindow.show();
        floatingWindows.forEach(widget => widget.show());
        if (edgeDock) edgeDock.show();
    }
}

app.whenReady().then(() => {
    // Initialize database
    initDatabase();

    // Initialize backup manager
    const dbPath = path.join(app.getPath('userData'), 'floatnote.db');
    backupManager = new BackupManager(dbPath);
    backupManager.start(60); // Auto backup every 60 minutes

    // Setup IPC handlers
    setupCardHandlers();
    setupWorkspaceHandlers();
    setupSettingsHandlers();

    // Shell handlers
    ipcMain.handle('shell:openExternal', async (_event, url: string) => {
        await shell.openExternal(url);
    });

    createMainWindow();

    // Setup auto-updater
    if (mainWindow && !isDev) {
        setupAutoUpdater(mainWindow);
    }

    // Global shortcuts
    globalShortcut.register('Alt+Space', () => {
        if (mainWindow) {
            mainWindow.webContents.send('global-search-toggle');
        }
    });

    globalShortcut.register('CommandOrControl+Shift+P', () => {
        if (mainWindow) {
            mainWindow.webContents.send('command-palette-toggle');
        }
    });

    globalShortcut.register('CommandOrControl+Alt+B', () => {
        toggleBossMode();
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (backupManager) {
        backupManager.stop();
    }
    closeDatabase();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
    if (backupManager) {
        backupManager.stop();
    }
    closeDatabase();
});

// Window IPC handlers
ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    }
});

ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
});

ipcMain.handle('create-floating-widget', (_event, options) => {
    return createFloatingWidget(options);
});

ipcMain.handle('close-floating-widget', (_event, id: string) => {
    const widget = floatingWindows.get(id);
    if (widget) {
        widget.close();
        return true;
    }
    return false;
});

ipcMain.on('toggle-edge-dock', () => {
    if (edgeDock) {
        edgeDock.close();
        edgeDock = null;
    } else {
        createEdgeDock();
    }
});

ipcMain.on('toggle-boss-mode', () => {
    toggleBossMode();
});

// Backup IPC handlers
ipcMain.handle('backup:create', () => {
    return backupManager?.createBackup() || false;
});

ipcMain.handle('backup:list', () => {
    return backupManager?.listBackups() || [];
});

ipcMain.handle('backup:restore', (_event, backupPath: string) => {
    return backupManager?.restoreBackup(backupPath) || false;
});

ipcMain.handle('backup:delete', (_event, backupPath: string) => {
    return backupManager?.deleteBackup(backupPath) || false;
});

ipcMain.handle('backup:export', async () => {
    if (!mainWindow) return false;

    const result = await dialog.showSaveDialog(mainWindow, {
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
