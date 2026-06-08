import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// VitePWA is skipped under Vitest so the test run stays a plain node/jsdom env.
const plugins = [react()];
if (!process.env.VITEST) {
  plugins.push(
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'NYSED Test Prep',
        short_name: 'NYSED Prep',
        description: 'Grades 4 & 6 Math + ELA practice in a Nextera-style environment.',
        theme_color: '#1d4ed8',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
      },
      workbox: {
        // Large vendor bundle (Excalidraw etc.) — allow precaching it.
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
    }),
  );
}

export default defineConfig({
  plugins,
  test: {
    setupFiles: ['./vitest.setup.ts'],
    // Don't collect the nested merged worktree copy when run from the main checkout.
    exclude: ['**/node_modules/**', '**/dist/**', '**/.git/**', '**/.claude/**'],
  },
});
