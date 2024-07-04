import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // any other plugins
  ],
  build: {
    rollupOptions: {
      output:
        {
          format: 'es',
          strict: false,
          entryFileNames: "main.js",
          dir: 'dist/'
        }
    }
  },
});
