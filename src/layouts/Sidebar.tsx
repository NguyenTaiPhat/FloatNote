import { Home, Star, Archive, Folder, Plus, Settings, Network, Trash2, Pin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useWorkspaceStore, useUIStore } from '@/store';
import { IconButton } from '@shared/IconButton';
import { Tooltip } from '@shared/Tooltip';
import { WorkspaceDialog } from '@features/workspace/WorkspaceDialog';
import { cn } from '@lib/utils';
import { useTranslation } from '@lib/i18n';

export function Sidebar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { workspaces, activeWorkspaceId, setActiveWorkspace, deleteWorkspace, togglePin } = useWorkspaceStore();
    const { isSidebarCollapsed, toggleSidebar } = useUIStore();
    const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false);

    const handleDeleteWorkspace = async (e: React.MouseEvent, workspaceId: string) => {
        e.stopPropagation();

        if (workspaces.length <= 1) {
            alert('Cannot delete the last workspace');
            return;
        }

        if (confirm('Are you sure you want to delete this workspace? All cards in this workspace will also be deleted.')) {
            await deleteWorkspace(workspaceId);
        }
    };

    const handleTogglePin = async (e: React.MouseEvent, workspaceId: string) => {
        e.stopPropagation();
        await togglePin(workspaceId);
    };

    if (isSidebarCollapsed) {
        return (
            <aside className="w-16 bg-surface border-r border-border flex flex-col items-center py-4 gap-2">
                <Tooltip content="Expand Sidebar" side="right">
                    <IconButton variant="ghost" size="sm" onClick={toggleSidebar}>
                        <Folder size={18} />
                    </IconButton>
                </Tooltip>
            </aside>
        );
    }

    return (
        <aside className="w-64 bg-surface border-r border-border flex flex-col">
            {/* Header */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-border">
                <h2 className="font-semibold text-text-primary">FloatNote</h2>
                <IconButton variant="ghost" size="sm" onClick={toggleSidebar}>
                    <Folder size={18} />
                </IconButton>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-3">
                <div className="space-y-1 mb-6">
                    <NavItem
                        icon={<Home size={18} />}
                        label={t.nav.home}
                        active={location.pathname === '/'}
                        onClick={() => navigate('/')}
                    />
                    <NavItem
                        icon={<Star size={18} />}
                        label={t.cards.favoriteCard}
                        active={location.pathname === '/favorites'}
                        onClick={() => navigate('/favorites')}
                    />
                    <NavItem
                        icon={<Archive size={18} />}
                        label={t.common.archive}
                        active={location.pathname === '/archived'}
                        onClick={() => navigate('/archived')}
                    />
                    <NavItem
                        icon={<Network size={18} />}
                        label={t.nav.graph}
                        active={location.pathname === '/graph'}
                        onClick={() => navigate('/graph')}
                    />
                </div>

                {/* Workspaces */}
                <div className="mb-2">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <span className="text-xs font-semibold text-text-tertiary uppercase">
                            {t.nav.workspaces}
                        </span>
                        <IconButton
                            variant="ghost"
                            size="xs"
                            onClick={() => setIsWorkspaceDialogOpen(true)}
                        >
                            <Plus size={14} />
                        </IconButton>
                    </div>

                    <div className="space-y-1">
                        {workspaces.map(workspace => (
                            <div
                                key={workspace.id}
                                className={cn(
                                    'group/workspace flex items-center gap-3 px-3 py-2 rounded-xl transition-colors',
                                    activeWorkspaceId === workspace.id
                                        ? 'bg-primary/10'
                                        : 'hover:bg-background-secondary'
                                )}
                            >
                                <button
                                    onClick={() => setActiveWorkspace(workspace.id)}
                                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                                >
                                    <div
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: workspace.color }}
                                    />
                                    <span
                                        className={cn(
                                            'text-sm font-medium truncate',
                                            activeWorkspaceId === workspace.id
                                                ? 'text-primary'
                                                : 'text-text-secondary'
                                        )}
                                    >
                                        {workspace.name}
                                    </span>
                                </button>
                                <div className="flex gap-0.5">
                                    <IconButton
                                        variant="ghost"
                                        size="xs"
                                        className={cn(
                                            'transition-opacity',
                                            workspace.pinned
                                                ? 'opacity-100'
                                                : 'opacity-0 group-hover/workspace:opacity-100'
                                        )}
                                        onClick={(e) => handleTogglePin(e, workspace.id)}
                                    >
                                        <Pin
                                            size={12}
                                            className={cn(
                                                workspace.pinned
                                                    ? 'text-primary fill-primary'
                                                    : 'text-text-tertiary hover:text-primary'
                                            )}
                                        />
                                    </IconButton>
                                    <IconButton
                                        variant="ghost"
                                        size="xs"
                                        className="opacity-0 group-hover/workspace:opacity-100 transition-opacity"
                                        onClick={(e) => handleDeleteWorkspace(e, workspace.id)}
                                    >
                                        <Trash2 size={12} className="text-text-tertiary hover:text-red-500" />
                                    </IconButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border">
                <NavItem
                    icon={<Settings size={18} />}
                    label={t.nav.settings}
                    active={location.pathname === '/settings'}
                    onClick={() => navigate('/settings')}
                />
            </div>

            {/* Workspace Dialog */}
            <WorkspaceDialog
                isOpen={isWorkspaceDialogOpen}
                onClose={() => setIsWorkspaceDialogOpen(false)}
            />
        </aside>
    );
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left',
                active
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-background-secondary'
            )}
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}

export default Sidebar;
