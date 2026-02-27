import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    const API_HOST = Number(env.API_HOST);
    const API_PORT = Number(env.API_PORT);
    const API_URL = `http://${API_HOST}:${API_PORT}`;

    return {
        root: path.resolve(__dirname),
        base: '/',
        plugins: [ react() ],

        server: {
            host: env.SITE_HOST || 'localhost',
            port: Number(env.SITE_PORT) || 3333,
            strictPort: true,
            open: true,
            cors: true,

            proxy: {
                '/api': {
                    target: API_URL,
                    secure: false
                }
            }
        },

        resolve: {
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
            alias: { '@': path.resolve(__dirname, 'src') }
        },
        
        build: {
            outDir: path.resolve(__dirname, 'dist'),
            emptyOutDir: true,
            minify: 'esbuild', // esbuild | terser | false
            target: 'es2022',
            sourcemap: true
        }
    };
});
