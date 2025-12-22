/* eslint-disable @typescript-eslint/no-require-imports */
export type Languages = 'zh-CN' | 'en-US';

export const SUPPORT_LANGUAGES: Languages[] = ['zh-CN', 'en-US'];

export const LANGUAGE_OPTIONS = {
  'zh-CN': '简体中文',
  'en-US': 'English',
};

export const LOCALE = {
  'zh-CN': {},
  'en-US': require('./locale/en-US.json'),
};
