import { useState, useEffect, useRef } from 'react';
import { Command, Plus, Star, Archive, Trash2, Settings, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@shared/Input';
import { useCardStore, useUIStore } from '@/store';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

interface CommandItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    action: () => void;
    category: string;
}

export function CommandPalette({ isOpen, onClose }: Props) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const { setViewMode } = useUIStore();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const commands: CommandItem[] = [
        { id: 'new-note', label: 'New Note', icon: <Plus size={16} />, action: () => { }, category: 'Actions' },
        { id: 'new-card', label: 'Add Smart Card', icon: <Plus size={16} />, action: () => { }, category: 'Actions' },
        { id: 'favorites', label: 'Show Favorites', icon: <Star size={16} />, action: () => { }, category: 'View' },
        { id: 'archived', label: 'Show Archived', icon: <Archive size={16} />, action: () => { }, category: 'View' },
        { id: 'grid', label: 'Grid View', icon: <Command size={16} />, action: () => setViewMode('grid'), category: 'View' },
        { id: 'list', label: 'List View', icon: <Command size={16} />, action: () => setViewMode('list'), category: 'View' },
        { id: 'timeline', label: 'Timeline View', icon: <Command size={16} />, action: () => setViewMode('timeline'), category: 'View' },
        { id: 'edge-dock', label: 'Toggle Edge Dock', icon: <Command size={16} />, action: () => window.electron?.toggleEdgeDock(), category: 'Window' },
        { id: 'boss-mode', label: 'Toggle Boss Mode (Ctrl+Alt+B)', icon: <Command size={16} />, action: () => window.electron?.toggleBossMode(), category: 'Window' },
        { id: 'settings', label: 'Settings', icon: <Settings size={16} />, action: () => { }, category: 'System' },
        { id: 'export', label: 'Export Data', icon: <Download size={16} />, action: () => { }, category: 'System' },
    ];

    const filtered = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filtered.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
        } else if (e.key === 'Enter' && filtered[selectedIndex]) {
            e.preventDefault();
            filtered[selectedIndex].action();
            onClose();
        }
    };

    const groupedCommands = filtered.reduce((acc, cmd) => {
        if (!acc[cmd.category]) acc[cmd.category] = [];
        acc[cmd.category].push(cmd);
        return acc;
    }, {} as Record<string, CommandItem[]>);

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
                            className="w-full max-w-xl bg-background-secondary border border-border rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-border">
                                <Input
                                    ref={inputRef}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a command..."
                                    icon={<Command size={18} />}
                                    className="border-none bg-surface"
                                />
                            </div>

                            <div className="max-h-96 overflow-y-auto p-2">
                                {Object.entries(groupedCommands).map(([category, items]) => (
                                    <div key={category} className="mb-4">
                                        <div className="px-3 py-1 text-xs font-semibold text-text-tertiary uppercase">
                                            {category}
                                        </div>
                                        {items.map((cmd, index) => {
                                            const globalIndex = filtered.indexOf(cmd);
                                            return (
                                                <button
                                                    key={cmd.id}
                                                    onClick={() => {
                                                        cmd.action();
                                                        onClose();
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${globalIndex === selectedIndex
                                                        ? 'bg-primary text-white'
                                                        : 'hover:bg-surface text-text-primary'
                                                        }`}
                                                >
                                                    {cmd.icon}
                                                    <span className="font-medium">{cmd.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}

                                {filtered.length === 0 && (
                                    <div className="text-center py-12 text-text-tertiary">
                                        No commands found
                                    </div>
                                )}
                            </div>

                            <div className="px-4 py-3 border-t border-border bg-surface/50">
                                <div className="flex items-center justify-between text-xs text-text-tertiary">
                                    <span>↑↓ Navigate • ↵ Execute • ESC Close</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
