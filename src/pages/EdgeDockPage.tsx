import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCardStore } from '@/store';
import { SmartCardRenderer } from '@features/cards/renderers';
import { Plus, X } from 'lucide-react';
import { IconButton } from '@shared/IconButton';

export default function EdgeDockPage() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [pinnedCards, setPinnedCards] = useState<any[]>([]);
    const { cards, loadCards } = useCardStore();

    useEffect(() => {
        loadCards({ favorite: true });
    }, []);

    useEffect(() => {
        setPinnedCards(cards.slice(0, 5));
    }, [cards]);

    return (
        <motion.div
            initial={{ width: 4 }}
            animate={{ width: isExpanded ? 320 : 4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="h-screen bg-surface/80 backdrop-blur-xl border-r border-border shadow-2xl"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Dock Indicator */}
            {!isExpanded && (
                <div className="w-full h-full bg-gradient-to-b from-primary/50 to-primary/20" />
            )}

            {/* Expanded Content */}
            {isExpanded && (
                <div className="p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-text-primary text-sm">Quick Access</h3>
                        <IconButton
                            variant="ghost"
                            size="xs"
                            onClick={() => window.electron?.toggleEdgeDock()}
                        >
                            <X size={14} />
                        </IconButton>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2">
                        {pinnedCards.length > 0 ? (
                            pinnedCards.map(card => (
                                <div key={card.id} className="transform scale-90 origin-left">
                                    <SmartCardRenderer card={card} />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-text-tertiary text-xs">
                                <Plus size={24} className="mx-auto mb-2 opacity-50" />
                                <p>No pinned cards</p>
                                <p className="mt-1">Star cards to pin them here</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
