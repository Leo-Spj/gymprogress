import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
            forcedScheme: 'https'
        }),
        react(),
    ],
    server: {
        https: true,
        host: 'gymprogress.loca.lt'
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    layout: ['./resources/js/Layouts/AuthenticatedLayout.jsx']
                }
            }
        },
        // Optimizar la carga de chunks
        chunkSizeWarningLimit: 1000,
        modulePreload: {
            polyfill: true
        }
    }
});
