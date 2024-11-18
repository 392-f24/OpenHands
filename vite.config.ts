/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    open: true,
  },
  test: {
    globals: true,
    reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['dot'],
    environment: 'jsdom',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: [
            '@mui/material',
            '@mui/icons-material',
            '@mui/lab',
            '@mui/x-date-pickers',
          ],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          dateFns: ['date-fns'],
          bigCalendar: ['react-big-calendar'],
          moment: ['moment'],
        },
      },
    },
  },
});
