import { Music, Star, ExternalLink, Archive, Trash2 } from 'lucide-react';
import type { Card } from '@lib/types';
import { Card as CardComponent } from '@shared/Card';
import { IconButton } from '@shared/IconButton';
import { formatRelativeTime } from '@lib/utils';
import { openExternal } from '@lib/external-link';
import { useCardStore } from '@/store';

interface Props {
    card: Card;
    onClick?: () => void;
}

export function SpotifyCardRenderer({ card, onClick }: Props) {
    const { toggleFavorite, toggleArchive, deleteCard } = useCardStore();
    const metadata = card.metadata as any;

    return (
        <CardComponent
            interactive
            variant="elevated"
            archived={card.archived}
            className="overflow-hidden group"
            onClick={onClick}
        >
            <div className="relative aspect-square bg-black">
                {metadata?.cover ? (
                    <img
                        src={metadata.cover}
                        alt={card.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1DB954]">
                        <Music size={64} className="text-white opacity-50" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text-primary line-clamp-2">
                            {card.title}
                        </h3>
                        {metadata?.artist && (
                            <p className="text-sm text-text-secondary mt-1">
                                {metadata.artist}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-1">
                        <IconButton
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(card.id);
                            }}
                        >
                            <Star
                                size={14}
                                className={card.favorite ? 'fill-yellow-500 text-yellow-500' : ''}
                            />
                        </IconButton>
                        <IconButton
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                openExternal(card.url);
                            }}
                        >
                            <ExternalLink size={14} />
                        </IconButton>
                        <IconButton
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleArchive(card.id);
                            }}
                        >
                            <Archive
                                size={14}
                                className={card.archived ? 'fill-black text-black dark:fill-white dark:text-white' : ''}
                            />
                        </IconButton>
                        <IconButton
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteCard(card.id);
                            }}
                        >
                            <Trash2 size={14} />
                        </IconButton>
                    </div>
                </div>

                {(metadata?.releaseYear || metadata?.trackCount) && (
                    <div className="flex items-center gap-3 mt-3 text-xs text-text-tertiary">
                        {metadata?.releaseYear && <span>{metadata.releaseYear}</span>}
                        {metadata?.trackCount && (
                            <>
                                {metadata?.releaseYear && <span>•</span>}
                                <span>{metadata.trackCount} tracks</span>
                            </>
                        )}
                    </div>
                )}

                <div className="text-xs text-text-tertiary mt-2">
                    {formatRelativeTime(card.createdAt)}
                </div>
            </div>
        </CardComponent>
    );
}
