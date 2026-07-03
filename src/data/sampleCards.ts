import type { Card } from '@lib/types';
import { generateId } from '@lib/utils';

export const sampleCards: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
        type: 'note',
        title: 'Project Ideas',
        content: 'Build a desktop app with Electron\nCreate a smart card system\nImplement AI features',
        tags: ['ideas', 'projects'],
        category: 'note',
        favorite: true,
    },
    {
        type: 'github',
        title: 'electron/electron',
        description: 'Build cross-platform desktop apps with JavaScript, HTML, and CSS',
        url: 'https://github.com/electron/electron',
        metadata: {
            owner: 'electron',
            repo: 'electron',
            description: 'Build cross-platform desktop apps with JavaScript, HTML, and CSS',
            language: 'TypeScript',
            stars: 112500,
            forks: 15200,
            license: 'MIT',
            topics: ['electron', 'javascript', 'desktop', 'nodejs'],
            avatar: 'https://avatars.githubusercontent.com/u/13409222?s=200&v=4',
        },
        tags: ['electron', 'desktop', 'javascript'],
        category: 'development',
    },
    {
        type: 'youtube',
        title: 'Build Desktop Apps with Electron',
        description: 'Complete tutorial on building desktop applications',
        url: 'https://www.youtube.com/watch?v=example',
        metadata: {
            videoId: 'example',
            thumbnail: 'https://via.placeholder.com/1280x720',
            duration: '25:42',
            channel: 'Code Tutorial',
            views: 250000,
            uploadDate: new Date().toISOString(),
        },
        tags: ['tutorial', 'electron', 'video'],
        category: 'learning',
    },
    {
        type: 'movie',
        title: 'Inception',
        description: 'A thief who steals corporate secrets through dream-sharing technology',
        metadata: {
            tmdbId: 27205,
            poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            rating: 8.8,
            genres: ['Action', 'Sci-Fi', 'Thriller'],
            runtime: 148,
            releaseDate: '2010-07-16',
        },
        tags: ['sci-fi', 'thriller'],
        category: 'entertainment',
        favorite: true,
    },
    {
        type: 'website',
        title: 'TailwindCSS Documentation',
        description: 'Official Tailwind CSS documentation and guides',
        url: 'https://tailwindcss.com',
        metadata: {
            favicon: 'https://tailwindcss.com/favicon.ico',
            ogImage: 'https://tailwindcss.com/og.jpg',
            dominantColor: '#38bdf8',
            readingTime: 10,
        },
        tags: ['css', 'documentation', 'design'],
        category: 'development',
    },
];

export function generateSampleCards(workspaceId: string): Card[] {
    const now = new Date().toISOString();

    return sampleCards.map(card => ({
        ...card,
        id: generateId(),
        workspaceId,
        createdAt: now,
        updatedAt: now,
    }));
}
