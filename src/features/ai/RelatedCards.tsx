import { useEffect, useState } from 'react';
import { Link2, Sparkles } from 'lucide-react';
import { SmartRelationships } from './SmartRelationships';
import { SmartCardRenderer } from '@features/cards/renderers';
import { useCardStore } from '@/store';
import type { Card } from '@lib/types';

interface Props {
    card: Card;
}

export function RelatedCards({ card }: Props) {
    const { cards } = useCardStore();
    const [relatedCards, setRelatedCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const findRelated = async () => {
            setLoading(true);
            const suggested = SmartRelationships.getSuggestedCards(
                card,
                cards.filter(c => c.id !== card.id),
                5
            );
            setRelatedCards(suggested);
            setLoading(false);
        };

        findRelated();
    }, [card.id, cards]);

    if (loading) {
        return (
            <div className="animate-pulse space-y-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-surface rounded-xl" />
                ))}
            </div>
        );
    }

    if (relatedCards.length === 0) {
        return (
            <div className="text-center py-8 text-text-tertiary">
                <Link2 size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No related cards found</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-primary" />
                <h3 className="font-semibold text-text-primary">Related Cards</h3>
            </div>

            {relatedCards.map(relatedCard => (
                <div key={relatedCard.id} className="transform scale-95 origin-left">
                    <SmartCardRenderer card={relatedCard} />
                </div>
            ))}
        </div>
    );
}
