const nextTranslate = require('next-translate');
const path = require('path');

const isProduction = process.env.NODE_ENV == 'production'

module.exports = nextTranslate({
    sassOptions: {
        includePaths: [path.join(__dirname, 'scss')],
    },
    images:{
        domains:[`${process.env.CDN_ENDPOINT_NAME}.azureedge.net`],
    },
    // async redirects() {
    //     const destination = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/:path*`;
    //     const res = [
    //         {
    //             source: '/undefined/:path*',
    //             destination,
    //             permanent: false,
    //         },
    //         // {
    //         //     source: '/en/undefined/:path*',
    //         //     destination,
    //         //     permanent: false,
    //         // },
    //         // {
    //         //     source: '/es/undefined/:path*',
    //         //     destination,
    //         //     permanent: false,
    //         // },
    //         // {
    //         //     source: '/fr/undefined/:path*',
    //         //     destination,
    //         //     permanent: false,
    //         // },
    //         // {
    //         //     source: '/pt/undefined/:path*',
    //         //     destination,
    //         //     permanent: false,
    //         // },
            
            
    //     ]
    //     console.log(res)
    //     return res;
    //   },
    output: 'standalone'
  })
