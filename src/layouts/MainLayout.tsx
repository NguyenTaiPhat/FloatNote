import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TitleBar from './TitleBar';
import { GlobalSearch } from '@features/search/GlobalSearch';
import { CommandPalette } from '@features/command-palette/CommandPalette';
import { useUIStore, useWorkspaceStore, useCardStore } from '@/store';
import { waitForApi } from '@lib/api-helper';
import { Spinner } from '@shared/LoadingStates';

export default function MainLayout() {
    const [apiReady, setApiReady] = useState(false);
    const { isSearchOpen, isCommandPaletteOpen, toggleSearch, toggleCommandPalette } = useUIStore();
    const { loadWorkspaces } = useWorkspaceStore();
    const { loadCards } = useCardStore();

    useEffect(() => {
        // Wait for API to be ready before loading data
        waitForApi()
            .then(() => {
                setApiReady(true);
                // Load data after API is ready
                loadWorkspaces();
                loadCards();

                // Setup global shortcuts listeners
                if (window.electron) {
                    window.electron.onGlobalSearch(() => toggleSearch());
                    window.electron.onCommandPalette(() => toggleCommandPalette());
                }
            })
            .catch((error) => {
                console.error('Failed to initialize API:', error);
            });
    }, []);

    if (!apiReady) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-4" />
                    <p className="text-text-secondary">Initializing FloatNote...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            <TitleBar />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-hidden">
                    <Outlet />
                </main>
            </div>

            <GlobalSearch isOpen={isSearchOpen} onClose={() => toggleSearch()} />
            <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => toggleCommandPalette()} />
        </div>
    );
}
