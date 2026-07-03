import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@shared/Button';
import { Input } from '@shared/Input';
import { openExternal } from '@lib/external-link';
import { useTranslation } from '@lib/i18n';

export function ApiKeysSettings() {
    const { t } = useTranslation();
    const [tmdbApiKey, setTmdbApiKey] = useState('');
    const [githubToken, setGithubToken] = useState('');
    const [youtubeApiKey, setYoutubeApiKey] = useState('');
    const [showTmdb, setShowTmdb] = useState(false);
    const [showGithub, setShowGithub] = useState(false);
    const [showYoutube, setShowYoutube] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        if (!window.api?.settings) {
            console.warn('Settings API not available yet');
            return;
        }

        try {
            const settings = await window.api.settings.getAll();
            setTmdbApiKey(settings.tmdbApiKey || '');
            setGithubToken(settings.githubToken || '');
            setYoutubeApiKey(settings.youtubeApiKey || '');
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const handleSave = async () => {
        if (!window.api?.settings) {
            console.error('Settings API not available');
            return;
        }

        setLoading(true);
        setSaved(false);

        try {
            const success = await window.api.settings.setMultiple({
                tmdbApiKey: tmdbApiKey || undefined,
                githubToken: githubToken || undefined,
                youtubeApiKey: youtubeApiKey || undefined,
            });

            setLoading(false);

            if (success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
            setLoading(false);
        }
    };

    const maskValue = (value: string) => {
        if (!value) return '';
        if (value.length <= 8) return '*'.repeat(value.length);
        return value.slice(0, 4) + '*'.repeat(value.length - 8) + value.slice(-4);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">{t.settings.apiKeys}</h2>
                <p className="text-text-secondary">
                    Configure API keys for enhanced card features
                </p>
            </div>

            {/* Info Banner */}
            <div className="glass p-4 rounded-xl border-l-4 border-primary">
                <div className="flex items-start gap-3">
                    <AlertCircle className="text-primary mt-0.5 flex-shrink-0" size={20} />
                    <div className="text-sm text-text-secondary">
                        <p className="font-semibold text-text-primary mb-1">
                            Why API Keys?
                        </p>
                        <p>
                            API keys enable rich metadata extraction for Movie and GitHub cards.
                            They are stored locally and never shared.
                        </p>
                        <p className="mt-2 text-xs">
                            YouTube API key enables video metadata like views, duration, and channel information.
                        </p>
                    </div>
                </div>
            </div>

            {/* TMDB API Key */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                    <Key size={18} className="text-text-tertiary" />
                    <h3 className="text-lg font-semibold text-text-primary">
                        TMDB API Key
                    </h3>
                </div>

                <div className="glass p-4 rounded-xl space-y-4">
                    <div>
                        <p className="text-sm text-text-secondary mb-3">
                            Required for Movie cards with posters, ratings, and metadata.
                        </p>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-primary">
                                API Key
                            </label>
                            <div className="relative">
                                <input
                                    type={showTmdb ? 'text' : 'password'}
                                    value={tmdbApiKey}
                                    onChange={(e) => setTmdbApiKey(e.target.value)}
                                    placeholder="Enter your TMDB API key"
                                    className="w-full px-4 py-2 pr-12 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowTmdb(!showTmdb)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                                >
                                    {showTmdb ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {tmdbApiKey && !showTmdb && (
                                <p className="text-xs text-text-tertiary">
                                    Stored: {maskValue(tmdbApiKey)}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-border">
                        <p className="text-xs text-text-tertiary mb-2">
                            Don't have a TMDB API key?
                        </p>
                        <button
                            onClick={() => openExternal('https://www.themoviedb.org/settings/api')}
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                            Get free API key from TMDB
                        </button>
                    </div>
                </div>
            </div>

            {/* GitHub Token */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                    <Key size={18} className="text-text-tertiary" />
                    <h3 className="text-lg font-semibold text-text-primary">
                        GitHub Personal Access Token
                    </h3>
                </div>

                <div className="glass p-4 rounded-xl space-y-4">
                    <div>
                        <p className="text-sm text-text-secondary mb-3">
                            Optional. Increases GitHub API rate limits for repository cards.
                        </p>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-primary">
                                Personal Access Token
                            </label>
                            <div className="relative">
                                <input
                                    type={showGithub ? 'text' : 'password'}
                                    value={githubToken}
                                    onChange={(e) => setGithubToken(e.target.value)}
                                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                    className="w-full px-4 py-2 pr-12 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowGithub(!showGithub)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                                >
                                    {showGithub ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {githubToken && !showGithub && (
                                <p className="text-xs text-text-tertiary">
                                    Stored: {maskValue(githubToken)}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-border">
                        <p className="text-xs text-text-tertiary mb-2">
                            Need a GitHub token?
                        </p>
                        <button
                            onClick={() => openExternal('https://github.com/settings/tokens/new')}
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                            Generate token on GitHub
                        </button>
                        <p className="text-xs text-text-tertiary mt-2">
                            Required scopes: <code className="px-1.5 py-0.5 bg-surface rounded">public_repo</code>
                        </p>
                    </div>
                </div>
            </div>

            {/* YouTube API Key */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                    <Key size={18} className="text-text-tertiary" />
                    <h3 className="text-lg font-semibold text-text-primary">
                        YouTube Data API Key
                    </h3>
                </div>

                <div className="bg-background-secondary rounded-xl p-4">
                    <div>
                        <p className="text-sm text-text-secondary mb-3">
                            Optional. Enables video metadata extraction like views, duration, and channel.
                        </p>

                        <div className="space-y-3">
                            <div className="relative">
                                <input
                                    type={showYoutube ? 'text' : 'password'}
                                    value={youtubeApiKey}
                                    onChange={(e) => setYoutubeApiKey(e.target.value)}
                                    placeholder="AIzaSy..."
                                    className="w-full px-4 py-2 pr-12 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowYoutube(!showYoutube)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                                >
                                    {showYoutube ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {youtubeApiKey && !showYoutube && (
                                <p className="text-xs text-text-tertiary">
                                    Stored: {maskValue(youtubeApiKey)}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-border">
                        <p className="text-xs text-text-tertiary mb-2">
                            Need a YouTube API key?
                        </p>
                        <button
                            onClick={() => openExternal('https://console.cloud.google.com/apis/credentials')}
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                            Get API key from Google Cloud Console
                        </button>
                        <p className="text-xs text-text-tertiary mt-2">
                            Enable: <code className="px-1.5 py-0.5 bg-surface rounded">YouTube Data API v3</code>
                        </p>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-3 pt-4">
                <Button onClick={handleSave} disabled={loading}>
                    <Save size={16} className="mr-2" />
                    {loading ? t.common.loading : t.common.save}
                </Button>

                {saved && (
                    <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">{t.toast.settingsSaved}</span>
                    </div>
                )}
            </div>

            {/* Security Note */}
            <div className="glass p-4 rounded-xl">
                <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                    <Key size={16} className="text-primary" />
                    Security
                </h4>
                <ul className="text-sm text-text-secondary space-y-1">
                    <li>• API keys are stored locally on your computer</li>
                    <li>• Keys are never transmitted to external servers</li>
                    <li>• Only used for metadata fetching from official APIs</li>
                    <li>• You can delete keys anytime from this page</li>
                </ul>
            </div>
        </div>
    );
}
