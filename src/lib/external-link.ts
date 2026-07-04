/**
 * Open URL in system default browser
 */
export async function openExternal(url: string): Promise<void> {
    if (typeof window === 'undefined') return;
    if (!url) return;

    // Validate URL to prevent opening folders instead of web links
    const urlLower = url.toLowerCase().trim();
    if (!urlLower.startsWith('http://') && !urlLower.startsWith('https://')) {
        console.warn('Invalid URL protocol, skipping:', url);
        return;
    }

    const electron = (window as any).electron;

    if (electron?.openExternal) {
        // Electron environment - use shell.openExternal
        try {
            await electron.openExternal(url);
        } catch (error) {
            console.error('Failed to open external URL:', error);
        }
    } else {
        // Web environment fallback
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}
