import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    return defineConfig({
      build: {
        sourcemap: true,
      },
      plugins: [
        vue(),
        vuetify({ autoImport: true }),
      ],
      base: "./",
      resolve: {
        alias: {
          '@': '/src',
        },
      },
      server: {
        open: false,
        https: false,
        hot: true,
        host: false, // ************  npm run dev -- --host ************
        proxy: {
          '/api': {
              target: env.VITE_BASE_URL,
              changeOrigin: true,
              ws: true,
              rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
      }
    })
}

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     vuetify({ autoImport: true }),
//   ],
//   resolve: {
//     alias: {
//       '@': '/src',
//     },
//   },
//   server: {
//     open: false,
//     https: false,
//     hot: true,
//     host: false, // ************  npm run dev -- --host ************
//     proxy: {
//       '/api': {
//           target: import.meta.env.VITE_BASE_URL,
//           changeOrigin: true,
//           ws: true,
//           rewrite: (path) => path.replace(/^\/api/, '')
//       }
//     }
//   }
// })
