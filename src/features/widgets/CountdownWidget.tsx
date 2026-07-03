import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface Props {
    targetDate?: Date;
    title?: string;
}

export function CountdownWidget({
    targetDate = new Date('2024-12-31T23:59:59'),
    title = 'New Year 2025'
}: Props) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = targetDate.getTime() - new Date().getTime();

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="w-full h-full bg-gradient-to-br from-accent-orange to-accent-pink backdrop-blur-xl border border-border/50 rounded-2xl p-6 widget-shadow flex flex-col text-white">
            <div className="flex items-center gap-2 mb-4">
                <Clock size={20} />
                <h2 className="text-sm font-semibold">{title}</h2>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { value: timeLeft.days, label: 'Days' },
                        { value: timeLeft.hours, label: 'Hours' },
                        { value: timeLeft.minutes, label: 'Mins' },
                        { value: timeLeft.seconds, label: 'Secs' },
                    ].map((item, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl font-bold font-mono">
                                {item.value.toString().padStart(2, '0')}
                            </div>
                            <div className="text-xs opacity-80 mt-1">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
