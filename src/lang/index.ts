import { createI18n } from 'vue-i18n';
import zh_cn from './zh_cn';
import en_us from './en_us';

const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: window.navigator.language,
  messages: {
    ['zh-CN']: zh_cn,
    ['en-US']: en_us,
  },
});

export default i18n;

export const locale = i18n.global.locale;
export const t = i18n.global.t;
