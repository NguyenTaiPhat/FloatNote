import { useEffect } from 'react';
import { Star, Grid, List, Clock } from 'lucide-react';
import { useCardStore, useUIStore, useWorkspaceStore } from '@/store';
import { SmartCardRenderer } from '@features/cards/renderers';
import { Timeline } from '@features/timeline/Timeline';
import { IconButton } from '@shared/IconButton';
import { Tooltip } from '@shared/Tooltip';
import { cn } from '@lib/utils';

export default function FavoritesPage() {
    const { cards, loadCards } = useCardStore();
    const { viewMode, setViewMode } = useUIStore();
    const { activeWorkspaceId } = useWorkspaceStore();

    useEffect(() => {
        loadCards({ workspaceId: activeWorkspaceId || undefined, favorite: true, archived: false });
    }, [activeWorkspaceId]);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-border">
                <div>
                    <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <Star size={20} className="fill-yellow-500 text-yellow-500" />
                        Favorites
                    </h1>
                    <p className="text-sm text-text-tertiary">{cards.length} cards</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <Tooltip content="Grid View" position="bottom">
                            <IconButton
                                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip content="List View" position="bottom">
                            <IconButton
                                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                            >
                                <List size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip content="Timeline View" position="bottom">
                            <IconButton
                                variant={viewMode === 'timeline' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('timeline')}
                            >
                                <Clock size={16} />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {cards.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-surface mx-auto mb-4 flex items-center justify-center">
                                <Star size={32} className="text-text-tertiary" />
                            </div>
                            <h2 className="text-xl font-semibold text-text-primary mb-2">No favorite cards yet</h2>
                            <p className="text-text-secondary">
                                Star cards to add them to your favorites
                            </p>
                        </div>
                    </div>
                ) : viewMode === 'timeline' ? (
                    <Timeline />
                ) : (
                    <div
                        className={cn(
                            viewMode === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
                            viewMode === 'list' && 'space-y-3 max-w-4xl mx-auto'
                        )}
                    >
                        {cards.map(card => (
                            <SmartCardRenderer key={card.id} card={card} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
