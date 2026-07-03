import { useParams } from 'react-router-dom';

export default function WidgetPage() {
    const { type } = useParams();

    return (
        <div className="w-full h-full bg-background-secondary/95 backdrop-blur-xl border border-border rounded-2xl p-4 widget-shadow">
            <div className="text-center">
                <h2 className="text-sm font-semibold text-text-primary">
                    {type?.toUpperCase()} Widget
                </h2>
                <p className="text-xs text-text-tertiary mt-1">
                    Widget content will be rendered here
                </p>
            </div>
        </div>
    );
}
