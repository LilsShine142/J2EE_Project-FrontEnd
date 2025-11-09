import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});



// import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react';

// declare const process: { cwd: () => string };

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), '');

//   return {
//     plugins: [react()],
//     server: {
//       port: 3000,
//       // Proxy API & WS tới backend
//       proxy: {
//         // HTTP API
//         '/api': {
//           target: `${env.VITE_API_PROTOCOL}://${env.VITE_API_HOST}:${env.VITE_API_PORT}`,
//           changeOrigin: true,
//           secure: false,
//         },
//         // WebSocket
//         // '/ws': {
//         //   target: `${env.VITE_WS_PROTOCOL}://${env.VITE_WS_HOST}:${env.VITE_WS_PORT}`,
//         //   ws: true,
//         //   changeOrigin: true,
//         //   secure: false,
//         // },
//       },
//     },
//   };
// });