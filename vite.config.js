import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    react(),
    eslintPlugin({
      cache: false,
      include: ['./src/**/*.js', './src/**/*.jsx'],
      exclude: [],
    }),
  ],
  resolve: {
    alias: {
      '@': '/src', // 필요에 따라 프로젝트 내 경로로 변경
    },
  },
  optimizeDeps: {
    include: ['emoji-picker-react'],
    exclude: ["fsevents"],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  assetsInclude: ['**/*.ttf'],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  build: {
    sourcemap: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        globals: {
          global: 'window',
        },
      },
    },
    experimental: {
      renderBuiltUrl(filename, { hostType }) {
        if (hostType === 'js') {
          return { runtime: `globalThis.__publicPath(${JSON.stringify(filename)})` }
        } else {
          return { relative: true }
        }
      }
    },
  },
});
