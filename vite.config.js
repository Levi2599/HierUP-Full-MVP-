// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Dev-only: point the local frontend at the live US backend so all
        // screens work locally. Production uses vercel.json rewrites, not this.
        target: 'https://hireup-ai.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});