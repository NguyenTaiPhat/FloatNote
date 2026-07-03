import { useState, useEffect } from 'react';
import { formatDate } from '@lib/utils';
import { useCardStore } from '@/store';
import { SmartCardRenderer } from '@features/cards/renderers';
import type { Card } from '@lib/types';

interface TimelineGroup {
    date: string;
    cards: Card[];
}

export function Timeline() {
    const { cards } = useCardStore();
    const [groups, setGroups] = useState<TimelineGroup[]>([]);

    useEffect(() => {
        const grouped = cards.reduce((acc, card) => {
            const date = formatDate(card.createdAt);
            const existing = acc.find(g => g.date === date);

            if (existing) {
                existing.cards.push(card);
            } else {
                acc.push({ date, cards: [card] });
            }

            return acc;
        }, [] as TimelineGroup[]);

        setGroups(grouped);
    }, [cards]);

    return (
        <div className="max-w-4xl mx-auto">
            {groups.map((group, groupIndex) => (
                <div key={groupIndex} className="relative">
                    {/* Timeline Line */}
                    {groupIndex < groups.length - 1 && (
                        <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-border" />
                    )}

                    {/* Date Header */}
                    <div className="flex items-center gap-3 mb-4 sticky top-0 bg-background py-3 z-10">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-text-primary">{group.date}</h3>
                            <p className="text-xs text-text-tertiary">{group.cards.length} cards</p>
                        </div>
                    </div>

                    {/* Cards */}
                    <div className="ml-11 space-y-3 mb-8">
                        {group.cards.map(card => (
                            <div key={card.id} className="animate-slide-up">
                                <SmartCardRenderer card={card} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {groups.length === 0 && (
                <div className="text-center py-12 text-text-tertiary">
                    No cards yet
                </div>
            )}
        </div>
    );
}
