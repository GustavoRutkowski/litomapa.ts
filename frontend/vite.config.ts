import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    const API_HOST = env.API_HOST ?? 'localhost';
    const API_PORT = Number(env.API_PORT) || 4444;
    const API_URL = `http://${API_HOST}:${API_PORT}`;

    return {
        root: resolve(__dirname),
        base: '/',
        plugins: [react()],

        server: {
            host: env.SITE_HOST || 'localhost',
            port: Number(env.SITE_PORT) || 3333,
            strictPort: true,
            open: true,
            cors: true,

            proxy: {
                '/api': {
                    target: API_URL,
                    secure: false,
                    rewrite: path => path.replace(/^\/api/, '')
                }
            }
        },

        resolve: {
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
            alias: { '@': resolve(__dirname, 'src') }
        },

        build: {
            outDir: resolve(__dirname, 'dist'),
            emptyOutDir: true,
            minify: 'esbuild', // esbuild | terser | false
            target: 'es2022',
            sourcemap: true
        },

        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/styles/setup/imports" as *;`
                }
            }
        }
    };
});
