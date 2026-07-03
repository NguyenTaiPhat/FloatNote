import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Legacy functions - kept for backward compatibility
// For new code, use formatDate/formatDateTime from @lib/i18n
export function formatDate(date: Date | string): string {
    const locale = localStorage.getItem('locale') || 'en';
    const localeMap: Record<string, string> = {
        en: 'en-US',
        vi: 'vi-VN',
        zh: 'zh-CN',
        ja: 'ja-JP',
    };
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(localeMap[locale] || 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function formatDateTime(date: Date | string): string {
    const locale = localStorage.getItem('locale') || 'en';
    const localeMap: Record<string, string> = {
        en: 'en-US',
        vi: 'vi-VN',
        zh: 'zh-CN',
        ja: 'ja-JP',
    };
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString(localeMap[locale] || 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

export function formatRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formatDate(d);
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

export function extractDomain(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return url;
    }
}

export function isValidUrl(str: string): boolean {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
