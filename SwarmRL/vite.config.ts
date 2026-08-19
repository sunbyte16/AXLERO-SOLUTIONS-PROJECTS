import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const hmrDisabled = process.env.DISABLE_HMR === 'true';
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: hmrDisabled
        ? false
        : {
            port: Number(process.env.HMR_PORT) || 24679,
          },
      watch: hmrDisabled ? null : {},
      fs: {
        cachedChecks: false,
      },
    },
  };
});
