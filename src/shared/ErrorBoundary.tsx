import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex items-center justify-center h-screen bg-background p-8">
                    <div className="max-w-md w-full">
                        <div className="glass-strong rounded-2xl p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="text-red-500" size={32} />
                            </div>

                            <h1 className="text-2xl font-bold text-text-primary mb-2">
                                Something went wrong
                            </h1>

                            <p className="text-text-secondary mb-6">
                                An unexpected error occurred. Please try refreshing the page.
                            </p>

                            {this.state.error && (
                                <div className="bg-surface border border-border rounded-xl p-4 mb-6 text-left">
                                    <p className="text-xs font-mono text-red-400 mb-2">
                                        {this.state.error.toString()}
                                    </p>
                                    {this.state.errorInfo && (
                                        <details className="text-xs text-text-tertiary">
                                            <summary className="cursor-pointer hover:text-text-secondary">
                                                Stack trace
                                            </summary>
                                            <pre className="mt-2 whitespace-pre-wrap">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-2 justify-center">
                                <Button onClick={this.handleReset}>
                                    <RefreshCw size={16} className="mr-2" />
                                    Try Again
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => window.location.reload()}
                                >
                                    Reload App
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
