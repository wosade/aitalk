import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 重点：加上这一行
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 2. 配置 @ 符号指向 src 目录
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://159.75.169.224:1235', // 目标后端服务器
        changeOrigin: true,
        // 如果后端接口里本身就带 /api，就不需要 rewrite
        // rewrite: (path) => path.replace(/^\/api/, '') 
      }
    }
  }
})
