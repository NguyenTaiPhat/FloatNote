import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCardStore } from '@/store';
import { SmartCardRenderer } from '@features/cards/renderers';
import { Input } from '@shared/Input';
import Fuse from 'fuse.js';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: Props) {
    const [query, setQuery] = useState('');
    const { cards } = useCardStore();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery('');
        }
    }, [isOpen]);

    const fuse = new Fuse(cards, {
        keys: ['title', 'description', 'content', 'tags'],
        threshold: 0.3,
    });

    const results = query.trim()
        ? fuse.search(query).map(result => result.item)
        : cards.slice(0, 10);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="w-full max-w-2xl bg-background-secondary border border-border rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-border">
                                <Input
                                    ref={inputRef}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search everything..."
                                    icon={<Search size={18} />}
                                    className="border-none bg-surface"
                                />
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto p-4">
                                {results.length > 0 ? (
                                    <div className="grid gap-3">
                                        {results.map(card => (
                                            <div key={card.id} onClick={onClose}>
                                                <SmartCardRenderer card={card} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-text-tertiary">
                                        No results found
                                    </div>
                                )}
                            </div>

                            <div className="px-4 py-3 border-t border-border bg-surface/50">
                                <div className="flex items-center justify-between text-xs text-text-tertiary">
                                    <span>↑↓ Navigate • ↵ Select • ESC Close</span>
                                    <span>{results.length} results</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
