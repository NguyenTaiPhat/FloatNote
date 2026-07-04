import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@lib/utils';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'ghost' | 'primary' | 'danger';
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            default: 'bg-surface hover:bg-surface-hover text-text-primary border border-border',
            ghost: 'hover:bg-surface-hover text-text-secondary hover:text-text-primary',
            primary: 'bg-primary hover:bg-primary-light text-white',
            danger: 'hover:bg-red-500/10 text-red-500',
        };

        const sizes = {
            xs: 'w-5 h-5 text-xs',
            sm: 'w-7 h-7 text-sm',
            md: 'w-9 h-9 text-base',
            lg: 'w-11 h-11 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {children}
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';
