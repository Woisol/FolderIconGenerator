import { defineConfig } from 'vite'
// @ts-expect-error ？这能报错
import path from "path"
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // tailwindcss()
  ],
  resolve: {
    alias: {
      // @ts-expect-error ？这能报错
      "@": path.resolve(__dirname, "./src"),
      // "@": "./src"
    },
  },
  server: {
    proxy: {
      // "/"
      "/refresh": {
        target: "http://localhost:6002",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/getDirs": {
        target: "http://localhost:6002",
        changeOrigin: true,
      },
      "/generate": {
        target: "http://localhost:6002",
        changeOrigin: true,
      },
      "^/(.*).ico": {
        target: "http://localhost:6002",
        changeOrigin: true,
      },
    }
  }
})
