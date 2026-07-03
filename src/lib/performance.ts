import { useEffect, useRef } from 'react';

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Hook for intersection observer (lazy loading)
 */
export function useIntersectionObserver(
    callback: () => void,
    options?: IntersectionObserverInit
) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                callback();
            }
        }, options);

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [callback, options]);

    return ref;
}

/**
 * Hook for measuring render performance
 */
export function usePerformanceMonitor(componentName: string) {
    useEffect(() => {
        const start = performance.now();

        return () => {
            const end = performance.now();
            const renderTime = end - start;

            if (renderTime > 16) {
                // More than one frame (60fps)
                console.warn(
                    `[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render`
                );
            }
        };
    });
}

/**
 * Virtualize large lists
 */
export function useVirtualization<T>(
    items: T[],
    itemHeight: number,
    containerHeight: number
) {
    const [scrollTop, setScrollTop] = useState(0);

    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
    );

    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;
    const totalHeight = items.length * itemHeight;

    return {
        visibleItems,
        offsetY,
        totalHeight,
        onScroll: (e: React.UIEvent<HTMLDivElement>) => {
            setScrollTop(e.currentTarget.scrollTop);
        },
    };
}

/**
 * Memoize expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map();

    return ((...args: Parameters<T>) => {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn(...args);
        cache.set(key, result);

        return result;
    }) as T;
}

/**
 * Batch updates for better performance
 */
export class BatchUpdater<T> {
    private queue: T[] = [];
    private timeout: NodeJS.Timeout | null = null;
    private callback: (items: T[]) => void;
    private delay: number;

    constructor(callback: (items: T[]) => void, delay: number = 100) {
        this.callback = callback;
        this.delay = delay;
    }

    add(item: T) {
        this.queue.push(item);

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.flush();
        }, this.delay);
    }

    flush() {
        if (this.queue.length > 0) {
            this.callback([...this.queue]);
            this.queue = [];
        }

        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
}

import { useState } from 'react';
