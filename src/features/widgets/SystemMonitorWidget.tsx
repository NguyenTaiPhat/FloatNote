import { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity } from 'lucide-react';

export function SystemMonitorWidget() {
    const [stats, setStats] = useState({
        cpu: 45,
        memory: 62,
        disk: 38,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setStats({
                cpu: Math.floor(Math.random() * 30) + 30,
                memory: Math.floor(Math.random() * 20) + 50,
                disk: Math.floor(Math.random() * 10) + 35,
            });
        }, 2000);

        return () => clearInterval(timer);
    }, []);

    const getColor = (value: number) => {
        if (value > 80) return '#ef4444';
        if (value > 60) return '#f59e0b';
        return '#10b981';
    };

    return (
        <div className="w-full h-full bg-background-secondary/95 backdrop-blur-xl border border-border rounded-2xl p-4 widget-shadow flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <Activity size={20} className="text-primary" />
                <h2 className="text-sm font-semibold text-text-primary">System Monitor</h2>
            </div>

            <div className="flex-1 space-y-4">
                {[
                    { icon: Cpu, label: 'CPU', value: stats.cpu },
                    { icon: HardDrive, label: 'Memory', value: stats.memory },
                    { icon: HardDrive, label: 'Disk', value: stats.disk },
                ].map((item, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <item.icon size={16} className="text-text-secondary" />
                                <span className="text-sm text-text-primary">{item.label}</span>
                            </div>
                            <span className="text-sm font-semibold" style={{ color: getColor(item.value) }}>
                                {item.value}%
                            </span>
                        </div>
                        <div className="h-2 bg-surface rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${item.value}%`,
                                    backgroundColor: getColor(item.value)
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
