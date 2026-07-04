import type { Card as CardType } from '@lib/types';
import { NoteCardRenderer } from './NoteCardRenderer';
import { GitHubCardRenderer } from './GitHubCardRenderer';
import { YouTubeCardRenderer } from './YouTubeCardRenderer';
import { MovieCardRenderer } from './MovieCardRenderer';
import { WebsiteCardRenderer } from './WebsiteCardRenderer';

interface Props {
    card: CardType;
    onClick?: () => void;
}

export function SmartCardRenderer({ card, onClick }: Props) {
    switch (card.type) {
        case 'note':
            return <NoteCardRenderer card={card as any} onClick={onClick} />;
        case 'github':
            return <GitHubCardRenderer card={card as any} onClick={onClick} />;
        case 'youtube':
            return <YouTubeCardRenderer card={card as any} onClick={onClick} />;
        case 'movie':
            return <MovieCardRenderer card={card as any} onClick={onClick} />;
        case 'website':
            return <WebsiteCardRenderer card={card as any} onClick={onClick} />;
        default:
            return <NoteCardRenderer card={card as any} onClick={onClick} />;
    }
}

export { NoteCardRenderer, GitHubCardRenderer, YouTubeCardRenderer, MovieCardRenderer, WebsiteCardRenderer };
