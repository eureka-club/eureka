
const all = ['common', 'meta','stripe', 'featuredWorks', 'createWorkForm', 'createPostForm', 'navbar', 'signInForm', 'signUpForm', 'PasswordRecovery', 'singInMail', 'searchEngine', 'topics', 'notification','cycleDetail','onCommentCreated','hyvortalk'];
const header = ['common','navbar','topics','notification','signInForm'];
module.exports = {
  // loader: false, // because we use babel plugins 😕
  // loadLocaleFrom: async (locale, namespace) => import(`./translations/${locale}/${namespace}`).then((m) => m.default),
  locales: ['es', 'en', 'fr', 'pt'],
  defaultLocale: 'pt',
  pages: {
    // '*': ['common', 'meta','stripe', 'featuredWorks', 'createWorkForm', 'createPostForm', 'navbar', 'signInForm', 'signUpForm', 'PasswordRecovery', 'singInMail', 'searchEngine', 'topics', 'notification','cycleDetail','onCommentCreated','hyvortalk'],
    '*':[...header],
    '/': [...all,'countries','feed'],
    '/login':['signInForm'],
    '/auth/emailVerify': ['navbar','emailVerify'],
    '/post/create': [...header,'createPostForm','countries'],
    'rgx:^/post/\\[id\\]/edit': [...header,'createPostForm','createWorkForm','countries'],
    '/work/create': [...header,'createWorkForm', 'countries'],
    '/cycle/create': [...header,'createCycleForm','createWorkForm', 'countries'],
    'rgx:^/cycle/\\[id\\]/edit': [...header,'createCycleForm','createWorkForm', 'countries'],
    '/about': [...header,'about'],
    '/aboutUs': [...header,'aboutUs'],
    '/search': [...header,'countries'],
    '/profile': [...header, 'profile','createWorkForm', 'countries'],
    '/manifest': [...header,'manifest'],
    '/policy': [...header,'termsAndPolicy'],
    'rgx:^/register':[...header,'signUpForm'],
    'rgx:^/payment-options/\\[cycleId\\]':['common','navbar','payment-options'],
    'rgx:^/payment_cancel/*':[...header,'stripe'],
    'rgx:^/payment_success_new_user/*':[...header,'stripe'],
    
    '/back-office': [...header,'backOffice'],
    'rgx:^/mediatheque/\\[slug\\]': [...header,'mediatheque', 'countries'],
    'rgx:^/user/\\[slug\\]/my-read-or-watched': [...header,'mediatheque','countries','countries-abbr'],
    'rgx:^/cycle/\\[id\\]': [...header,'cycleDetail', 'countries','hyvortalk','createPostForm'],
    'rgx:^/work/\\[id\\]': [...header,'createWorkForm','countries','workDetail','hyvortalk','createPostForm'],
    'rgx:my-cycles': [...header],
    'rgx:my-posts': [...header],
    // '/participar/spinardi': ['spinardi'],
    '/readingClubs': [...header,'readingClubs','meta'],
  },
};
