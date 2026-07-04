import { useState, useEffect } from 'react';
import { Download, RefreshCw, CheckCircle, AlertCircle, Package } from 'lucide-react';
import { Button } from '@shared/Button';
import { useTranslation } from '@lib/i18n';
import { cn } from '@lib/utils';

type UpdateStatus = 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error';

interface UpdateInfo {
    version: string;
    releaseNotes?: string;
    releaseDate?: string;
}

export function UpdateSettings() {
    const { t } = useTranslation();
    const [status, setStatus] = useState<UpdateStatus>('idle');
    const [currentVersion, setCurrentVersion] = useState<string>('1.0.0');
    const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
    const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
    const [downloadProgress, setDownloadProgress] = useState<number>(0);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        // Load current version
        loadCurrentVersion();

        // Load auto-update preference
        const savedAutoUpdate = localStorage.getItem('autoUpdate');
        if (savedAutoUpdate !== null) {
            setAutoUpdate(JSON.parse(savedAutoUpdate));
        }

        // Setup updater event listeners
        setupUpdaterListeners();

        return () => {
            // Cleanup listeners if needed
        };
    }, []);

    const loadCurrentVersion = async () => {
        if (window.electron?.getAppVersion) {
            const version = await window.electron.getAppVersion();
            setCurrentVersion(version);
        }
    };

    const setupUpdaterListeners = () => {
        if (!window.electron?.onUpdateAvailable) return;

        // Update available
        window.electron.onUpdateAvailable((info: UpdateInfo) => {
            setStatus('available');
            setUpdateInfo(info);
        });

        // Update not available
        window.electron.onUpdateNotAvailable?.(() => {
            setStatus('not-available');
            setUpdateInfo(null);
        });

        // Download progress
        window.electron.onDownloadProgress?.((progress: number) => {
            setStatus('downloading');
            setDownloadProgress(progress);
        });

        // Update downloaded
        window.electron.onUpdateDownloaded?.((info: UpdateInfo) => {
            setStatus('downloaded');
            setUpdateInfo(info);
        });

        // Update error
        window.electron.onUpdateError?.((errorMsg: string) => {
            setStatus('error');
            setError(errorMsg);
        });
    };

    const handleCheckForUpdates = () => {
        if (window.electron?.checkForUpdates) {
            setStatus('checking');
            setError('');
            window.electron.checkForUpdates();
        } else {
            setError('Update checker not available');
        }
    };

    const handleInstallUpdate = () => {
        if (window.electron?.installUpdate) {
            window.electron.installUpdate();
        }
    };

    const handleAutoUpdateToggle = (enabled: boolean) => {
        setAutoUpdate(enabled);
        localStorage.setItem('autoUpdate', JSON.stringify(enabled));

        if (window.electron?.setAutoUpdate) {
            window.electron.setAutoUpdate(enabled);
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'checking':
                return <RefreshCw size={20} className="text-primary animate-spin" />;
            case 'available':
            case 'downloaded':
                return <Download size={20} className="text-green-500" />;
            case 'not-available':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'downloading':
                return <Download size={20} className="text-primary animate-pulse" />;
            case 'error':
                return <AlertCircle size={20} className="text-red-500" />;
            default:
                return <Package size={20} className="text-text-tertiary" />;
        }
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'checking':
                return t.settings.checkingForUpdates;
            case 'available':
                return t.settings.updateAvailable;
            case 'not-available':
                return t.settings.updateNotAvailable;
            case 'downloading':
                return `${t.settings.downloadingUpdate} ${Math.round(downloadProgress)}%`;
            case 'downloaded':
                return t.settings.updateDownloaded;
            case 'error':
                return error || 'Update error occurred';
            default:
                return '';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">{t.settings.updates}</h2>
                <p className="text-text-secondary">Keep FloatNote up to date</p>
            </div>

            {/* Current Version */}
            <div className="glass p-4 rounded-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-text-primary mb-1">{t.settings.currentVersion}</h3>
                        <p className="text-2xl font-bold text-primary">{currentVersion}</p>
                    </div>
                    <Package size={48} className="text-text-tertiary opacity-50" />
                </div>
            </div>

            {/* Update Status */}
            <div className="glass p-4 rounded-xl">
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {getStatusIcon()}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-text-primary mb-1">Status</h3>
                        <p className="text-sm text-text-secondary">{getStatusMessage()}</p>
                    </div>
                </div>

                {/* Update Available Info */}
                {(status === 'available' || status === 'downloaded') && updateInfo && (
                    <div className="p-3 bg-surface rounded-lg mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-text-secondary">
                                {t.settings.latestVersion}
                            </span>
                            <span className="text-sm font-bold text-primary">{updateInfo.version}</span>
                        </div>
                        {updateInfo.releaseNotes && (
                            <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-xs font-medium text-text-secondary mb-2">
                                    {t.settings.releaseNotes}
                                </p>
                                <p className="text-xs text-text-tertiary whitespace-pre-wrap">
                                    {updateInfo.releaseNotes}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Download Progress */}
                {status === 'downloading' && (
                    <div className="mb-4">
                        <div className="h-2 bg-surface rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${downloadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        onClick={handleCheckForUpdates}
                        disabled={status === 'checking' || status === 'downloading'}
                        variant="primary"
                    >
                        <RefreshCw size={16} className={cn('mr-2', status === 'checking' && 'animate-spin')} />
                        {t.settings.checkForUpdates}
                    </Button>

                    {status === 'downloaded' && (
                        <Button onClick={handleInstallUpdate} variant="primary">
                            <Download size={16} className="mr-2" />
                            {t.settings.installUpdate}
                        </Button>
                    )}
                </div>
            </div>

            {/* Auto Update Setting */}
            <div className="glass p-4 rounded-xl">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                            <Download size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-text-primary mb-1">{t.settings.autoUpdate}</h4>
                            <p className="text-sm text-text-secondary">{t.settings.autoUpdateDesc}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleAutoUpdateToggle(!autoUpdate)}
                        className={cn(
                            'relative w-12 h-6 rounded-full transition-colors flex-shrink-0',
                            autoUpdate ? 'bg-primary' : 'bg-surface-hover'
                        )}
                    >
                        <div
                            className={cn(
                                'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform',
                                autoUpdate ? 'translate-x-6' : 'translate-x-0.5'
                            )}
                        />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="glass p-4 rounded-xl">
                <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                    <AlertCircle size={16} className="text-primary" />
                    About Updates
                </h4>
                <ul className="text-sm text-text-secondary space-y-1">
                    <li>• Updates are checked automatically when app starts</li>
                    <li>• Downloads happen in the background</li>
                    <li>• App restart required to install updates</li>
                    <li>• Your data is safe during updates</li>
                </ul>
            </div>
        </div>
    );
}
