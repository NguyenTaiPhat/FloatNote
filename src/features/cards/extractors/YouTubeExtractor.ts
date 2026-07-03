import type { YouTubeCard } from '@lib/types';
import { getYoutubeApiKey } from '@lib/constants';

interface YouTubeVideoData {
    videoId: string;
    title: string;
    thumbnail: string;
    duration: string;
    channel: string;
    views: number;
    uploadDate: string;
}

interface YouTubeApiResponse {
    items: Array<{
        snippet: {
            title: string;
            channelTitle: string;
            publishedAt: string;
            thumbnails: {
                maxres?: { url: string };
                high?: { url: string };
                medium?: { url: string };
            };
        };
        statistics: {
            viewCount: string;
        };
        contentDetails: {
            duration: string;
        };
    }>;
}

export class YouTubeExtractor {
    static async extract(url: string): Promise<Partial<YouTubeCard>> {
        const videoId = this.extractVideoId(url);
        if (!videoId) throw new Error('Invalid YouTube URL');

        try {
            const data = await this.fetchVideoData(videoId);

            return {
                type: 'youtube',
                title: data.title,
                description: '',
                url,
                metadata: {
                    videoId: data.videoId,
                    thumbnail: data.thumbnail,
                    duration: data.duration,
                    channel: data.channel,
                    views: data.views,
                    uploadDate: data.uploadDate,
                    watchLater: false,
                },
                category: 'video',
                color: '#FF0000',
            };
        } catch (error) {
            console.error('YouTube extraction failed:', error);
            return {
                type: 'youtube',
                title: 'YouTube Video',
                url,
                metadata: {
                    videoId,
                    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                    duration: '',
                    channel: '',
                    views: 0,
                    uploadDate: new Date().toISOString(),
                },
            };
        }
    }

    private static extractVideoId(url: string): string | null {
        const patterns = [
            /youtube\.com\/watch\?v=([\w-]+)/,
            /youtu\.be\/([\w-]+)/,
            /youtube\.com\/embed\/([\w-]+)/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }

        return null;
    }

    private static async fetchVideoData(videoId: string): Promise<YouTubeVideoData> {
        const apiKey = await getYoutubeApiKey();

        if (!apiKey) {
            throw new Error('YouTube API key not configured');
        }

        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.status}`);
        }

        const data: YouTubeApiResponse = await response.json();

        if (!data.items || data.items.length === 0) {
            throw new Error('Video not found');
        }

        const video = data.items[0];
        const thumbnail =
            video.snippet.thumbnails.maxres?.url ||
            video.snippet.thumbnails.high?.url ||
            video.snippet.thumbnails.medium?.url ||
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        return {
            videoId,
            title: video.snippet.title,
            thumbnail,
            duration: this.parseDuration(video.contentDetails.duration),
            channel: video.snippet.channelTitle,
            views: parseInt(video.statistics.viewCount, 10),
            uploadDate: video.snippet.publishedAt,
        };
    }

    private static parseDuration(isoDuration: string): string {
        // Parse ISO 8601 duration (e.g., PT15M42S -> 15:42)
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return '0:00';

        const hours = parseInt(match[1] || '0', 10);
        const minutes = parseInt(match[2] || '0', 10);
        const seconds = parseInt(match[3] || '0', 10);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

