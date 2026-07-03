import type { CardType } from '@lib/constants';

interface DetectionResult {
    type: CardType;
    url?: string;
    confidence: number;
}

export class CardDetector {
    static detect(input: string): DetectionResult {
        const trimmed = input.trim();

        // GitHub
        if (this.isGitHubUrl(trimmed)) {
            return { type: 'github', url: trimmed, confidence: 1.0 };
        }

        // YouTube
        if (this.isYouTubeUrl(trimmed)) {
            return { type: 'youtube', url: trimmed, confidence: 1.0 };
        }

        // Spotify
        if (this.isSpotifyUrl(trimmed)) {
            return { type: 'spotify', url: trimmed, confidence: 1.0 };
        }

        // Reddit
        if (this.isRedditUrl(trimmed)) {
            return { type: 'reddit', url: trimmed, confidence: 1.0 };
        }

        // Medium
        if (this.isMediumUrl(trimmed)) {
            return { type: 'medium', url: trimmed, confidence: 1.0 };
        }

        // Generic Website
        if (this.isUrl(trimmed)) {
            return { type: 'website', url: trimmed, confidence: 0.8 };
        }

        // Default to note
        return { type: 'note', confidence: 0.5 };
    }

    private static isUrl(str: string): boolean {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    }

    private static isGitHubUrl(url: string): boolean {
        return /github\.com\/[\w-]+\/[\w-]+/.test(url);
    }

    private static isYouTubeUrl(url: string): boolean {
        return /(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/.test(url);
    }

    private static isSpotifyUrl(url: string): boolean {
        return /spotify\.com\/(album|track|playlist)\/[\w]+/.test(url);
    }

    private static isRedditUrl(url: string): boolean {
        return /reddit\.com\/r\/[\w]+\/comments/.test(url);
    }

    private static isMediumUrl(url: string): boolean {
        return /medium\.com\/@?[\w-]+\/[\w-]+/.test(url);
    }
}
