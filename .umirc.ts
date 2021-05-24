import { defineConfig } from 'umi';

export default defineConfig({
  locale: { antd: true },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/editor/index' }],
  fastRefresh: {},
});
