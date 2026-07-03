import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, ...props }, ref) => {
        return (
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'w-full px-4 py-2.5 bg-surface border border-border rounded-xl',
                        'text-text-primary placeholder:text-text-tertiary',
                        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
                        'transition-all duration-200',
                        icon && 'pl-10',
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = 'Input';
