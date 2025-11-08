import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",  // allows access from your LAN (mobile)
    port: 5173        // or your chosen port
  },
  css: {
    postcss: './postcss.config.js',
  },
})
