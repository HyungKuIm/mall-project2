import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api 요청을 백엔드(Spring 등)로 전달 → CORS 문제 없이 이미지/데이터 사용
      '/api': 'http://localhost:8080',
    },
  },
})
