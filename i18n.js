module.exports = {
  loader: false, // because we use babel plugins 😕
  loadLocaleFrom: async (locale, namespace) => import(`./translations/${locale}/${namespace}`).then((m) => m.default),
  locales: ['es', 'en', 'fr', 'pt'],
  defaultLocale: 'es',
  pages: {
    '*': ['common', 'createWorkForm', 'createPostForm', 'navbar', 'signInForm', 'singInMail'],
    '/': ['countries'],
    '/auth/emailVerify': ['common', 'emailVerify'],
    '/work/\\[id]\\': ['common', 'createWorkForm', 'editWorkForm'],
    '/cycle/create': ['createCycleForm'],
    'rgx:^/cycle/\\[id\\]/edit': ['createCycleForm'],
    '/aboutUs': ['aboutUs'],
    'rgx:^/cycle/\\[id\\]': ['cycleDetail'],
    'rgx:^/work/\\[id\\]': ['workDetail', 'countries'],
  },
};
