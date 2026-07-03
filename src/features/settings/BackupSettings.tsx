import { useState, useEffect } from 'react';
import { Download, Upload, Trash2, Clock, HardDrive } from 'lucide-react';
import { Button } from '@shared/Button';
import { IconButton } from '@shared/IconButton';
import { formatDistanceToNow } from 'date-fns';

interface Backup {
    name: string;
    path: string;
    date: Date;
    size: number;
}

export function BackupSettings() {
    const [backups, setBackups] = useState<Backup[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBackups();
    }, []);

    const loadBackups = async () => {
        const list = await window.api.backup.list();
        setBackups(list.map(b => ({ ...b, date: new Date(b.date) })));
    };

    const handleCreateBackup = async () => {
        setLoading(true);
        const success = await window.api.backup.create();
        if (success) {
            await loadBackups();
        }
        setLoading(false);
    };

    const handleRestoreBackup = async (backupPath: string) => {
        if (!confirm('Are you sure you want to restore this backup? This will replace your current data.')) {
            return;
        }

        setLoading(true);
        const success = await window.api.backup.restore(backupPath);
        if (success) {
            alert('Backup restored successfully. Please restart the app.');
        } else {
            alert('Failed to restore backup.');
        }
        setLoading(false);
    };

    const handleDeleteBackup = async (backupPath: string) => {
        if (!confirm('Are you sure you want to delete this backup?')) {
            return;
        }

        setLoading(true);
        const success = await window.api.backup.delete(backupPath);
        if (success) {
            await loadBackups();
        }
        setLoading(false);
    };

    const handleExportBackup = async () => {
        setLoading(true);
        const success = await window.api.backup.export();
        if (success) {
            alert('Database exported successfully!');
        } else {
            alert('Failed to export database.');
        }
        setLoading(false);
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">Backup & Restore</h2>
                <p className="text-text-secondary">
                    Manage your data backups and restore points
                </p>
            </div>

            {/* Auto Backup Info */}
            <div className="glass p-4 rounded-xl">
                <div className="flex items-start gap-3">
                    <Clock className="text-primary mt-1" size={20} />
                    <div className="flex-1">
                        <h3 className="font-semibold text-text-primary mb-1">Automatic Backups</h3>
                        <p className="text-sm text-text-secondary">
                            FloatNote automatically creates backups every hour. The last 10 backups are kept.
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Button onClick={handleCreateBackup} disabled={loading}>
                    <HardDrive size={16} className="mr-2" />
                    Create Backup Now
                </Button>
                <Button variant="secondary" onClick={handleExportBackup} disabled={loading}>
                    <Download size={16} className="mr-2" />
                    Export Database
                </Button>
            </div>

            {/* Backup List */}
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Available Backups</h3>

                {backups.length === 0 ? (
                    <div className="text-center py-12 text-text-tertiary">
                        <HardDrive size={48} className="mx-auto mb-3 opacity-50" />
                        <p>No backups available</p>
                        <p className="text-sm mt-1">Create your first backup to get started</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {backups.map((backup) => (
                            <div
                                key={backup.path}
                                className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border hover:border-primary/50 transition-colors"
                            >
                                <div className="flex-1">
                                    <h4 className="font-medium text-text-primary mb-1">
                                        {backup.name}
                                    </h4>
                                    <div className="flex items-center gap-4 text-xs text-text-tertiary">
                                        <span>
                                            {formatDistanceToNow(backup.date, { addSuffix: true })}
                                        </span>
                                        <span>{formatBytes(backup.size)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <IconButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRestoreBackup(backup.path)}
                                        disabled={loading}
                                    >
                                        <Upload size={16} />
                                    </IconButton>
                                    <IconButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteBackup(backup.path)}
                                        disabled={loading}
                                    >
                                        <Trash2 size={16} />
                                    </IconButton>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
