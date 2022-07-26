const nextTranslate = require('next-translate');
const path = require('path');

const domain = process.env.NODE_ENV !== 'production'
    ? process.env.CDN_ENDPOINT_NAME_STAGING
    : process.env.CDN_ENDPOINT_NAME_PRODUCTION;

<<<<<<< HEAD
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
  
module.exports = withBundleAnalyzer({
  ...nextTranslate(),
  sassOptions: {
      includePaths: [path.join(__dirname, 'scss')],
  },
  env: {
      NEXT_PUBLIC_SITE_NAME:"Eureka",
      NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL:"/assets"
  },
  images:{
      domains:[`${domain}.azureedge.net`],
  },
  
})

=======
module.exports = {
  experimental: {
    outputStandalone: true,
  },
  output: 'standalone',
    ...nextTranslate(),
    sassOptions: {
        includePaths: [path.join(__dirname, 'scss')],
    },
    env: {
        NEXT_PUBLIC_SITE_NAME:"Eureka",
        NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL:"/assets"
    },
    images:{
        domains:[`${domain}.azureedge.net`],
    },
    async headers() {
        return [
          {
            source: '/resetPass',
            headers: [
              {
                key: 'gmail',
                value: 'my custom header value',
              },
            ],
          },
        ]
    },
};
>>>>>>> develop
