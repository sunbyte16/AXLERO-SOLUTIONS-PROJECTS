import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

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
            clientPort: Number(process.env.PORT) || 3002,
            port: Number(process.env.PORT) || 3002,
          },
      watch: hmrDisabled ? null : {},
      fs: {
        cachedChecks: false,
      },
    },
  };
});
