import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  // GitHub Pages serves this repository at /HillLink/, while local dev runs at /.
  base: mode === 'production' ? '/HillLink/' : '/',
  plugins: [react()],
  server: { port: 5173 },
}));
