import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use VITE_BASE (set to '/<repo>/' on GitHub Pages) or default '/'
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  plugins: [react()],
  base
})
