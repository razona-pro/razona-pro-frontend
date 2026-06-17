import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),

  integrations: [icon()],

  server: {
    port: 3000,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});