/**
 * Open URL in system default browser
 */
export async function openExternal(url: string): Promise<void> {
    if (typeof window === 'undefined') return;

    const electron = (window as any).electron;

    if (electron?.openExternal) {
        // Electron environment - use shell.openExternal
        await electron.openExternal(url);
    } else {
        // Web environment fallback
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}
