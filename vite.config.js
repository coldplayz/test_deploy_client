import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': `http://${process.env.BACKEND_HOST}`,
    },
    cors: true,
    host: '0.0.0.0',
    port: process.env.NODE_ENV === 'production' ? process.env.PORT : 3000,
  },
});
