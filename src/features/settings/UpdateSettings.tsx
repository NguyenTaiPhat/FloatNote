import { useState, useEffect } from 'react';
import { Download, RefreshCw, CheckCircle, AlertCircle, Package, ExternalLink } from 'lucide-react';
import { Button } from '@shared/Button';
import { useTranslation } from '@lib/i18n';
import { cn } from '@lib/utils';
import { openExternal } from '@lib/external-link';

type UpdateStatus = 'idle' | 'checking' | 'available' | 'not-available' | 'error';

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
    const [error, setError] = useState<string>('');

    useEffect(() => {
        // Load current version
        loadCurrentVersion();

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

    const handleGoToReleases = () => {
        openExternal('https://github.com/NguyenTaiPhat/FloatNote/releases/latest');
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'checking':
                return <RefreshCw size={20} className="text-primary animate-spin" />;
            case 'available':
                return <Download size={20} className="text-green-500" />;
            case 'not-available':
                return <CheckCircle size={20} className="text-green-500" />;
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
                return 'New version available! Click below to download.';
            case 'not-available':
                return t.settings.updateNotAvailable;
            case 'error':
                return error || 'Update check failed';
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
                {(status === 'available') && updateInfo && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={20} className="text-green-500" />
                            <span className="text-sm font-medium text-green-500">
                                New version available!
                            </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-text-secondary">
                                {t.settings.currentVersion}: {currentVersion}
                            </span>
                            <span className="text-sm font-bold text-primary">
                                Latest: {updateInfo.version}
                            </span>
                        </div>
                        {updateInfo.releaseNotes && (
                            <div className="mt-3 pt-3 border-t border-border/50">
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

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        onClick={handleCheckForUpdates}
                        disabled={status === 'checking'}
                        variant="secondary"
                    >
                        <RefreshCw size={16} className={cn('mr-2', status === 'checking' && 'animate-spin')} />
                        {t.settings.checkForUpdates}
                    </Button>

                    {(status === 'available') && (
                        <Button onClick={handleGoToReleases} variant="primary">
                            <ExternalLink size={16} className="mr-2" />
                            Download from GitHub
                        </Button>
                    )}
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
                    <li>• Click "Download from GitHub" to get the latest version</li>
                    <li>• Download and install the new version manually</li>
                    <li>• Your data is safe during updates</li>
                </ul>
            </div>
        </div>
    );
}
