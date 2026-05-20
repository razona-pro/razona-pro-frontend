// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    port: 3000,
    allowedHosts: ['plasma-relapsing-antivirus.ngrok-free.dev']
  },
  vite: {
    plugins: [tailwindcss()]
  }
});