import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const port = process.env.NODE_ENV === 'production' ? process.env.BACKEND_PORT : '5000';
const backend = process.env.NODE_ENV === 'production' ? `${process.env.BACKEND_HOST}:${port}` : 'localhost:5000';
const host = process.env.NODE_ENV === 'production' ? '::' : 'localhost';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': `http://${backend}`,
    },
    cors: true,
    host,
    port: process.env.NODE_ENV === 'production' ? process.env.PORT : '3000',
  },
});
