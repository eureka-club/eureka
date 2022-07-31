const nextTranslate = require('next-translate');
const path = require('path');

const domain = process.env.NODE_ENV !== 'production'
    ? process.env.CDN_ENDPOINT_NAME_STAGING
    : process.env.CDN_ENDPOINT_NAME_PRODUCTION;

module.exports = nextTranslate({
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
    async redirects() {
        const destination = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/:path*`;
        return [
            {
                source: '/undefined/:path*',
                destination,
                permanent: false,
            },
        ]
      },
    output: 'standalone'
  })
