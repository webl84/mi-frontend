import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';

export default defineConfig({ 
  base: "/", // 👈 importante para evitar errores en producción con rutas
  plugins: [react(),
  tailwindcss(),
  svgr()], 
  optimizeDeps: {
    include: ['jwt-decode']
  }
});



