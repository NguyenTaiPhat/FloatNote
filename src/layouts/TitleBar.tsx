import { Maximize, X, Minus } from 'lucide-react';
import { IconButton } from '@shared/IconButton';

export function TitleBar() {
    const handleMinimize = () => {
        if (window.electron) {
            window.electron.minimize();
        }
    };

    const handleMaximize = () => {
        if (window.electron) {
            window.electron.maximize();
        }
    };

    const handleClose = () => {
        if (window.electron) {
            window.electron.close();
        }
    };

    return (
        <div className="h-8 bg-surface border-b border-border flex items-center justify-between px-3 select-none drag-region">
            <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-text-tertiary">FloatNote</span>
            </div>

            <div className="flex items-center gap-1 no-drag">
                <IconButton
                    variant="ghost"
                    size="xs"
                    onClick={handleMinimize}
                    className="hover:bg-background-secondary"
                >
                    <Minus size={12} />
                </IconButton>
                <IconButton
                    variant="ghost"
                    size="xs"
                    onClick={handleMaximize}
                    className="hover:bg-background-secondary"
                >
                    <Maximize size={12} />
                </IconButton>
                <IconButton
                    variant="ghost"
                    size="xs"
                    onClick={handleClose}
                    className="hover:bg-red-500 hover:text-white"
                >
                    <X size={12} />
                </IconButton>
            </div>
        </div>
    );
}

export default TitleBar;
