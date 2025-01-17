
module.exports = {
  // loader: false, // because we use babel plugins 😕
  // loadLocaleFrom: async (locale, namespace) => import(`./translations/${locale}/${namespace}`).then((m) => m.default),
  locales: ['es', 'en', 'fr', 'pt'],
  defaultLocale: 'pt',
  pages: {
    '*': ['common', 'meta','stripe', 'featuredWorks', 'createWorkForm', 'createPostForm', 'navbar', 'signInForm', 'signUpForm', 'PasswordRecovery', 'singInMail', 'searchEngine', 'topics', 'notification','cycleDetail','onCommentCreated','hyvortalk'],
    '/': ['countries','feed'],
    '/auth/emailVerify': ['common', 'emailVerify'],
    '/post/create': ['countries'],
    '/work/\\[id]\\': ['common', 'createWorkForm', 'editWorkForm'],
    '/work/create': ['createWorkForm', 'countries'],
    '/cycle/create': ['createCycleForm', 'countries'],
    'rgx:^/cycle/\\[id\\]/edit': ['createCycleForm', 'countries'],
    '/about': ['about'],
    '/aboutUs': ['aboutUs'],
    '/about': ['about'],
    '/search': ['countries'],
    '/profile': ['common', 'profile', 'countries'],
    '/manifest': ['manifest'],
    '/policy': ['termsAndPolicy'],
    '/participar/spinardi': ['spinardi'],
    'rgx:^/payment-options/\\[cycleId\\]':['payment-options'],
    '/back-office': ['backOffice'],
    'rgx:^/mediatheque/\\[slug\\]': ['mediatheque', 'countries'],
    'rgx:^/user/\\[slug\\]/my-read-or-watched': ['mediatheque','countries','countries-abbr'],
    'rgx:^/cycle/\\[id\\]': ['cycleDetail', 'countries'],
    'rgx:^/work/\\[id\\]': ['common','workDetail', 'countries', 'cycleDetail'],
    '/participar/spinardi': ['spinardi'],
    '/payment_options':['spinardi']
  },
};
