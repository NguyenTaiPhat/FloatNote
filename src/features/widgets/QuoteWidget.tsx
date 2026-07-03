import { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import { IconButton } from '@shared/IconButton';

interface QuoteData {
    text: string;
    author: string;
}

export function QuoteWidget() {
    const [quote, setQuote] = useState<QuoteData>({
        text: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs',
    });

    const quotes: QuoteData[] = [
        { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
        { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
        { text: 'Design is not just what it looks like. Design is how it works.', author: 'Steve Jobs' },
        { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
        {
            text: 'Code is like humor. When you have to explain it, it's bad.', author: 'Cory House' },
    { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
    { text: 'The best way to predict the future is to invent it.', author: 'Alan Kay' },
    ];

    const getRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    };

    return (
        <div className="w-full h-full bg-gradient-to-br from-accent-purple to-accent-pink backdrop-blur-xl border border-border/50 rounded-2xl p-6 widget-shadow flex flex-col text-white">
            <div className="flex items-center justify-between mb-4">
                <Quote size={24} className="opacity-60" />
                <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={getRandomQuote}
                    className="text-white hover:bg-white/20"
                >
                    <RefreshCw size={16} />
                </IconButton>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <p className="text-lg font-medium leading-relaxed mb-4">
                    "{quote.text}"
                </p>
                <p className="text-sm opacity-80">— {quote.author}</p>
            </div>
        </div>
    );
}
