import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary: 'bg-primary hover:bg-primary-light text-white shadow-sm',
            secondary: 'bg-surface hover:bg-surface-hover text-text-primary border border-border',
            ghost: 'hover:bg-surface-hover text-text-primary',
            danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-sm',
            lg: 'px-6 py-3 text-base',
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

Button.displayName = 'Button';
