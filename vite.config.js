import { defineConfig } from 'vite'

export default defineConfig({
  base: '/mall_map_proto/',
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
