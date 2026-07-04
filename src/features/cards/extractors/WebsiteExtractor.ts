import type { WebsiteCard } from '@lib/types';

interface WebsiteMetadata {
    favicon?: string;
    ogImage?: string;
    dominantColor?: string;
    readingTime?: number;
    language?: string;
}

export class WebsiteExtractor {
    static async extract(url: string): Promise<Partial<WebsiteCard>> {
        try {
            const metadata = await this.fetchMetadata(url);

            return {
                type: 'website',
                title: this.extractTitle(url),
                description: 'Website description',
                url,
                metadata: {
                    favicon: metadata.favicon || this.getFaviconUrl(url),
                    ogImage: metadata.ogImage,
                    dominantColor: metadata.dominantColor || '#3b82f6',
                    readingTime: metadata.readingTime,
                    language: metadata.language || 'en',
                    lastVisited: new Date().toISOString(),
                },
                category: 'web',
            };
        } catch (error) {
            console.error('Website extraction failed:', error);
            return {
                type: 'website',
                title: this.extractDomain(url),
                url,
                metadata: {
                    favicon: this.getFaviconUrl(url),
                    lastVisited: new Date().toISOString(),
                },
            };
        }
    }

    private static async fetchMetadata(url: string): Promise<WebsiteMetadata> {
        // Mock data - implement actual scraping
        return {
            favicon: this.getFaviconUrl(url),
            ogImage: 'https://via.placeholder.com/1200x630',
            dominantColor: '#3b82f6',
            readingTime: 5,
            language: 'en',
        };
    }

    private static extractDomain(url: string): string {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch {
            return url;
        }
    }

    private static extractTitle(url: string): string {
        const domain = this.extractDomain(url);
        return domain.charAt(0).toUpperCase() + domain.slice(1);
    }

    private static getFaviconUrl(url: string): string {
        try {
            const urlObj = new URL(url);
            return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`;
        } catch {
            return '';
        }
    }
}
