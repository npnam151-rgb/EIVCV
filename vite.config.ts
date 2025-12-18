
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vite không mặc định đưa process.env vào browser, cần define thủ công
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  server: {
    port: 3000
  }
});
