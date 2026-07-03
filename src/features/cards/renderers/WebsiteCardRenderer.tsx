import { Globe, ExternalLink, Star, Clock, Archive, Trash2 } from 'lucide-react';
import type { WebsiteCard } from '@lib/types';
import { Card } from '@shared/Card';
import { IconButton } from '@shared/IconButton';
import { extractDomain, formatRelativeTime } from '@lib/utils';
import { openExternal } from '@lib/external-link';
import { useCardStore } from '@/store';
import { useState } from 'react';

interface Props {
    card: WebsiteCard;
    onClick?: () => void;
}

export function WebsiteCardRenderer({ card, onClick }: Props) {
    const { toggleFavorite, toggleArchive, deleteCard } = useCardStore();
    const domain = extractDomain(card.url);
    const [imageError, setImageError] = useState(false);
    const [faviconError, setFaviconError] = useState(false);

    return (
        <Card
            interactive
            variant="elevated"
            archived={card.archived}
            className="overflow-hidden group"
            onClick={onClick}
        >
            {card.metadata.ogImage && !imageError ? (
                <div className="relative aspect-video bg-surface">
                    <img
                        src={card.metadata.ogImage}
                        alt={card.title}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
            ) : card.metadata.ogImage ? (
                <div className="relative aspect-video bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Globe size={48} className="text-white opacity-90" />
                </div>
            ) : null}

            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center flex-shrink-0">
                        {card.metadata.favicon && !faviconError ? (
                            <img
                                src={card.metadata.favicon}
                                alt={domain}
                                className="w-6 h-6"
                                onError={() => setFaviconError(true)}
                            />
                        ) : (
                            <Globe size={20} className="text-purple-500" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
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

                        <p className="text-sm text-text-secondary mt-1">
                            {domain}
                        </p>

                        {card.description && (
                            <p className="text-sm text-text-secondary line-clamp-2 mt-2">
                                {card.description}
                            </p>
                        )}

                        {(card.metadata.readingTime || card.metadata.lastVisited) && (
                            <div className="flex items-center gap-3 mt-3 text-xs text-text-tertiary">
                                {card.metadata.readingTime && (
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        <span>{card.metadata.readingTime} min read</span>
                                    </div>
                                )}
                                {card.metadata.lastVisited && (
                                    <span>{formatRelativeTime(card.metadata.lastVisited)}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
