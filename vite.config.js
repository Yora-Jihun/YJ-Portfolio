import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Compiles src/main.{css,js} to assets/css/app.css and assets/js/app.js.
// The output is a plain classic script, so the HTML pages also work when opened from disk.
export default defineConfig({
    plugins: [tailwindcss()],
    publicDir: false,
    build: {
        outDir: 'assets',
        emptyOutDir: false,
        cssCodeSplit: false,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            input: 'src/main.js',
            output: {
                format: 'iife',
                entryFileNames: 'js/app.js',
                assetFileNames: (asset) =>
                    asset.names?.some((name) => name.endsWith('.css')) ? 'css/app.css' : 'other/[name][extname]',
            },
        },
    },
});
