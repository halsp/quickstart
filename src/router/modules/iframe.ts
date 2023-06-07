import { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/iframe',
    name: 'Home',
    component: () => import('/@/views/iframe/index.vue'),
  },
] as RouteRecordRaw[];
