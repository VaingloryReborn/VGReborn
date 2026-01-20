import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',
      assetsInclude: ['**/*.pem', '**/*.crt', '**/*.conf'],
      server: {
        port: 3000,
        host: '0.0.0.0',
        fs: {
          strict: false,
          allow: ['..'],
          deny: ['.env', '.env.*', '*.{key}']
        }
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
