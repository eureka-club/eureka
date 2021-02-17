module.exports = {
  loader: false, // because we use babel plugins 😕
  loadLocaleFrom: async (locale, namespace) => import(`./translations/${locale}/${namespace}`).then((m) => m.default),
  locales: ['en', 'es', 'fr', 'pt'],
  defaultLocale: 'en',
  pages: {
    '*': ['common', 'createWorkForm', 'createPostForm', 'navbar', 'signInForm'],
    '/cycle/create': ['createCycleForm'],
    '/cycle/[id]': ['cycleDetail'],
    '/work/[id]': ['workDetail'],
  },
};
