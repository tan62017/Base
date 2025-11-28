import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import UnoCSS from 'unocss/vite'
import ViteAutoImport from 'unplugin-auto-import/vite';
// import viteCompression from 'vite-plugin-compression';
// https://vitejs.dev/config/
export default defineConfig((config) => {
  // config:{
  //   mode: 'production',
  //   command: 'build',
  //   isSsrBuild: false,
  //   isPreview: false
  // }
  const isProd = config.mode === 'production' || config.mode === 'pro' || config.mode === 'test';
  return {
    base: isProd ? '/dist' : '',
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      UnoCSS(),
      ViteAutoImport({
        imports: ['vue', 'vue-router'],
        dts: 'src/types/auto-imports.d.ts',
      })
      // viteCompression({
      //   filter: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i, // 需要压缩的文件
      //   // filter: /。(js|mjs|json|css|html)$/,
      //   threshold: 1024, // 文件容量大于这个值进行压缩
      //   algorithm: 'gzip', // 压缩方式
      //   ext: 'gz', // 后缀名
      //   deleteOriginFile: true, // 压缩后是否删除压缩源文件
      // }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 3000, // 开发服务器端口
      open: true, // 启动时自动打开浏览器
    },

    build: {
      target: 'es2017',
      outDir: 'dist', // 指定构建输出目录
      sourcemap: false, // 生成 sourcemap
      assetsDir: 'assets', // 资源目录
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (id.includes('vue')) {
                return 'vue'
              }
              if (id.includes('lodash')) {
                return 'lodash'
              }
              return 'vendor'
            }
          }
        }
      }
    },
  };
});
