import { Star, GitFork, Code, ExternalLink, Archive, Trash2, Globe } from 'lucide-react';
import type { GitHubCard } from '@lib/types';
import { Card } from '@shared/Card';
import { IconButton } from '@shared/IconButton';
import { formatRelativeTime } from '@lib/utils';
import { openExternal } from '@lib/external-link';
import { useCardStore } from '@/store';
import { useState } from 'react';

interface Props {
    card: GitHubCard;
    onClick?: () => void;
}

export function GitHubCardRenderer({ card, onClick }: Props) {
    const { toggleFavorite, toggleArchive, deleteCard } = useCardStore();
    const [avatarError, setAvatarError] = useState(false);

    return (
        <Card
            interactive
            variant="elevated"
            archived={card.archived}
            className="p-4 group overflow-hidden"
            onClick={onClick}
        >
            <div className="flex flex-col h-full">
                {/* Header with avatar and actions */}
                <div className="flex items-start gap-3 mb-3">
                    {card.metadata.avatar && !avatarError ? (
                        <img
                            src={card.metadata.avatar}
                            alt={card.metadata.owner}
                            className="w-10 h-10 rounded-lg flex-shrink-0"
                            onError={() => setAvatarError(true)}
                        />
                    ) : card.metadata.avatar ? (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <Globe size={20} className="text-white" />
                        </div>
                    ) : null}

                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text-primary text-sm leading-tight">
                            {card.metadata.owner}/<wbr />{card.metadata.repo}
                        </h3>
                    </div>

                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
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

                {/* Description */}
                <div className="flex-1 mb-3">
                    {card.metadata.description ? (
                        <p className="text-sm text-text-secondary line-clamp-2">
                            {card.metadata.description}
                        </p>
                    ) : (
                        <p className="text-sm text-text-tertiary italic">
                            No description available
                        </p>
                    )}
                </div>

                {/* Stats */}
                {(card.metadata.language || card.metadata.stars > 0 || card.metadata.forks > 0) && (
                    <div className="flex items-center gap-3 mb-3 text-xs text-text-secondary">
                        {card.metadata.language && (
                            <div className="flex items-center gap-1.5">
                                <Code size={12} />
                                <span>{card.metadata.language}</span>
                            </div>
                        )}
                        {card.metadata.stars > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Star size={12} />
                                <span>{card.metadata.stars.toLocaleString()}</span>
                            </div>
                        )}
                        {card.metadata.forks > 0 && (
                            <div className="flex items-center gap-1.5">
                                <GitFork size={12} />
                                <span>{card.metadata.forks.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Topics */}
                {card.metadata.topics && card.metadata.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {card.metadata.topics.slice(0, 3).map(topic => (
                            <span
                                key={topic}
                                className="px-2 py-0.5 text-xs rounded-md bg-primary/10 text-primary"
                            >
                                {topic}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="text-xs text-text-tertiary">
                    {formatRelativeTime(card.createdAt)}
                </div>
            </div>
        </Card>
    );
}
