// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react() ,  tailwindcss()],

//   resolve: {
//     alias: {
//       "@mui/icons-material": "@mui/icons-material/esm",
//     },
//   },
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 👈 Fixes asset paths for Vercel
});
