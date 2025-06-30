import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // This tells Vite to always try to start on port 5173
    strictPort: true, // If 5173 is busy, Vite will throw an error instead of picking a new port.
                       // This helps prevent unexpected CORS issues due to port changes.
    hmr: {
      overlay: false, // Disables the error overlay in the browser (optional)
    },
  },
  optimizeDeps: {
    include: ['swiper'], // Ensures Swiper library is pre-bundled for faster development starts
  },
});
