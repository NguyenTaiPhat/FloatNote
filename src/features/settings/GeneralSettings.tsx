import { useState, useEffect } from 'react';
import { CheckCircle, Globe, Bell, Zap, Download, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@shared/Button';
import { Select } from '@shared/Select';
import { toast } from '@shared/Toast';
import { cn } from '@lib/utils';
import { useTranslation, type Locale } from '@lib/i18n';

export function GeneralSettings() {
    const { locale, setLocale, t } = useTranslation();

    const [settings, setSettings] = useState({
        language: locale,
        autoSave: true,
        notifications: true,
        confirmBeforeDelete: true,
        defaultView: 'grid' as 'grid' | 'list' | 'timeline',
        cardsPerPage: 20,
        enableAnimations: true,
        enableSounds: false,
    });

    useEffect(() => {
        // Load settings from localStorage
        const saved = localStorage.getItem('generalSettings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    // Sync settings.language with locale from context
    useEffect(() => {
        if (settings.language !== locale) {
            setSettings(prev => ({ ...prev, language: locale }));
        }
    }, [locale, settings.language]);

    const handleSettingChange = (key: string, value: any) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem('generalSettings', JSON.stringify(newSettings));

        // Update locale when language changes
        if (key === 'language') {
            setLocale(value);
        }

        toast.success(t.settings.settingUpdated);
    };

    const handleReset = () => {
        const defaultSettings = {
            language: 'en' as const,
            autoSave: true,
            notifications: true,
            confirmBeforeDelete: true,
            defaultView: 'grid' as const,
            cardsPerPage: 20,
            enableAnimations: true,
            enableSounds: false,
        };
        setSettings(defaultSettings);
        localStorage.setItem('generalSettings', JSON.stringify(defaultSettings));
        setLocale('en');
        toast.success(t.settings.settingsReset);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">{t.settings.generalSettings}</h2>
                <p className="text-text-secondary">{t.settings.managePreferences}</p>
            </div>

            {/* Language */}
            <div className="glass p-4 rounded-xl">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Globe size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-text-primary mb-1">{t.settings.language}</h3>
                        <p className="text-sm text-text-secondary mb-3">{t.settings.selectLanguage}</p>
                        <Select
                            value={settings.language}
                            onChange={(value) => handleSettingChange('language', value)}
                            options={[
                                { value: 'en', label: 'English' },
                                { value: 'vi', label: 'Tiếng Việt' },
                                { value: 'zh', label: '中文' },
                                { value: 'ja', label: '日本語' },
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* Default View */}
            <div className="glass p-4 rounded-xl">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Zap size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-text-primary mb-1">{t.settings.defaultView}</h3>
                        <p className="text-sm text-text-secondary mb-3">{t.settings.chooseDefaultView}</p>
                        <div className="flex gap-2">
                            {['grid', 'list', 'timeline'].map((view) => (
                                <button
                                    key={view}
                                    onClick={() => handleSettingChange('defaultView', view)}
                                    className={cn(
                                        'px-4 py-2 rounded-xl border-2 transition-all capitalize',
                                        settings.defaultView === view
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border text-text-secondary hover:border-primary/50'
                                    )}
                                >
                                    {t.settings[view as 'grid' | 'list' | 'timeline']}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards Per Page */}
            <div className="glass p-4 rounded-xl">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Download size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-text-primary mb-1">{t.settings.cardsPerPage}</h3>
                        <p className="text-sm text-text-secondary mb-3">{t.settings.cardsPerPageDesc}</p>
                        <input
                            type="number"
                            min="10"
                            max="100"
                            step="10"
                            value={settings.cardsPerPage}
                            onChange={(e) => handleSettingChange('cardsPerPage', parseInt(e.target.value))}
                            className="w-32 px-4 py-2 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
                <h3 className="font-semibold text-text-primary">{t.settings.preferences}</h3>

                <ToggleSetting
                    icon={<CheckCircle size={20} />}
                    title={t.settings.autoSave}
                    description={t.settings.autoSaveDesc}
                    checked={settings.autoSave}
                    onChange={(checked) => handleSettingChange('autoSave', checked)}
                />

                <ToggleSetting
                    icon={<Bell size={20} />}
                    title={t.settings.notifications}
                    description={t.settings.notificationsDesc}
                    checked={settings.notifications}
                    onChange={(checked) => handleSettingChange('notifications', checked)}
                />

                <ToggleSetting
                    icon={<Trash2 size={20} />}
                    title={t.settings.confirmBeforeDelete}
                    description={t.settings.confirmBeforeDeleteDesc}
                    checked={settings.confirmBeforeDelete}
                    onChange={(checked) => handleSettingChange('confirmBeforeDelete', checked)}
                />

                <ToggleSetting
                    icon={<Zap size={20} />}
                    title={t.settings.enableAnimations}
                    description={t.settings.enableAnimationsDesc}
                    checked={settings.enableAnimations}
                    onChange={(checked) => handleSettingChange('enableAnimations', checked)}
                />

                <ToggleSetting
                    icon={<Bell size={20} />}
                    title={t.settings.enableSounds}
                    description={t.settings.enableSoundsDesc}
                    checked={settings.enableSounds}
                    onChange={(checked) => handleSettingChange('enableSounds', checked)}
                />
            </div>

            {/* Reset */}
            <div className="pt-6 border-t border-border">
                <Button variant="secondary" onClick={handleReset}>
                    <RefreshCw size={16} className="mr-2" />
                    {t.settings.resetToDefaults}
                </Button>
            </div>
        </div>
    );
}

interface ToggleSettingProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

function ToggleSetting({ icon, title, description, checked, onChange }: ToggleSettingProps) {
    return (
        <div className="glass p-4 rounded-xl">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                        {icon}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-text-primary mb-1">{title}</h4>
                        <p className="text-sm text-text-secondary">{description}</p>
                    </div>
                </div>
                <button
                    onClick={() => onChange(!checked)}
                    className={cn(
                        'relative w-12 h-6 rounded-full transition-colors flex-shrink-0',
                        checked ? 'bg-primary' : 'bg-surface-hover'
                    )}
                >
                    <div
                        className={cn(
                            'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform',
                            checked ? 'translate-x-6' : 'translate-x-0.5'
                        )}
                    />
                </button>
            </div>
        </div>
    );
}
