export function getWeatherTheme(condition) {
    switch (condition?.toLowerCase()) {
        case 'sunny':
            return 'from-yellow-400 to-yellow-200';
        case 'rain':
            return 'from-blue-700 to-blue-400';
        case 'cloudy':
            return 'from-gray-500 to-gray-300';
        default:
            return 'from-blue-400 to-blue-600';
    }
}
