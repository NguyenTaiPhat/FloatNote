import { Star, Archive, Trash2, Globe } from 'lucide-react';
import type { MovieCard } from '@lib/types';
import { Card } from '@shared/Card';
import { IconButton } from '@shared/IconButton';
import { useCardStore } from '@/store';
import { useTranslation } from '@lib/i18n';
import { useState } from 'react';

interface Props {
    card: MovieCard;
    onClick?: () => void;
}

export function MovieCardRenderer({ card, onClick }: Props) {
    const { t } = useTranslation();
    const { toggleFavorite, toggleArchive, deleteCard } = useCardStore();
    const [posterError, setPosterError] = useState(false);

    return (
        <Card
            interactive
            variant="elevated"
            archived={card.archived}
            className="overflow-hidden group"
            onClick={onClick}
        >
            <div className="relative aspect-[2/3] bg-black">
                {!posterError ? (
                    <>
                        <img
                            src={card.metadata.poster}
                            alt={card.title}
                            className="w-full h-full object-cover"
                            onError={() => setPosterError(true)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <Globe size={48} className="text-white opacity-90" />
                    </div>
                )}

                <div className="absolute top-2 right-2 flex gap-1">
                    <IconButton
                        variant="ghost"
                        size="sm"
                        className="bg-black/50 backdrop-blur-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(card.id);
                        }}
                    >
                        <Star
                            size={14}
                            className={card.favorite ? 'fill-yellow-500 text-yellow-500' : 'text-white'}
                        />
                    </IconButton>
                    <IconButton
                        variant="ghost"
                        size="sm"
                        className="bg-black/50 backdrop-blur-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleArchive(card.id);
                        }}
                    >
                        <Archive
                            size={14}
                            className={card.archived ? 'fill-black text-black dark:fill-white dark:text-white' : 'text-white'}
                        />
                    </IconButton>
                    <IconButton
                        variant="ghost"
                        size="sm"
                        className="bg-black/50 backdrop-blur-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteCard(card.id);
                        }}
                    >
                        <Trash2 size={14} className="text-white" />
                    </IconButton>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    {(card.metadata.rating > 0 || card.metadata.releaseDate || card.metadata.runtime > 0) && (
                        <div className="flex items-center gap-2 text-xs mb-1">
                            {card.metadata.rating > 0 && (
                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-yellow-500 text-black rounded font-bold">
                                    <Star size={10} fill="currentColor" />
                                    <span>{card.metadata.rating}</span>
                                </div>
                            )}
                            {card.metadata.releaseDate && (
                                <span className="opacity-80">{new Date(card.metadata.releaseDate).getFullYear()}</span>
                            )}
                            {card.metadata.releaseDate && card.metadata.runtime > 0 && (
                                <span className="opacity-80">•</span>
                            )}
                            {card.metadata.runtime > 0 && (
                                <span className="opacity-80">{card.metadata.runtime}m</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-3">
                <h3 className="font-semibold text-text-primary line-clamp-1 mb-2">
                    {card.title}
                </h3>

                {card.metadata.genres && card.metadata.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {card.metadata.genres.slice(0, 3).map(genre => (
                            <span
                                key={genre}
                                className="px-2 py-0.5 text-xs rounded-md bg-surface text-text-secondary"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                )}

                {card.metadata.watchStatus && (
                    <div className="px-2 py-1 text-xs rounded-md bg-accent-green/10 text-accent-green w-fit">
                        {card.metadata.watchStatus === 'completed' ? `✓ ${t.metadata.completed}` :
                            card.metadata.watchStatus === 'watching' ? `▶ ${t.metadata.watchLater}` :
                                `+ ${t.metadata.watchLater}`}
                    </div>
                )}
            </div>
        </Card>
    );
}
