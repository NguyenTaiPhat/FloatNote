import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@features': path.resolve(__dirname, './src/features'),
            '@shared': path.resolve(__dirname, './src/shared'),
            '@lib': path.resolve(__dirname, './src/lib'),
            '@db': path.resolve(__dirname, './src/db'),
        },
    },
    base: './',
    server: {
        port: 5173,
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            external: [
                'electron',
                'better-sqlite3',
                'fs',
                'path',
                'os',
                'util',
            ],
        },
    },
});
