import { useState } from 'react';
import { Settings as SettingsIcon, Palette, Keyboard, Database, Info } from 'lucide-react';
import { Button } from '@shared/Button';
import { useUIStore } from '@/store';

export function Settings() {
    const { theme, setTheme } = useUIStore();
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: SettingsIcon },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
        { id: 'data', label: 'Data', icon: Database },
        { id: 'about', label: 'About', icon: Info },
    ];

    return (
        <div className="flex h-full">
            <div className="w-64 border-r border-border p-4">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Settings</h2>
                <div className="space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${activeTab === tab.id
                                    ? 'bg-primary text-white'
                                    : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                                }`}
                        >
                            <tab.icon size={18} />
                            <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
                {activeTab === 'appearance' && (
                    <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-6">Appearance</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Theme
                                </label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={theme === 'dark' ? 'primary' : 'secondary'}
                                        onClick={() => setTheme('dark')}
                                    >
                                        Dark
                                    </Button>
                                    <Button
                                        variant={theme === 'light' ? 'primary' : 'secondary'}
                                        onClick={() => setTheme('light')}
                                    >
                                        Light
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-6">About FloatNote</h3>
                        <div className="space-y-4">
                            <p className="text-text-secondary">Version 1.0.0</p>
                            <p className="text-text-secondary">
                                FloatNote is your second brain for desktop.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
