module.exports = {
  loader: false, // because we use babel plugins 😕
  loadLocaleFrom: async (locale, namespace) => import(`./translations/${locale}/${namespace}`).then((m) => m.default),
  locales: ['es', 'en', 'fr', 'pt'],
  defaultLocale: 'es',
  pages: {
    '*': ['common', 'createWorkForm', 'createPostForm', 'navbar', 'signInForm', 'singInMail', 'searchEngine', 'topics'],
    '/': ['countries'],
    '/auth/emailVerify': ['common', 'emailVerify'],
    '/work/\\[id]\\': ['common', 'createWorkForm', 'editWorkForm'],
    '/cycle/create': ['createCycleForm', 'countries'],
    'rgx:^/cycle/\\[id\\]/edit': ['createCycleForm', 'countries'],
    '/aboutUs': ['aboutUs'],
    '/search': ['countries'],
    'rgx:^/mediatheque/\\[id\\]': ['mediatheque', 'countries'],
    'rgx:^/cycle/\\[id\\]': ['cycleDetail', 'countries'],
    'rgx:^/work/\\[id\\]': ['workDetail', 'countries'],
  },
};
