import { create } from 'zustand';
import type { Card } from '@lib/types';
import { generateId } from '@lib/utils';
import { isApiReady, safeApiCall } from '@lib/api-helper';

interface CardStore {
    cards: Card[];
    selectedCardId: string | null;
    isLoading: boolean;

    loadCards: (filters?: {
        type?: string;
        workspaceId?: string;
        favorite?: boolean;
        archived?: boolean;
    }) => Promise<void>;
    addCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateCard: (id: string, updates: Partial<Card>) => Promise<void>;
    deleteCard: (id: string) => Promise<void>;
    toggleFavorite: (id: string) => Promise<void>;
    toggleArchive: (id: string) => Promise<void>;
    setSelectedCard: (id: string | null) => void;
    searchCards: (query: string) => Promise<Card[]>;
}

export const useCardStore = create<CardStore>((set, get) => ({
    cards: [],
    selectedCardId: null,
    isLoading: false,

    loadCards: async (filters) => {
        if (!isApiReady()) {
            console.warn('API not ready, skipping loadCards');
            return;
        }

        set({ isLoading: true });
        const cards = await safeApiCall(
            () => window.api.cards.findAll(filters),
            []
        );
        set({ cards, isLoading: false });
    },

    addCard: async (cardData) => {
        if (!isApiReady()) return;

        const now = new Date().toISOString();
        const card: Card = {
            ...cardData,
            id: generateId(),
            createdAt: now,
            updatedAt: now,
        };

        await window.api.cards.create(card);
        set(state => ({ cards: [card, ...state.cards] }));
    },

    updateCard: async (id, updates) => {
        if (!isApiReady()) return;

        await window.api.cards.update(id, updates);
        set(state => ({
            cards: state.cards.map(card =>
                card.id === id ? { ...card, ...updates, updatedAt: new Date().toISOString() } : card
            ),
        }));
    },

    deleteCard: async (id) => {
        if (!isApiReady()) return;

        await window.api.cards.delete(id);
        set(state => ({
            cards: state.cards.filter(card => card.id !== id),
            selectedCardId: state.selectedCardId === id ? null : state.selectedCardId,
        }));
    },

    toggleFavorite: async (id) => {
        const card = get().cards.find(c => c.id === id);
        if (card) {
            await get().updateCard(id, { favorite: !card.favorite });
        }
    },

    toggleArchive: async (id) => {
        const card = get().cards.find(c => c.id === id);
        if (card) {
            await get().updateCard(id, { archived: !card.archived });
        }
    },

    setSelectedCard: (id) => {
        set({ selectedCardId: id });
    },

    searchCards: async (query) => {
        return await safeApiCall(
            () => window.api.cards.search(query),
            []
        );
    },
}));
