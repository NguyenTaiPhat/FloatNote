import { Loader2 } from 'lucide-react';
import { cn } from '@lib/utils';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <Loader2
            className={cn('animate-spin text-primary', sizeClasses[size], className)}
        />
    );
}

export function LoadingOverlay({ message }: { message?: string }) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="glass-strong rounded-2xl p-8 text-center">
                <Spinner size="lg" className="mx-auto mb-4" />
                {message && (
                    <p className="text-text-secondary">{message}</p>
                )}
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-surface rounded-xl p-4 border border-border animate-pulse">
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-background-secondary rounded-lg" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-background-secondary rounded w-3/4" />
                    <div className="h-3 bg-background-secondary rounded w-1/2" />
                </div>
            </div>
        </div>
    );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}

interface LoadingStateProps {
    loading: boolean;
    error?: Error | null;
    empty?: boolean;
    emptyMessage?: string;
    loadingComponent?: React.ReactNode;
    errorComponent?: React.ReactNode;
    emptyComponent?: React.ReactNode;
    children: React.ReactNode;
}

export function LoadingState({
    loading,
    error,
    empty,
    emptyMessage = 'No data available',
    loadingComponent,
    errorComponent,
    emptyComponent,
    children,
}: LoadingStateProps) {
    if (loading) {
        return <>{loadingComponent || <ListSkeleton />}</>;
    }

    if (error) {
        return (
            <>
                {errorComponent || (
                    <div className="text-center py-12">
                        <p className="text-red-500 mb-2">Error loading data</p>
                        <p className="text-sm text-text-tertiary">{error.message}</p>
                    </div>
                )}
            </>
        );
    }

    if (empty) {
        return (
            <>
                {emptyComponent || (
                    <div className="text-center py-12 text-text-tertiary">
                        {emptyMessage}
                    </div>
                )}
            </>
        );
    }

    return <>{children}</>;
}
