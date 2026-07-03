import { useState, useEffect } from 'react';
import { Plus, Grid, List, Clock, Image, FileText, X } from 'lucide-react';
import { useCardStore, useUIStore, useWorkspaceStore } from '@/store';
import { SmartCardRenderer } from '@features/cards/renderers';
import { Timeline } from '@features/timeline/Timeline';
import { Button } from '@shared/Button';
import { IconButton } from '@shared/IconButton';
import { Tooltip } from '@shared/Tooltip';
import { Modal } from '@shared/Modal';
import { toast } from '@shared/Toast';
import { CardFactory } from '@features/cards/CardFactory';
import { cn } from '@lib/utils';
import { useTranslation } from '@lib/i18n';

export default function HomePage() {
    const { t } = useTranslation();
    const { cards, loadCards, addCard } = useCardStore();
    const { viewMode, setViewMode } = useUIStore();
    const { activeWorkspaceId } = useWorkspaceStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newCardInput, setNewCardInput] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

    useEffect(() => {
        loadCards({ workspaceId: activeWorkspaceId || undefined, archived: false });
    }, [activeWorkspaceId]);

    const handleCreateCard = async () => {
        if (!newCardInput.trim() && attachedFiles.length === 0) return;

        setIsCreating(true);
        try {
            let cardContent = newCardInput;
            const images: string[] = [];

            // Convert image files to base64
            for (const file of attachedFiles) {
                if (file.type.startsWith('image/')) {
                    const base64 = await fileToBase64(file);
                    images.push(base64);
                } else {
                    // For non-image files, just add file info
                    cardContent = cardContent ? `${cardContent}\n[File: ${file.name}]` : `[File: ${file.name}]`;
                }
            }

            const cardData = await CardFactory.createFromInput(cardContent, activeWorkspaceId || undefined);

            // Ensure all required fields are present
            const completeCard = {
                type: cardData.type || 'note',
                title: cardData.title || newCardInput.slice(0, 50) || attachedFiles[0]?.name || 'Untitled',
                description: cardData.description,
                content: cardData.content || cardContent,
                url: cardData.url,
                metadata: {
                    ...cardData.metadata,
                    images: images.length > 0 ? images : undefined,
                },
                tags: cardData.tags || [],
                category: cardData.category || 'general',
                favorite: false,
                archived: false,
                workspaceId: activeWorkspaceId || undefined,
            };

            await addCard(completeCard);
            setNewCardInput('');
            setAttachedFiles([]);
            setIsCreateModalOpen(false);
            toast.success(t.toast.cardCreated);
        } catch (error) {
            console.error('Failed to create card:', error);
            toast.error(t.toast.error);
        } finally {
            setIsCreating(false);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            setAttachedFiles(prev => [...prev, ...files]);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = Array.from(e.clipboardData.items);
        const files = items
            .filter(item => item.kind === 'file')
            .map(item => item.getAsFile())
            .filter((file): file is File => file !== null);

        if (files.length > 0) {
            setAttachedFiles(prev => [...prev, ...files]);
        }
    };

    const removeFile = (index: number) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-border">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">{t.nav.cards}</h1>
                    <p className="text-sm text-text-tertiary">{cards.length} {t.nav.cards.toLowerCase()}</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex gap-1 mr-2">
                        <Tooltip content={t.settings.grid} position="bottom">
                            <IconButton
                                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip content={t.settings.list} position="bottom">
                            <IconButton
                                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                            >
                                <List size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip content={t.settings.timeline} position="bottom">
                            <IconButton
                                variant={viewMode === 'timeline' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('timeline')}
                            >
                                <Clock size={16} />
                            </IconButton>
                        </Tooltip>
                    </div>

                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={16} className="mr-2" />
                        {t.cards.newCard}
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {cards.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-surface mx-auto mb-4 flex items-center justify-center">
                                <Plus size={32} className="text-text-tertiary" />
                            </div>
                            <h2 className="text-xl font-semibold text-text-primary mb-2">{t.search.noResults}</h2>
                            <p className="text-text-secondary mb-6">
                                {t.cards.newCard}
                            </p>
                            <Button onClick={() => setIsCreateModalOpen(true)}>
                                <Plus size={16} className="mr-2" />
                                {t.common.create} {t.cards.note}
                            </Button>
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

            {/* Create Card Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setAttachedFiles([]);
                }}
                title={t.cards.newCard}
                size="md"
            >
                <div className="p-6">
                    <p className="text-sm text-text-secondary mb-4">
                        Paste a URL, type text, or drag & drop files/images
                    </p>

                    <div
                        className={cn(
                            'relative rounded-xl border-2 border-dashed transition-colors',
                            isDragging ? 'border-primary bg-primary/5' : 'border-border'
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <textarea
                            value={newCardInput}
                            onChange={(e) => setNewCardInput(e.target.value)}
                            onPaste={handlePaste}
                            placeholder="Type link or just type a note..."
                            className="w-full h-32 px-4 py-3 bg-transparent text-text-primary placeholder:text-text-tertiary focus:outline-none resize-none"
                            autoFocus
                        />
                        {isDragging && (
                            <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-xl pointer-events-none">
                                <p className="text-primary font-medium">Drop files here</p>
                            </div>
                        )}
                    </div>

                    {/* Attached Files */}
                    {attachedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <p className="text-xs font-medium text-text-secondary">Attached Files:</p>
                            {attachedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between gap-2 px-3 py-2 bg-surface rounded-lg"
                                >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        {file.type.startsWith('image/') ? (
                                            <Image size={16} className="text-primary flex-shrink-0" />
                                        ) : (
                                            <FileText size={16} className="text-text-secondary flex-shrink-0" />
                                        )}
                                        <span className="text-sm text-text-primary truncate">{file.name}</span>
                                        <span className="text-xs text-text-tertiary">
                                            ({(file.size / 1024).toFixed(1)} KB)
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="text-text-tertiary hover:text-text-primary transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsCreateModalOpen(false);
                                setAttachedFiles([]);
                            }}
                        >
                            {t.common.cancel}
                        </Button>
                        <Button
                            onClick={handleCreateCard}
                            disabled={isCreating || (!newCardInput.trim() && attachedFiles.length === 0)}
                        >
                            {isCreating ? t.common.loading : t.common.create}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
