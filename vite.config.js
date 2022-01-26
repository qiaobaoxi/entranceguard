import vue from '@vitejs/plugin-vue'
const path = require("path");
export default {
    base: './',
    plugins: [vue()],
    optimizeDeps: {
        include: ['schart.js']
    },
    server:{
        port:3000,
        proxy:{
            '/api': {
                target: "http://127.0.0.1:7001/",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
        }
    },
    resolve:{
        alias:{
            "@":path.resolve(__dirname,'src')
        }
    }
}