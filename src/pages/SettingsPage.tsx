import { useState } from 'react';
import { Settings as SettingsIcon, HardDrive, Palette, Bell, Key, Download } from 'lucide-react';
import { BackupSettings } from '@features/settings/BackupSettings';
import { AppearanceSettings } from '@features/settings/AppearanceSettings';
import { ApiKeysSettings } from '@features/settings/ApiKeysSettings';
import { GeneralSettings } from '@features/settings/GeneralSettings';
import { UpdateSettings } from '@features/settings/UpdateSettings';
import { cn } from '@lib/utils';
import { useTranslation } from '@lib/i18n';

type SettingsTab = 'general' | 'api-keys' | 'backup' | 'appearance' | 'updates' | 'notifications';

export default function SettingsPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');

    const tabs = [
        { id: 'general' as const, label: t.settings.general, icon: SettingsIcon },
        { id: 'api-keys' as const, label: t.settings.apiKeys, icon: Key },
        { id: 'appearance' as const, label: t.settings.appearance, icon: Palette },
        { id: 'updates' as const, label: t.settings.updates, icon: Download },
        { id: 'backup' as const, label: t.settings.backup, icon: HardDrive },
        { id: 'notifications' as const, label: t.settings.notifications, icon: Bell },
    ];

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 border-r border-border p-4">
                <h1 className="text-xl font-bold text-text-primary mb-6 px-3">{t.nav.settings}</h1>
                <div className="space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left',
                                activeTab === tab.id
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-text-secondary hover:bg-surface'
                            )}
                        >
                            <tab.icon size={18} />
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {activeTab === 'general' && <GeneralSettings />}

                {activeTab === 'api-keys' && <ApiKeysSettings />}

                {activeTab === 'appearance' && <AppearanceSettings />}

                {activeTab === 'updates' && <UpdateSettings />}

                {activeTab === 'backup' && <BackupSettings />}

                {activeTab === 'notifications' && (
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">{t.settings.notifications}</h2>
                        <p className="text-text-secondary">Notification settings coming soon...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
