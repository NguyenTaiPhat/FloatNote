import type { Card } from '@lib/types';

export interface Relationship {
    cardId: string;
    relatedCardId: string;
    score: number;
    reason: string;
}

export class SmartRelationships {
    /**
     * Analyze cards and find intelligent relationships
     */
    static analyzeRelationships(cards: Card[]): Relationship[] {
        const relationships: Relationship[] = [];

        for (let i = 0; i < cards.length; i++) {
            for (let j = i + 1; j < cards.length; j++) {
                const card1 = cards[i];
                const card2 = cards[j];

                const score = this.calculateSimilarity(card1, card2);

                if (score > 0.3) {
                    const reason = this.generateReason(card1, card2);
                    relationships.push({
                        cardId: card1.id,
                        relatedCardId: card2.id,
                        score,
                        reason,
                    });
                }
            }
        }

        return relationships.sort((a, b) => b.score - a.score);
    }

    /**
     * Calculate similarity score between two cards
     */
    private static calculateSimilarity(card1: Card, card2: Card): number {
        let score = 0;
        const weights = {
            sameType: 0.2,
            sameCategory: 0.3,
            sharedTags: 0.4,
            titleSimilarity: 0.15,
            contentSimilarity: 0.25,
            urlDomain: 0.2,
        };

        // Same type
        if (card1.type === card2.type) {
            score += weights.sameType;
        }

        // Same category
        if (card1.category === card2.category) {
            score += weights.sameCategory;
        }

        // Shared tags
        const tags1 = card1.tags || [];
        const tags2 = card2.tags || [];
        const sharedTags = tags1.filter(tag => tags2.includes(tag));
        if (sharedTags.length > 0) {
            score += weights.sharedTags * (sharedTags.length / Math.max(tags1.length, tags2.length));
        }

        // Title similarity (simple word overlap)
        const titleScore = this.calculateTextSimilarity(card1.title, card2.title);
        score += weights.titleSimilarity * titleScore;

        // Content similarity
        if (card1.content && card2.content) {
            const contentScore = this.calculateTextSimilarity(card1.content, card2.content);
            score += weights.contentSimilarity * contentScore;
        }

        // URL domain similarity
        if (card1.url && card2.url) {
            const domain1 = this.extractDomain(card1.url);
            const domain2 = this.extractDomain(card2.url);
            if (domain1 === domain2) {
                score += weights.urlDomain;
            }
        }

        return Math.min(score, 1);
    }

    /**
     * Calculate text similarity using word overlap
     */
    private static calculateTextSimilarity(text1: string, text2: string): number {
        if (!text1 || !text2) return 0;

        const words1 = this.tokenize(text1);
        const words2 = this.tokenize(text2);

        if (words1.length === 0 || words2.length === 0) return 0;

        const intersection = words1.filter(word => words2.includes(word));
        const union = new Set([...words1, ...words2]);

        return intersection.length / union.size;
    }

    /**
     * Tokenize text into words
     */
    private static tokenize(text: string): string[] {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2 && !this.isStopWord(word));
    }

    /**
     * Check if word is a stop word
     */
    private static isStopWord(word: string): boolean {
        const stopWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
            'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these',
            'those', 'it', 'its', 'they', 'them', 'their', 'what', 'which',
        ]);
        return stopWords.has(word);
    }

    /**
     * Extract domain from URL
     */
    private static extractDomain(url: string): string {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch {
            return '';
        }
    }

    /**
     * Generate human-readable reason for relationship
     */
    private static generateReason(card1: Card, card2: Card): string {
        const reasons: string[] = [];

        if (card1.type === card2.type) {
            reasons.push(`Both are ${card1.type} cards`);
        }

        if (card1.category === card2.category) {
            reasons.push(`Same category: ${card1.category}`);
        }

        const tags1 = card1.tags || [];
        const tags2 = card2.tags || [];
        const sharedTags = tags1.filter(tag => tags2.includes(tag));
        if (sharedTags.length > 0) {
            reasons.push(`Shared tags: ${sharedTags.join(', ')}`);
        }

        if (card1.url && card2.url) {
            const domain1 = this.extractDomain(card1.url);
            const domain2 = this.extractDomain(card2.url);
            if (domain1 === domain2) {
                reasons.push(`Same source: ${domain1}`);
            }
        }

        const titleScore = this.calculateTextSimilarity(card1.title, card2.title);
        if (titleScore > 0.4) {
            reasons.push('Similar titles');
        }

        return reasons.length > 0 ? reasons.join(' • ') : 'Related content';
    }

    /**
     * Get suggested cards for a given card
     */
    static getSuggestedCards(card: Card, allCards: Card[], limit: number = 5): Card[] {
        const relationships = this.analyzeRelationships([card, ...allCards])
            .filter(rel => rel.cardId === card.id || rel.relatedCardId === card.id)
            .slice(0, limit);

        return relationships.map(rel => {
            const relatedId = rel.cardId === card.id ? rel.relatedCardId : rel.cardId;
            return allCards.find(c => c.id === relatedId)!;
        }).filter(Boolean);
    }

    /**
     * Auto-link cards based on relationships
     */
    static autoLinkCards(cards: Card[], threshold: number = 0.5): Map<string, string[]> {
        const links = new Map<string, string[]>();

        const relationships = this.analyzeRelationships(cards);

        for (const rel of relationships) {
            if (rel.score >= threshold) {
                // Add bidirectional links
                if (!links.has(rel.cardId)) {
                    links.set(rel.cardId, []);
                }
                if (!links.has(rel.relatedCardId)) {
                    links.set(rel.relatedCardId, []);
                }

                links.get(rel.cardId)!.push(rel.relatedCardId);
                links.get(rel.relatedCardId)!.push(rel.cardId);
            }
        }

        return links;
    }
}
