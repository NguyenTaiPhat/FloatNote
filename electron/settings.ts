import { app } from 'electron';
import fs from 'fs';
import path from 'path';

interface AppSettings {
    tmdbApiKey?: string;
    githubToken?: string;
    backupInterval?: number;
    theme?: 'dark' | 'light' | 'system';
}

export class SettingsManager {
    private settingsPath: string;
    private settings: AppSettings;

    constructor() {
        const userDataPath = app.getPath('userData');
        this.settingsPath = path.join(userDataPath, 'settings.json');
        this.settings = this.loadSettings();
    }

    private loadSettings(): AppSettings {
        try {
            if (fs.existsSync(this.settingsPath)) {
                const data = fs.readFileSync(this.settingsPath, 'utf-8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
        return {};
    }

    private saveSettings(): boolean {
        try {
            const data = JSON.stringify(this.settings, null, 2);
            fs.writeFileSync(this.settingsPath, data, 'utf-8');
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    }

    get(key: keyof AppSettings): any {
        return this.settings[key];
    }

    set(key: keyof AppSettings, value: any): boolean {
        (this.settings as any)[key] = value;
        return this.saveSettings();
    }

    getAll(): AppSettings {
        return { ...this.settings };
    }

    setMultiple(updates: Partial<AppSettings>): boolean {
        this.settings = { ...this.settings, ...updates };
        return this.saveSettings();
    }

    delete(key: keyof AppSettings): boolean {
        delete this.settings[key];
        return this.saveSettings();
    }

    reset(): boolean {
        this.settings = {};
        return this.saveSettings();
    }

    // Specific getters with defaults
    getTmdbApiKey(): string | undefined {
        return this.settings.tmdbApiKey;
    }

    getGithubToken(): string | undefined {
        return this.settings.githubToken;
    }

    getBackupInterval(): number {
        return this.settings.backupInterval || 60; // Default 60 minutes
    }

    getTheme(): 'dark' | 'light' | 'system' {
        return this.settings.theme || 'dark';
    }
}
