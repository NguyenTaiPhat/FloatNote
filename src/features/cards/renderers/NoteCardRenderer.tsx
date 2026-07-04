import { FileText, Star, Archive, Trash2, Edit2, Save } from 'lucide-react';
import type { NoteCard } from '@lib/types';
import { Card } from '@shared/Card';
import { IconButton } from '@shared/IconButton';
import { Modal } from '@shared/Modal';
import { Button } from '@shared/Button';
import { ConfirmDialog } from '@shared/ConfirmDialog';
import { toast } from '@shared/Toast';
import { formatRelativeTime, truncate } from '@lib/utils';
import { useCardStore } from '@/store';
import { useState } from 'react';
import { useTranslation } from '@lib/i18n';

interface Props {
    card: NoteCard;
    onClick?: () => void;
}

export function NoteCardRenderer({ card, onClick }: Props) {
    const { t } = useTranslation();
    const { toggleFavorite, toggleArchive, deleteCard, updateCard } = useCardStore();
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [editTitle, setEditTitle] = useState(card.title);
    const [editContent, setEditContent] = useState(card.content || '');

    const handleCardClick = () => {
        if (onClick) {
            onClick();
        } else {
            setIsDetailOpen(true);
        }
    };

    const handleSave = () => {
        updateCard(card.id, {
            title: editTitle,
            content: editContent,
        });
        setIsEditing(false);
        toast.success(t.toast.cardUpdated);
    };

    const handleDelete = () => {
        deleteCard(card.id);
        setIsDetailOpen(false);
        toast.success(t.toast.cardDeleted);
    };

    return (
        <>
            <Card
                interactive
                variant="elevated"
                archived={card.archived}
                className="overflow-hidden group"
                onClick={handleCardClick}
            >
                {/* Header with image or gradient background */}
                {card.metadata?.images && Array.isArray(card.metadata.images) && card.metadata.images.length > 0 ? (
                    <div className="relative h-32 overflow-hidden">
                        <img
                            src={(card.metadata.images as string[])[0]}
                            alt={card.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>
                ) : (
                    <div className="relative h-32 bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <FileText size={48} className="text-white opacity-90" />
                    </div>
                )}

                {/* Content */}
                <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-text-primary truncate flex-1">
                            {card.title}
                        </h3>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(card.id);
                                }}
                            >
                                <Star
                                    size={14}
                                    className={card.favorite ? 'fill-yellow-500 text-yellow-500' : ''}
                                />
                            </IconButton>
                            <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleArchive(card.id);
                                }}
                            >
                                <Archive
                                    size={14}
                                    className={card.archived ? 'fill-black text-black dark:fill-white dark:text-white' : ''}
                                />
                            </IconButton>
                            <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteCard(card.id);
                                }}
                            >
                                <Trash2 size={14} />
                            </IconButton>
                        </div>
                    </div>

                    {card.content && (
                        <p className="text-sm text-text-secondary line-clamp-3 mb-3">
                            {truncate(card.content, 150)}
                        </p>
                    )}

                    <div className="flex items-center gap-2 mt-auto">
                        <span className="text-xs text-text-tertiary">
                            {formatRelativeTime(card.createdAt)}
                        </span>
                        {card.tags && card.tags.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                                {card.tags.slice(0, 2).map(tag => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 text-xs rounded-md bg-surface text-text-secondary"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Detail Modal */}
            <Modal
                isOpen={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setIsEditing(false);
                    setEditTitle(card.title);
                    setEditContent(card.content || '');
                }}
                title={isEditing ? t.cards.editCard : t.cards.title}
                size="lg"
            >
                <div className="p-6">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    {t.cards.title}
                                </label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full px-4 py-2 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    {t.cards.content}
                                </label>
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    rows={10}
                                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditTitle(card.title);
                                        setEditContent(card.content || '');
                                    }}
                                >
                                    {t.common.cancel}
                                </Button>
                                <Button onClick={handleSave}>
                                    <Save size={16} className="mr-2" />
                                    {t.common.save}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <FileText size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-text-primary mb-1">
                                            {card.title}
                                        </h2>
                                        <p className="text-sm text-text-tertiary">
                                            {formatRelativeTime(card.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <IconButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditing(true);
                                        }}
                                    >
                                        <Edit2 size={16} />
                                    </IconButton>
                                    <IconButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(card.id);
                                        }}
                                    >
                                        <Star
                                            size={16}
                                            className={card.favorite ? 'fill-yellow-500 text-yellow-500' : ''}
                                        />
                                    </IconButton>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="prose prose-sm max-w-none">
                                {card.metadata?.images && Array.isArray(card.metadata.images) && card.metadata.images.length > 0 ? (
                                    <div className="mb-4 grid grid-cols-2 gap-2">
                                        {(card.metadata.images as string[]).map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`Attachment ${index + 1}`}
                                                className="w-full h-auto rounded-lg object-cover"
                                            />
                                        ))}
                                    </div>
                                ) : null}

                                {/* Text Content */}
                                <div className="p-4 bg-surface rounded-xl min-h-[200px]">
                                    <p className="text-text-primary whitespace-pre-wrap">
                                        {card.content || 'No content'}
                                    </p>
                                </div>
                            </div>

                            {/* Tags */}
                            {card.tags && card.tags.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-sm font-medium text-text-secondary mb-2">{t.cards.tags}</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {card.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 text-sm rounded-lg bg-surface text-text-primary"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-between items-center mt-6 pt-6 border-t border-border">
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => toggleArchive(card.id)}
                                    >
                                        <Archive size={14} className="mr-2" />
                                        {card.archived ? t.common.restore : t.common.archive}
                                    </Button>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setIsDeleteConfirmOpen(true)}
                                >
                                    <Trash2 size={14} className="mr-2" />
                                    {t.common.delete}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleDelete}
                title={t.dialogs.deleteCard}
                message={t.dialogs.deleteCardConfirm}
                confirmText={t.common.delete}
                cancelText={t.common.cancel}
                variant="danger"
            />
        </>
    );
}
