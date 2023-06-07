import { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import WindiCSS from 'vite-plugin-windicss';
import PurgeIcons from 'vite-plugin-purge-icons';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

export default (): UserConfig => {
  const root = process.cwd();

  return {
    base: '.',
    root,
    plugins: [
      vue(),
      WindiCSS(),
      PurgeIcons(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: true,
      }),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: 'less',
          }),
        ],
      }),
    ],
    resolve: {
      alias: [
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    css: {
      preprocessorOptions: {
        less: {
          lessOptions: {
            modifyVars: {
              'primary-color': '#1e80ff', //  Primary color
              'success-color': '#55D187', //  Success color
              'error-color': '#ED6F6F', //  False color
              'warning-color': '#EFBD47', //   Warning color
              'font-size-base': '14px', //  Main font size
              'border-radius-base': '2px', //  Component/float fillet
              'app-content-background': '#fafafa', //   Link color
            },
          },
          javascriptEnabled: true,
        },
      },
    },
    esbuild: {
      pure: process.env.NODE_ENV != 'development' ? ['console.log', 'debugger'] : [],
    },
    build: {
      sourcemap: true,
      outDir: 'dist',
    },
  };
};
