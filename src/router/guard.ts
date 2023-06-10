import { Router } from 'vue-router';
import nProgress from 'nprogress';
import { locale } from '/@/lang';

export function createProgressGuard(router: Router) {
  router.beforeEach(async (to) => {
    nProgress.start();

    if ('lang' in to.query) {
      const lang = to.query.lang as string;
      if (lang.startsWith('zh')) {
        locale.value = 'zh-CN';
      } else {
        locale.value = 'en-US';
      }
    }

    return true;
  });

  router.afterEach(async () => {
    nProgress.done();
    return true;
  });
}
