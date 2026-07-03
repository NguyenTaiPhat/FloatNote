import { autoUpdater } from 'electron-updater';
import { BrowserWindow, ipcMain } from 'electron';
import log from 'electron-log';

export function setupAutoUpdater(mainWindow: BrowserWindow) {
    // Configure logger
    autoUpdater.logger = log;
    log.info('App starting...');

    // Disable auto-download initially
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;

    // Check for updates on app start (after 3 seconds)
    setTimeout(() => {
        autoUpdater.checkForUpdates();
    }, 3000);

    // Event: Update available
    autoUpdater.on('update-available', (info) => {
        log.info('Update available:', info);
        mainWindow.webContents.send('update-available', {
            version: info.version,
            releaseNotes: info.releaseNotes,
            releaseDate: info.releaseDate,
        });
    });

    // Event: Update not available
    autoUpdater.on('update-not-available', (info) => {
        log.info('Update not available:', info);
        mainWindow.webContents.send('update-not-available');
    });

    // Event: Download progress
    autoUpdater.on('download-progress', (progressObj) => {
        const percent = progressObj.percent;
        log.info(`Download progress: ${percent.toFixed(2)}%`);
        mainWindow.webContents.send('download-progress', percent);
    });

    // Event: Update downloaded
    autoUpdater.on('update-downloaded', (info) => {
        log.info('Update downloaded:', info);
        mainWindow.webContents.send('update-downloaded', {
            version: info.version,
            releaseNotes: info.releaseNotes,
            releaseDate: info.releaseDate,
        });
    });

    // Event: Error
    autoUpdater.on('error', (error) => {
        log.error('Update error:', error);
        mainWindow.webContents.send('update-error', error.message);
    });

    // IPC: Check for updates
    ipcMain.handle('check-for-updates', async () => {
        try {
            return await autoUpdater.checkForUpdates();
        } catch (error: any) {
            log.error('Check for updates error:', error);
            return { error: error.message };
        }
    });

    // IPC: Download update
    ipcMain.handle('download-update', async () => {
        try {
            return await autoUpdater.downloadUpdate();
        } catch (error: any) {
            log.error('Download update error:', error);
            return { error: error.message };
        }
    });

    // IPC: Install update
    ipcMain.handle('install-update', () => {
        autoUpdater.quitAndInstall(false, true);
    });

    // IPC: Set auto-download
    ipcMain.handle('set-auto-download', (_event, enabled: boolean) => {
        autoUpdater.autoDownload = enabled;
        log.info('Auto-download set to:', enabled);
        return enabled;
    });

    // IPC: Get app version
    ipcMain.handle('get-app-version', () => {
        return autoUpdater.currentVersion.version;
    });
}
