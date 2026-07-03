import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Locale, Translation } from './types';
import { locales } from './locales';

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: Translation;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
    children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
    const [locale, setLocaleState] = useState<Locale>(() => {
        const saved = localStorage.getItem('locale');
        return (saved as Locale) || 'en';
    });

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('locale', newLocale);
    };

    const t = locales[locale];

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useTranslation must be used within I18nProvider');
    }
    return context;
}

// Helper for formatting dates based on locale
export function formatDate(date: Date | string, locale: Locale): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const localeMap: Record<Locale, string> = {
        en: 'en-US',
        vi: 'vi-VN',
        zh: 'zh-CN',
        ja: 'ja-JP',
    };
    return d.toLocaleDateString(localeMap[locale], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

// Helper for formatting date time based on locale
export function formatDateTime(date: Date | string, locale: Locale): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const localeMap: Record<Locale, string> = {
        en: 'en-US',
        vi: 'vi-VN',
        zh: 'zh-CN',
        ja: 'ja-JP',
    };
    return d.toLocaleString(localeMap[locale], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Helper for formatting numbers based on locale
export function formatNumber(num: number, locale: Locale): string {
    const localeMap: Record<Locale, string> = {
        en: 'en-US',
        vi: 'vi-VN',
        zh: 'zh-CN',
        ja: 'ja-JP',
    };
    return num.toLocaleString(localeMap[locale]);
}
