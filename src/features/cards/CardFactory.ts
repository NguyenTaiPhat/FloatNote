import { CardDetector } from './CardDetector';
import {
    GitHubExtractor,
    YouTubeExtractor,
    WebsiteExtractor,
    MovieExtractor,
    SpotifyExtractor
} from './extractors';
import type { Card } from '@lib/types';
import { generateId } from '@lib/utils';

export class CardFactory {
    static async createFromInput(input: string, workspaceId?: string): Promise<Partial<Card>> {
        const detection = CardDetector.detect(input);
        const now = new Date().toISOString();

        let cardData: Partial<Card> = {
            id: generateId(),
            type: detection.type,
            createdAt: now,
            updatedAt: now,
            workspaceId,
        };

        try {
            switch (detection.type) {
                case 'github':
                    if (detection.url) {
                        const githubData = await GitHubExtractor.extract(detection.url);
                        cardData = { ...cardData, ...githubData };
                    }
                    break;

                case 'youtube':
                    if (detection.url) {
                        const youtubeData = await YouTubeExtractor.extract(detection.url);
                        cardData = { ...cardData, ...youtubeData };
                    }
                    break;

                case 'spotify':
                    if (detection.url) {
                        const spotifyData = await SpotifyExtractor.extract(detection.url);
                        cardData = { ...cardData, ...spotifyData };
                    }
                    break;

                case 'website':
                    if (detection.url) {
                        const websiteData = await WebsiteExtractor.extract(detection.url);
                        cardData = { ...cardData, ...websiteData };
                    }
                    break;

                case 'note':
                default:
                    cardData = {
                        ...cardData,
                        type: 'note',
                        title: input.slice(0, 50) || 'New Note',
                        content: input,
                        category: 'note',
                    };
                    break;
            }
        } catch (error) {
            console.error('Card extraction failed:', error);
            cardData = {
                ...cardData,
                title: input.slice(0, 50) || 'Unknown',
                description: 'Failed to extract metadata',
                url: detection.url,
            };
        }

        return cardData;
    }

    static async createMovieCard(title: string, workspaceId?: string): Promise<Partial<Card>> {
        const now = new Date().toISOString();
        const movieData = await MovieExtractor.extractByTitle(title);

        return {
            ...movieData,
            id: generateId(),
            createdAt: now,
            updatedAt: now,
            workspaceId,
        };
    }
}
