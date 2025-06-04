import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false, // Disable error overlay if needed
    },
  },
  optimizeDeps: {
    include: ['swiper'], // Ensures Swiper is optimized correctly
  },
});
