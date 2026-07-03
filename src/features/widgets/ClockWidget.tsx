import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export function ClockWidget() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

    const date = time.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="w-full h-full bg-gradient-to-br from-primary to-accent-purple backdrop-blur-xl border border-border/50 rounded-2xl p-6 widget-shadow flex flex-col items-center justify-center text-white">
            <div className="text-6xl font-bold mb-2 font-mono tracking-tight">
                {hours}:{minutes}
                <span className="text-3xl opacity-60">:{seconds}</span>
            </div>

            <div className="flex items-center gap-2 text-sm opacity-80 mt-2">
                <Calendar size={16} />
                <span>{date}</span>
            </div>
        </div>
    );
}
