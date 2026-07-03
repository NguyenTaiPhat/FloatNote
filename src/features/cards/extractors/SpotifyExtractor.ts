import type { Card } from '@lib/types';

export class SpotifyExtractor {
    static async extract(url: string): Promise<Partial<Card>> {
        const match = url.match(/spotify\.com\/(album|track|playlist)\/([\w]+)/);
        if (!match) throw new Error('Invalid Spotify URL');

        const [, type, id] = match;

        try {
            const data = await this.fetchSpotifyData(type, id);

            return {
                type: 'spotify',
                title: data.name,
                description: data.artist,
                url,
                metadata: {
                    spotifyId: id,
                    spotifyType: type,
                    cover: data.cover,
                    artist: data.artist,
                    releaseYear: data.releaseYear,
                    trackCount: data.trackCount,
                },
                category: 'music',
                color: '#1DB954',
            };
        } catch (error) {
            console.error('Spotify extraction failed:', error);
            return {
                type: 'spotify',
                title: 'Spotify Content',
                url,
                metadata: { spotifyId: id, spotifyType: type },
            };
        }
    }

    private static async fetchSpotifyData(type: string, id: string): Promise<any> {
        // Mock data - replace with Spotify API
        return {
            name: 'Random Access Memories',
            artist: 'Daft Punk',
            cover: 'https://via.placeholder.com/640x640',
            releaseYear: 2013,
            trackCount: 13,
        };
    }
}
