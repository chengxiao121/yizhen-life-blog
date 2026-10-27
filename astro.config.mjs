import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://ironveiln.xyz',
  output: 'static',
  integrations: [react()],
});
