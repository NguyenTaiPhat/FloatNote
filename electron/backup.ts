import { app } from 'electron';
import fs from 'fs';
import path from 'path';

export class BackupManager {
    private backupInterval: NodeJS.Timeout | null = null;
    private dbPath: string;
    private backupDir: string;

    constructor(dbPath: string) {
        this.dbPath = dbPath;
        this.backupDir = path.join(app.getPath('userData'), 'backups');

        // Create backup directory if it doesn't exist
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }

    /**
     * Start automatic backups
     * @param intervalMinutes - Backup interval in minutes (default: 60)
     */
    start(intervalMinutes: number = 60): void {
        if (this.backupInterval) {
            this.stop();
        }

        // Create initial backup
        this.createBackup();

        // Schedule periodic backups
        this.backupInterval = setInterval(() => {
            this.createBackup();
        }, intervalMinutes * 60 * 1000);

        console.log(`Auto backup started (interval: ${intervalMinutes} minutes)`);
    }

    /**
     * Stop automatic backups
     */
    stop(): void {
        if (this.backupInterval) {
            clearInterval(this.backupInterval);
            this.backupInterval = null;
            console.log('Auto backup stopped');
        }
    }

    /**
     * Create a backup of the database
     */
    createBackup(): boolean {
        try {
            if (!fs.existsSync(this.dbPath)) {
                console.warn('Database file not found, skipping backup');
                return false;
            }

            const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
            const backupFileName = `floatnote-backup-${timestamp}.db`;
            const backupPath = path.join(this.backupDir, backupFileName);

            // Copy database file
            fs.copyFileSync(this.dbPath, backupPath);

            console.log(`Backup created: ${backupFileName}`);

            // Clean old backups (keep last 10)
            this.cleanOldBackups(10);

            return true;
        } catch (error) {
            console.error('Failed to create backup:', error);
            return false;
        }
    }

    /**
     * Clean old backups, keeping only the most recent ones
     */
    private cleanOldBackups(keepCount: number): void {
        try {
            const files = fs.readdirSync(this.backupDir)
                .filter(file => file.startsWith('floatnote-backup-') && file.endsWith('.db'))
                .map(file => ({
                    name: file,
                    path: path.join(this.backupDir, file),
                    time: fs.statSync(path.join(this.backupDir, file)).mtime.getTime(),
                }))
                .sort((a, b) => b.time - a.time);

            // Remove old backups
            if (files.length > keepCount) {
                files.slice(keepCount).forEach(file => {
                    fs.unlinkSync(file.path);
                    console.log(`Removed old backup: ${file.name}`);
                });
            }
        } catch (error) {
            console.error('Failed to clean old backups:', error);
        }
    }

    /**
     * List all available backups
     */
    listBackups(): Array<{ name: string; path: string; date: Date; size: number }> {
        try {
            const files = fs.readdirSync(this.backupDir)
                .filter(file => file.startsWith('floatnote-backup-') && file.endsWith('.db'))
                .map(file => {
                    const filePath = path.join(this.backupDir, file);
                    const stats = fs.statSync(filePath);
                    return {
                        name: file,
                        path: filePath,
                        date: stats.mtime,
                        size: stats.size,
                    };
                })
                .sort((a, b) => b.date.getTime() - a.date.getTime());

            return files;
        } catch (error) {
            console.error('Failed to list backups:', error);
            return [];
        }
    }

    /**
     * Restore database from a backup
     */
    restoreBackup(backupPath: string): boolean {
        try {
            if (!fs.existsSync(backupPath)) {
                console.error('Backup file not found');
                return false;
            }

            // Create a backup of current database before restoring
            const currentBackupPath = this.dbPath + '.pre-restore';
            if (fs.existsSync(this.dbPath)) {
                fs.copyFileSync(this.dbPath, currentBackupPath);
            }

            // Restore from backup
            fs.copyFileSync(backupPath, this.dbPath);

            console.log('Database restored from backup');
            return true;
        } catch (error) {
            console.error('Failed to restore backup:', error);
            return false;
        }
    }

    /**
     * Delete a backup file
     */
    deleteBackup(backupPath: string): boolean {
        try {
            if (fs.existsSync(backupPath)) {
                fs.unlinkSync(backupPath);
                console.log('Backup deleted');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to delete backup:', error);
            return false;
        }
    }

    /**
     * Export database to a specific location
     */
    exportDatabase(destinationPath: string): boolean {
        try {
            if (!fs.existsSync(this.dbPath)) {
                console.error('Database file not found');
                return false;
            }

            fs.copyFileSync(this.dbPath, destinationPath);
            console.log(`Database exported to: ${destinationPath}`);
            return true;
        } catch (error) {
            console.error('Failed to export database:', error);
            return false;
        }
    }
}
