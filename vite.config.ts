/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), checker({ typescript: true })],
  server: {
    open: true,
  },
  test: {
    globals: true,
    reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['dot'],
    environment: 'jsdom',
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          datePicker: ['@mui/x-date-pickers'],
          icons: ['@mui/icons-material'],
          firebaseApp: ['firebase/app'],
          firebaseAuth: ['firebase/auth'],
          firebaseFirestore: ['firebase/firestore'],
        },
      },
    },
  },
});
