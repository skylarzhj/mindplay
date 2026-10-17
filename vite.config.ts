import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
 plugins:[react(),tailwindcss()],
 build:{rollupOptions:{output:{manualChunks(id){
  if(id.includes('node_modules')){
   if(/recharts|d3-|victory-vendor|react-smooth|decimal.js/.test(id))return 'charts';
   if(/framer-motion|motion-dom|motion-utils/.test(id))return 'motion';
   return 'vendor';
  }
 }}}}
});
