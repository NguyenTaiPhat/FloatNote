import { ipcMain } from 'electron';
import { SettingsManager } from '../settings';

const settingsManager = new SettingsManager();

export function setupSettingsHandlers() {
    ipcMain.handle('settings:get', (_event, key: string) => {
        return settingsManager.get(key as any);
    });

    ipcMain.handle('settings:getAll', () => {
        return settingsManager.getAll();
    });

    ipcMain.handle('settings:set', (_event, key: string, value: any) => {
        return settingsManager.set(key as any, value);
    });

    ipcMain.handle('settings:setMultiple', (_event, updates: any) => {
        return settingsManager.setMultiple(updates);
    });

    ipcMain.handle('settings:delete', (_event, key: string) => {
        return settingsManager.delete(key as any);
    });

    ipcMain.handle('settings:reset', () => {
        return settingsManager.reset();
    });
}

export { settingsManager };
