import { useEffect } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;

interface ShortcutMap {
    [key: string]: ShortcutHandler;
}

export function useShortcuts(shortcuts: ShortcutMap) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = [
                e.ctrlKey && 'ctrl',
                e.altKey && 'alt',
                e.shiftKey && 'shift',
                e.key.toLowerCase(),
            ]
                .filter(Boolean)
                .join('+');

            const handler = shortcuts[key];
            if (handler) {
                e.preventDefault();
                handler(e);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
}

export const SHORTCUTS = {
    GLOBAL_SEARCH: 'alt+space',
    COMMAND_PALETTE: 'ctrl+shift+p',
    BOSS_MODE: 'ctrl+alt+b',
    NEW_CARD: 'ctrl+n',
    SAVE: 'ctrl+s',
    DELETE: 'delete',
    ESCAPE: 'escape',
    SEARCH: 'ctrl+f',
    TOGGLE_SIDEBAR: 'ctrl+b',
} as const;
