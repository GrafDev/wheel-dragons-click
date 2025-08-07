import { defineConfig, loadEnv } from 'vite'
import { VERSION } from './version.js'

export default defineConfig(({ mode }) => {
    const publicEnv = loadEnv('public', process.cwd(), '')
    const privateEnv = loadEnv('private', process.cwd(), '')
    
    let gameMode = 'button'
    let country = 'standard'
    
    if (mode && mode !== 'development') {
        const parts = mode.split('-')
        if (parts.length === 1) {
            gameMode = parts[0]
        } else if (parts.length === 2) {
            gameMode = parts[0]
            country = parts[1]
        }
    }
    
    const currentSettings = {
        VITE_GAME_MODE: gameMode,
        VITE_COUNTRY: country
    }
    
    const mergedEnv = { ...publicEnv, ...privateEnv, ...currentSettings }
    
    return {
    base: './',
    server: {
        open: true,
        port: 5173
    },
    resolve: {
        alias: {
            '@': '/src',
            '@assets': '/src/assets',
            '@images': '/src/assets/images',
            '@js': '/src/assets/js',
            '@css': '/src/assets/css'
        }
    },
    build: {
        outDir: mode === 'auto' ? 'dist/wheel-dragon-auto' : 
                mode === 'button' ? 'dist/wheel-dragon-button' : 
                mode === 'auto-canada' ? 'dist/wheel-dragon-auto-canada' : 
                mode === 'button-canada' ? 'dist/wheel-dragon-button-canada' : 'dist',
        assetsDir: 'assets',
        cssCodeSplit: true,
        cssMinify: true,
        rollupOptions: {
            input: {
                main: '/index.html'
            },
            output: {
                assetFileNames: (assetInfo) => {
                    let extType = assetInfo.name.split('.')[1];
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        return `assets/images/[name]-${VERSION}-[hash][extname]`;
                    }
                    return `assets/${extType}/[name]-${VERSION}-[hash][extname]`;
                },
                chunkFileNames: `assets/js/[name]-${VERSION}-[hash].js`,
                entryFileNames: `assets/js/[name]-${VERSION}-[hash].js`
            }
        }
    },
    css: {
        devSourcemap: true
    },
    define: {
        __APP_VERSION__: JSON.stringify(VERSION),
        ...Object.keys(mergedEnv).reduce((prev, key) => {
            if (key.startsWith('VITE_')) {
                prev[`import.meta.env.${key}`] = JSON.stringify(mergedEnv[key])
            }
            return prev
        }, {})
    }
}})
