import { Play, Clock, Eye, Star, ExternalLink, Archive, Trash2, Globe } from 'lucide-react';
import type { YouTubeCard } from '@lib/types';
import { Card } from '@shared/Card';
import { IconButton } from '@shared/IconButton';
import { formatRelativeTime } from '@lib/utils';
import { openExternal } from '@lib/external-link';
import { useCardStore } from '@/store';
import { useState } from 'react';

interface Props {
    card: YouTubeCard;
    onClick?: () => void;
}

export function YouTubeCardRenderer({ card, onClick }: Props) {
    const { toggleFavorite, toggleArchive, deleteCard } = useCardStore();
    const [thumbnailError, setThumbnailError] = useState(false);

    const handleThumbnailClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        openExternal(card.url);
    };

    return (
        <Card
            interactive
            variant="elevated"
            archived={card.archived}
            className="overflow-hidden group"
            onClick={onClick}
        >
            <div
                className="relative aspect-video bg-black cursor-pointer"
                onClick={handleThumbnailClick}
            >
                {!thumbnailError ? (
                    <>
                        <img
                            src={card.metadata.thumbnail}
                            alt={card.title}
                            className="w-full h-full object-cover"
                            onError={() => setThumbnailError(true)}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                                <Play size={24} className="text-white ml-1" fill="white" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <Globe size={48} className="text-white opacity-90" />
                    </div>
                )}
                {card.metadata.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs rounded">
                        {card.metadata.duration}
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-text-primary line-clamp-2 flex-1">
                        {card.title}
                    </h3>
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

                {card.metadata.channel && (
                    <p className="text-sm text-text-secondary mt-1">
                        {card.metadata.channel}
                    </p>
                )}

                {(card.metadata.views > 0 || card.metadata.uploadDate) && (
                    <div className="flex items-center gap-3 mt-3 text-xs text-text-tertiary">
                        {card.metadata.views > 0 && (
                            <div className="flex items-center gap-1">
                                <Eye size={12} />
                                <span>{card.metadata.views.toLocaleString()} views</span>
                            </div>
                        )}
                        {card.metadata.uploadDate && (
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{formatRelativeTime(card.metadata.uploadDate)}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
