import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'elevated';
    interactive?: boolean;
    archived?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', interactive = false, archived = false, children, ...props }, ref) => {
        const baseStyles = 'rounded-2xl transition-all duration-200';

        const variants = {
            default: archived ? 'bg-surface border-2 border-black' : 'bg-surface border border-border',
            glass: 'glass',
            elevated: archived ? 'bg-surface border-2 border-black card-shadow' : 'bg-surface border border-border card-shadow',
        };

        const interactiveStyles = interactive
            ? 'cursor-pointer hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-lg'
            : '';

        return (
            <div
                ref={ref}
                className={cn(baseStyles, variants[variant], interactiveStyles, className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
