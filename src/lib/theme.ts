export type Theme = 'dark' | 'light' | 'system';

export const themes = {
    dark: {
        background: '10 10 10',
        'background-secondary': '20 20 20',
        surface: '26 26 26',
        'surface-hover': '36 36 36',
        'surface-active': '42 42 42',
        border: '42 42 42',
        primary: '99 102 241',
        'primary-hover': '85 88 227',
        'text-primary': '255 255 255',
        'text-secondary': '163 163 163',
        'text-tertiary': '102 102 102',
    },
    light: {
        background: '255 255 255',
        'background-secondary': '245 245 245',
        surface: '250 250 250',
        'surface-hover': '240 240 240',
        'surface-active': '229 229 229',
        border: '229 229 229',
        primary: '99 102 241',
        'primary-hover': '85 88 227',
        'text-primary': '10 10 10',
        'text-secondary': '82 82 82',
        'text-tertiary': '163 163 163',
    },
};

export function applyTheme(theme: Theme) {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

    const activeTheme = theme === 'system' ? systemTheme : theme;
    const colors = themes[activeTheme];

    const root = document.documentElement;

    // Get saved primary color and convert to RGB if exists
    const savedPrimaryColor = localStorage.getItem('primaryColor');
    let primaryRgb: string | null = null;

    if (savedPrimaryColor) {
        const hex = savedPrimaryColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        primaryRgb = `${r} ${g} ${b}`;
    }

    Object.entries(colors).forEach(([key, value]) => {
        // Skip primary color if user has custom color saved
        if (key === 'primary' && primaryRgb) {
            root.style.setProperty(`--${key}`, primaryRgb);
        } else {
            root.style.setProperty(`--${key}`, value);
        }
    });

    document.documentElement.classList.toggle('dark', activeTheme === 'dark');
    document.documentElement.classList.toggle('light', activeTheme === 'light');
}

export function getSystemTheme(): 'dark' | 'light' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

export function watchSystemTheme(callback: (theme: 'dark' | 'light') => void) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: MediaQueryListEvent) => {
        callback(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
        mediaQuery.removeEventListener('change', handler);
    };
}
