import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastStore {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (toast) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));

        // Auto remove after duration
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, toast.duration || 3000);
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function ToastContainer() {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const icons = {
        success: <CheckCircle size={20} className="text-green-500" />,
        error: <XCircle size={20} className="text-red-500" />,
        warning: <AlertCircle size={20} className="text-orange-500" />,
        info: <Info size={20} className="text-blue-500" />,
    };

    const backgrounds = {
        success: 'bg-green-500/10 border-green-500/20',
        error: 'bg-red-500/10 border-red-500/20',
        warning: 'bg-orange-500/10 border-orange-500/20',
        info: 'bg-blue-500/10 border-blue-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg min-w-[300px] max-w-[400px] ${backgrounds[toast.type]}`}
        >
            {icons[toast.type]}
            <p className="flex-1 text-sm text-text-primary">{toast.message}</p>
            <button
                onClick={onClose}
                className="text-text-tertiary hover:text-text-primary transition-colors"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
}

// Helper functions
export const toast = {
    success: (message: string, duration?: number) => {
        useToastStore.getState().addToast({ type: 'success', message, duration });
    },
    error: (message: string, duration?: number) => {
        useToastStore.getState().addToast({ type: 'error', message, duration });
    },
    warning: (message: string, duration?: number) => {
        useToastStore.getState().addToast({ type: 'warning', message, duration });
    },
    info: (message: string, duration?: number) => {
        useToastStore.getState().addToast({ type: 'info', message, duration });
    },
};
