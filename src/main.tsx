import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { applyTheme, type Theme } from '@lib/theme';
import { I18nProvider } from '@lib/i18n';

// Apply saved theme on app startup
const savedTheme = (localStorage.getItem('theme') as Theme) || 'dark';
const savedColor = localStorage.getItem('primaryColor');

applyTheme(savedTheme);

// Apply primary color if exists
if (savedColor) {
    const hex = savedColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    document.documentElement.style.setProperty('--primary', `${r} ${g} ${b}`);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <I18nProvider>
            <App />
        </I18nProvider>
    </React.StrictMode>,
);
