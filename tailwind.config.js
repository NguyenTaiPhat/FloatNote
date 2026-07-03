/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: 'rgb(var(--background) / <alpha-value>)',
                    secondary: 'rgb(var(--background-secondary) / <alpha-value>)',
                },
                surface: {
                    DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
                    hover: 'rgb(var(--surface-hover) / <alpha-value>)',
                    active: 'rgb(var(--surface-active) / <alpha-value>)',
                },
                border: {
                    DEFAULT: 'rgb(var(--border) / <alpha-value>)',
                },
                primary: {
                    DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
                    hover: 'rgb(var(--primary-hover) / <alpha-value>)',
                },
                text: {
                    primary: 'rgb(var(--text-primary) / <alpha-value>)',
                    secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
                    tertiary: 'rgb(var(--text-tertiary) / <alpha-value>)',
                },
            },
            borderRadius: {
                '2xl': '18px',
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'card': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
                'widget': '0 12px 48px 0 rgba(0, 0, 0, 0.5)',
            },
            animation: {
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'fade-in': 'fadeIn 0.2s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
