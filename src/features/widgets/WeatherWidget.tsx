import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';

export function WeatherWidget() {
    // Mock data - integrate with weather API
    const weather = {
        location: 'San Francisco',
        temperature: 18,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
    };

    const getWeatherIcon = () => {
        const condition = weather.condition.toLowerCase();
        if (condition.includes('rain')) return <CloudRain size={48} />;
        if (condition.includes('cloud')) return <Cloud size={48} />;
        if (condition.includes('sun')) return <Sun size={48} />;
        return <Cloud size={48} />;
    };

    return (
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 backdrop-blur-xl border border-border/50 rounded-2xl p-6 widget-shadow flex flex-col text-white">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="text-5xl font-bold mb-1">{weather.temperature}°</div>
                    <div className="text-sm opacity-80">{weather.condition}</div>
                    <div className="text-xs opacity-60 mt-1">{weather.location}</div>
                </div>
                <div className="opacity-80">
                    {getWeatherIcon()}
                </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <span className="text-xs">💧</span>
                    </div>
                    <div>
                        <div className="opacity-80">Humidity</div>
                        <div className="font-semibold">{weather.humidity}%</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <Wind size={14} />
                    </div>
                    <div>
                        <div className="opacity-80">Wind</div>
                        <div className="font-semibold">{weather.windSpeed} km/h</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
