import {defineConfig} from 'vite';
import {resolve} from 'path';
import generateBlockEntries from './vite.helpers';

const isProd = process.env.NODE_ENV === 'production';

// @ts-ignore:next line
export default defineConfig(() => {
    const blocksEntries = generateBlockEntries();
    const pathSrc = resolve(__dirname, "./src");

    return ({
        base: './',
        css: {
            devSourcemap: true,
            preprocessorOptions: {
                scss: {
                    additionalData: `
                     @import '/src/styles/abstract/abstract.scss';
                    `,
                    api: 'modern',
                },
            },
        },
        resolve: {
            alias: {
                Blocks: resolve(__dirname, 'src/blocks'),
                Styles: resolve(__dirname, 'src/styles'),
            },
        },
        build: {
            sourcemap: true,
            minify: true,
            cssMinify: true,
            commonjsOptions: {
                include: ['node_modules/**'],
            },
            emptyOutDir: true,
            rollupOptions: {
                cache: false,
                preserveEntrySignatures: 'strict',
                input: {
                    main: './src/main.js',
                    ue: './src/scripts/editor-support.js',
                    styles: './src/styles/styles.scss',
                    ...blocksEntries,
                },
                output: {
                    dir: 'dist',
                    assetFileNames: (chunkInfo) => {
                        // EDS will hide files starting with an underscore
                        const name = chunkInfo.name;

                        if (typeof name === 'string' && name.charAt(0) === "_") {
                            return 'common[name]/common[name][extname]';
                        }

                        return '[name]/[name][extname]';
                    },
                    chunkFileNames: 'chunks/[name]-[hash].js',
                    entryFileNames: '[name]/[name].js',
                },
                plugins: [isProd],
            },
        },
    });
});
