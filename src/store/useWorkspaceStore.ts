import { create } from 'zustand';
import type { Workspace } from '@lib/types';
import { generateId } from '@lib/utils';
import { COLORS } from '@lib/constants';
import { isApiReady, safeApiCall } from '@lib/api-helper';

interface WorkspaceStore {
    workspaces: Workspace[];
    activeWorkspaceId: string | null;
    isLoading: boolean;

    loadWorkspaces: () => Promise<void>;
    addWorkspace: (workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateWorkspace: (id: string, updates: Partial<Workspace>) => Promise<void>;
    deleteWorkspace: (id: string) => Promise<void>;
    togglePin: (id: string) => Promise<void>;
    setActiveWorkspace: (id: string) => void;
    getActiveWorkspace: () => Workspace | null;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
    workspaces: [],
    activeWorkspaceId: null,
    isLoading: false,

    loadWorkspaces: async () => {
        if (!isApiReady()) {
            console.warn('API not ready, skipping loadWorkspaces');
            return;
        }

        set({ isLoading: true });
        let workspaces = await safeApiCall(
            () => window.api.workspaces.findAll(),
            []
        );

        // Create default workspace if none exists
        if (workspaces.length === 0) {
            const now = new Date().toISOString();
            const defaultWorkspace: Workspace = {
                id: generateId(),
                name: 'Personal',
                type: 'personal',
                color: COLORS.primary,
                createdAt: now,
                updatedAt: now,
            };
            await window.api.workspaces.create(defaultWorkspace);
            workspaces = [defaultWorkspace];
        }

        set({
            workspaces,
            activeWorkspaceId: workspaces[0].id,
            isLoading: false
        });
    },

    addWorkspace: async (workspaceData) => {
        if (!isApiReady()) return;

        const now = new Date().toISOString();
        const workspace: Workspace = {
            ...workspaceData,
            id: generateId(),
            createdAt: now,
            updatedAt: now,
        };

        await window.api.workspaces.create(workspace);
        set(state => ({ workspaces: [...state.workspaces, workspace] }));
    },

    updateWorkspace: async (id, updates) => {
        if (!isApiReady()) return;

        await window.api.workspaces.update(id, updates);
        set(state => ({
            workspaces: state.workspaces.map(ws =>
                ws.id === id ? { ...ws, ...updates, updatedAt: new Date().toISOString() } : ws
            ),
        }));
    },

    deleteWorkspace: async (id) => {
        if (!isApiReady()) return;

        await window.api.workspaces.delete(id);
        set(state => {
            const newWorkspaces = state.workspaces.filter(ws => ws.id !== id);
            return {
                workspaces: newWorkspaces,
                activeWorkspaceId: state.activeWorkspaceId === id
                    ? (newWorkspaces[0]?.id || null)
                    : state.activeWorkspaceId,
            };
        });
    },

    togglePin: async (id) => {
        const workspace = get().workspaces.find(ws => ws.id === id);
        if (workspace) {
            await get().updateWorkspace(id, { pinned: !workspace.pinned });
            // Re-sort workspaces after pin toggle
            set(state => ({
                workspaces: [...state.workspaces].sort((a, b) => {
                    if (a.pinned === b.pinned) return 0;
                    return a.pinned ? -1 : 1;
                })
            }));
        }
    },

    setActiveWorkspace: (id) => {
        set({ activeWorkspaceId: id });
    },

    getActiveWorkspace: () => {
        const { workspaces, activeWorkspaceId } = get();
        return workspaces.find(ws => ws.id === activeWorkspaceId) || null;
    },
}));
