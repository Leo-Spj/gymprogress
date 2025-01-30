import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
            // Forzar HTTPS para los assets
            forcedScheme: 'https'
        }),
        react(),
    ],
    // Asegurar que los assets se sirvan con las URLs correctas
    server: {
        https: true,
        host: 'gymprogress.loca.lt'
    }
});
