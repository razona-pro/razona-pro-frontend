import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export default defineConfig({
  integrations: [icon()],
  server: {
    port: 3000,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});