import {defineConfig} from 'vite';
import {resolve} from 'path';

// dirs
const dirFE = resolve(__dirname, 'assets', 'js');
const dirBE = resolve(__dirname, 'core', 'assets', 'js');
const dirGlobal = resolve(__dirname, 'assets', 'global');

// entry points
const entryPoints = {
    'main-fe': resolve(dirFE, 'index.js'),
    'main-be': resolve(dirBE, 'index.js'),
};

// count for getting the css output name
let count = 0;

export default defineConfig({
    publicDir: './shared',
    root: './',
    build: {
        outDir: './public/themes',
        emptyOutDir: true,

        // manifest: true,
        cssCodeSplit: true,

        /* https://stackoverflow.com/a/71190586 */
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    // default css import setting
                    if(assetInfo.name === 'index.css'){
                        const name = Object.keys(entryPoints)[count++];
                        return name + '.css';
                    }
                    return assetInfo.name;
                },
                chunkFileNames: `[name].js`,
                entryFileNames: `[name].js`,
            },
            input: {
                'main-fe': resolve(dirFE, 'index.js'),
                'main-be': resolve(dirBE, 'index.js'),
            },
        }
    },

    // resolve alias
    resolve: {
        alias: [
            {find: '@fe', replacement: dirFE},
            {find: '@be', replacement: dirBE},
            {find: '@global', replacement: dirGlobal},
        ],
    },
});
