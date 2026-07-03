import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'OK',
    cancelText = 'Cancel',
    variant = 'warning',
}: ConfirmDialogProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const variantStyles = {
        danger: 'text-red-500',
        warning: 'text-orange-500',
        info: 'text-blue-500',
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm'} size="sm">
            <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className={`flex-shrink-0 ${variantStyles[variant]}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <p className="text-text-primary">{message}</p>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button onClick={handleConfirm}>{confirmText}</Button>
                </div>
            </div>
        </Modal>
    );
}
