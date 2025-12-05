import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: [
      '@talismn/connect-wallets',
      '@autonomys/auto-utils',
      '@autonomys/auto-consensus',
      '@polkadot/api',
      '@polkadot/extension-dapp'
    ],
  },
});
