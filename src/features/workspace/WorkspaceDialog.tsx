import { useState } from 'react';
import { Modal } from '@shared/Modal';
import { Button } from '@shared/Button';
import { useWorkspaceStore } from '@/store';
import { WORKSPACE_COLORS, WORKSPACE_TYPES } from '@lib/constants';
import { cn } from '@lib/utils';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function WorkspaceDialog({ isOpen, onClose }: Props) {
    const { addWorkspace } = useWorkspaceStore();
    const [name, setName] = useState('');
    const [selectedColor, setSelectedColor] = useState<string>(WORKSPACE_COLORS[0].value);
    const [selectedType, setSelectedType] = useState<typeof WORKSPACE_TYPES[number]>('personal');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) return;

        setLoading(true);
        try {
            await addWorkspace({
                name: name.trim(),
                type: selectedType,
                color: selectedColor,
                description: description.trim() || undefined,
            });

            // Reset form
            setName('');
            setSelectedColor(WORKSPACE_COLORS[0].value);
            setSelectedType('personal');
            setDescription('');
            onClose();
        } catch (error) {
            console.error('Failed to create workspace:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Workspace" size="md">
            <div className="p-6">
                <div className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Workspace Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Workspace"
                            className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            autoFocus
                        />
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-3">
                            Color
                        </label>
                        <div className="grid grid-cols-8 gap-2">
                            {WORKSPACE_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setSelectedColor(color.value)}
                                    className={cn(
                                        'w-full aspect-square rounded-xl transition-all',
                                        selectedColor === color.value
                                            ? 'ring-2 ring-offset-2 ring-offset-background-secondary scale-105'
                                            : 'hover:scale-105'
                                    )}
                                    style={{
                                        backgroundColor: color.value,
                                        ...(selectedColor === color.value && {
                                            '--tw-ring-color': color.value,
                                        } as any),
                                    }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-3">
                            Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {WORKSPACE_TYPES.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className={cn(
                                        'px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize',
                                        selectedType === type
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'bg-surface text-text-secondary hover:bg-background-secondary border border-border'
                                    )}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's this workspace for?"
                            rows={3}
                            className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-all"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={!name.trim() || loading}
                    >
                        {loading ? 'Creating...' : 'Create Workspace'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
