module.exports = {
  loader: false, // because we use babel plugins 😕
  loadLocaleFrom: async (locale, namespace) => import(`./translations/${locale}/${namespace}`).then((m) => m.default),
  locales: ['es', 'en', 'fr', 'pt'],
  defaultLocale: 'es',
  pages: {
    '*': ['common', 'createWorkForm', 'createPostForm', 'navbar', 'signInForm', 'singInMail', 'searchEngine', 'topics','notification'],
    '/': ['countries'],
    '/auth/emailVerify': ['common', 'emailVerify'],
    '/work/\\[id]\\': ['common', 'createWorkForm', 'editWorkForm'],
    '/work/create': ['createWorkForm', 'countries'],
    '/cycle/create': ['createCycleForm', 'countries'],
    'rgx:^/cycle/\\[id\\]/edit': ['createCycleForm', 'countries'],
    '/aboutUs': ['aboutUs'],
    '/search': ['countries'],
    '/profile': ['common','profile','countries'],
    '/manifest': ['manifest'],
    'rgx:^/mediatheque/\\[id\\]': ['mediatheque', 'countries'],
    'rgx:^/cycle/\\[id\\]': ['cycleDetail', 'countries'],
    'rgx:^/work/\\[id\\]': ['workDetail', 'countries'],
  },
};
