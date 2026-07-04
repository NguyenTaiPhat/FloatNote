import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { applyTheme, watchSystemTheme, type Theme } from '@lib/theme';
import { cn } from '@lib/utils';
import { useTranslation } from '@lib/i18n';

export function AppearanceSettings() {
    const { t } = useTranslation();
    const [theme, setTheme] = useState<Theme>('dark');
    const [primaryColor, setPrimaryColor] = useState<string>('#6366f1');

    useEffect(() => {
        const savedTheme = (localStorage.getItem('theme') as Theme) || 'dark';
        const savedColor = localStorage.getItem('primaryColor') || '#6366f1';

        setTheme(savedTheme);
        setPrimaryColor(savedColor);
        applyTheme(savedTheme);
        applyPrimaryColor(savedColor);

        // Watch system theme changes
        const unwatch = watchSystemTheme((_systemTheme) => {
            if (theme === 'system') {
                applyTheme('system');
            }
        });

        return unwatch;
    }, []);

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    const handleColorChange = (color: string) => {
        setPrimaryColor(color);
        localStorage.setItem('primaryColor', color);
        applyPrimaryColor(color);
    };

    const applyPrimaryColor = (color: string) => {
        // Convert hex to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        document.documentElement.style.setProperty('--primary', `${r} ${g} ${b}`);
    };

    const themes: Array<{ value: Theme; label: string; icon: React.ReactNode; description: string }> = [
        {
            value: 'light',
            label: t.settings.themeLight,
            icon: <Sun size={20} />,
            description: t.settings.themeLightDesc,
        },
        {
            value: 'dark',
            label: t.settings.themeDark,
            icon: <Moon size={20} />,
            description: t.settings.themeDarkDesc,
        },
        {
            value: 'system',
            label: t.settings.themeSystem,
            icon: <Monitor size={20} />,
            description: t.settings.themeSystemDesc,
        },
    ];

    const colors = [
        { name: 'Indigo', value: '#6366f1' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Purple', value: '#a855f7' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Orange', value: '#f97316' },
        { name: 'Yellow', value: '#eab308' },
        { name: 'Green', value: '#22c55e' },
        { name: 'Teal', value: '#14b8a6' },
        { name: 'Cyan', value: '#06b6d4' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">{t.settings.appearance}</h2>
                <p className="text-text-secondary">Customize how FloatNote looks</p>
            </div>

            {/* Theme Selection */}
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">{t.settings.theme}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {themes.map((themeOption) => (
                        <button
                            key={themeOption.value}
                            onClick={() => handleThemeChange(themeOption.value)}
                            className={cn(
                                'p-4 rounded-xl border-2 transition-all text-left',
                                theme === themeOption.value
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                            )}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div
                                    className={cn(
                                        'w-10 h-10 rounded-lg flex items-center justify-center',
                                        theme === themeOption.value
                                            ? 'bg-primary text-white'
                                            : 'bg-surface text-text-secondary'
                                    )}
                                >
                                    {themeOption.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-text-primary">
                                        {themeOption.label}
                                    </h4>
                                    <p className="text-xs text-text-tertiary">
                                        {themeOption.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Accent Color Selection */}
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">{t.settings.accentColor}</h3>
                <div className="grid grid-cols-5 gap-3">
                    {colors.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => handleColorChange(color.value)}
                            className={cn(
                                'group relative p-3 rounded-xl border-2 transition-all hover:scale-105',
                                primaryColor === color.value
                                    ? 'border-text-primary'
                                    : 'border-transparent hover:border-border'
                            )}
                            title={color.name}
                        >
                            <div
                                className="w-full h-12 rounded-lg"
                                style={{ backgroundColor: color.value }}
                            />
                            <p className="text-xs text-text-tertiary text-center mt-2 group-hover:text-text-secondary transition-colors">
                                {color.name}
                            </p>
                            {primaryColor === color.value && (
                                <div className="absolute top-1 right-1 w-5 h-5 bg-text-primary rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-3 h-3 text-background"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview */}
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">{t.settings.preview}</h3>
                <div className="glass-strong rounded-xl p-6 border border-border">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary" />
                            <div className="flex-1">
                                <div className="h-3 bg-text-primary rounded w-1/3 mb-2" />
                                <div className="h-2 bg-text-secondary rounded w-1/2" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-surface" />
                            <div className="flex-1">
                                <div className="h-3 bg-text-primary rounded w-1/2 mb-2" />
                                <div className="h-2 bg-text-tertiary rounded w-2/3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Color Scheme Info */}
            <div className="glass p-4 rounded-xl">
                <h4 className="font-semibold text-text-primary mb-3">{t.settings.colorPalette}</h4>
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { name: 'Primary', color: primaryColor },
                        { name: 'Surface', color: 'bg-surface' },
                        { name: 'Border', color: 'bg-border' },
                        { name: 'Background', color: 'bg-background' },
                    ].map((color) => (
                        <div key={color.name} className="text-center">
                            <div
                                className={cn('w-full h-12 rounded-lg mb-2', color.name !== 'Primary' && color.color)}
                                style={color.name === 'Primary' ? { backgroundColor: color.color } : undefined}
                            />
                            <p className="text-xs text-text-tertiary">{color.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
