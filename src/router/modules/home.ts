import { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/',
    component: () => import('/@/views/home/index.vue'),
    meta: {
      title: '主页',
    },
  },
] as RouteRecordRaw[];
