/**
 * Helper functions for safely accessing Electron APIs
 */

/**
 * Check if window.api is available
 */
export function isApiReady(): boolean {
    return typeof window !== 'undefined' && !!window.api;
}

/**
 * Wait for API to be ready
 */
export function waitForApi(timeout = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
        if (isApiReady()) {
            resolve();
            return;
        }

        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            if (isApiReady()) {
                clearInterval(checkInterval);
                resolve();
            } else if (Date.now() - startTime > timeout) {
                clearInterval(checkInterval);
                reject(new Error('API not ready within timeout'));
            }
        }, 100);
    });
}

/**
 * Safely call API method with fallback
 */
export async function safeApiCall<T>(
    apiCall: () => Promise<T>,
    fallback: T
): Promise<T> {
    if (!isApiReady()) {
        console.warn('API not ready, returning fallback value');
        return fallback;
    }

    try {
        return await apiCall();
    } catch (error) {
        console.error('API call failed:', error);
        return fallback;
    }
}
