const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const withSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'hidden-source-map',
});

const {
  GIT_REV,
  IS_LOCAL,
  NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
  SENTRY_AUTH_TOKEN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  VERCEL_GITHUB_COMMIT_SHA,
  VERCEL_GITLAB_COMMIT_SHA,
} = process.env;
process.env.SENTRY_DSN = SENTRY_DSN;

const COMMIT_SHA = GIT_REV || VERCEL_GITHUB_COMMIT_SHA || VERCEL_GITLAB_COMMIT_SHA;
process.env.NEXT_PUBLIC_COMMIT_SHA = COMMIT_SHA;

const basePath = '';

module.exports = withSourceMaps({
  basePath,
  reactStrictMode: true,
  serverRuntimeConfig: {
    rootDir: __dirname,
  },
  webpack(config, { dev, isServer }) {
    // replace @sentry/node imports with @sentry/browser when building the browser's bundle
    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser';
    }

    // upload the source maps during build step
    if (!dev && !IS_LOCAL && SENTRY_DSN && SENTRY_ORG && SENTRY_PROJECT && SENTRY_AUTH_TOKEN && COMMIT_SHA) {
      config.plugins.push(
        new SentryWebpackPlugin({
          include: '.next',
          ignore: ['node_modules'],
          stripPrefix: ['webpack://_N_E/'],
          urlPrefix: `~${basePath}/_next`,
          release: COMMIT_SHA,
        }),
      );
    }

    return config;
  },
});
