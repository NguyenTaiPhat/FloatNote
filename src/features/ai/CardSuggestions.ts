import type { Card } from '@lib/types';

export class CardSuggestions {
    static generateTags(card: Card): string[] {
        const tags: string[] = [];
        const text = `${card.title} ${card.description || ''} ${card.content || ''}`.toLowerCase();

        // Technology tags
        const techKeywords = ['javascript', 'python', 'react', 'typescript', 'node', 'electron'];
        techKeywords.forEach(keyword => {
            if (text.includes(keyword)) {
                tags.push(keyword);
            }
        });

        // Topic tags
        if (text.includes('tutorial') || text.includes('guide')) tags.push('learning');
        if (text.includes('design') || text.includes('ui')) tags.push('design');
        if (text.includes('api') || text.includes('backend')) tags.push('backend');

        // Based on card type
        if (card.type === 'github') tags.push('code', 'open-source');
        if (card.type === 'youtube') tags.push('video', 'media');
        if (card.type === 'movie') tags.push('entertainment', 'media');

        return [...new Set(tags)].slice(0, 5);
    }

    static generateCategory(card: Card): string {
        const text = `${card.title} ${card.description || ''}`.toLowerCase();

        if (card.type === 'github' || card.type === 'note' && text.includes('code')) {
            return 'development';
        }
        if (card.type === 'movie' || card.type === 'youtube' && text.includes('entertainment')) {
            return 'entertainment';
        }
        if (text.includes('work') || text.includes('business')) {
            return 'business';
        }
        if (text.includes('learn') || text.includes('tutorial')) {
            return 'learning';
        }

        return 'general';
    }

    static findRelatedCards(card: Card, allCards: Card[]): Card[] {
        const related: Array<{ card: Card; score: number }> = [];

        allCards.forEach(otherCard => {
            if (otherCard.id === card.id) return;

            let score = 0;

            // Same type
            if (otherCard.type === card.type) score += 0.3;

            // Same category
            if (otherCard.category === card.category) score += 0.4;

            // Shared tags
            const tags1 = card.tags || [];
            const tags2 = otherCard.tags || [];
            const sharedTags = tags1.filter(tag => tags2.includes(tag));
            score += sharedTags.length * 0.2;

            // Similar title
            if (this.titleSimilarity(card.title, otherCard.title) > 0.3) {
                score += 0.3;
            }

            if (score > 0.3) {
                related.push({ card: otherCard, score });
            }
        });

        return related
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(r => r.card);
    }

    private static titleSimilarity(title1: string, title2: string): number {
        const words1 = title1.toLowerCase().split(/\s+/);
        const words2 = title2.toLowerCase().split(/\s+/);

        const shared = words1.filter(word => words2.includes(word));
        return shared.length / Math.max(words1.length, words2.length);
    }

    static generateSummary(card: Card): string {
        if (card.description) {
            return card.description.slice(0, 150) + (card.description.length > 150 ? '...' : '');
        }

        if (card.content) {
            const text = card.content.replace(/\n/g, ' ').trim();
            return text.slice(0, 150) + (text.length > 150 ? '...' : '');
        }

        return card.title;
    }
}
