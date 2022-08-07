const nextTranslate = require('next-translate');
const path = require('path');

const isProduction = process.env.NODE_ENV == 'production'
const domain = !isProduction
    ? process.env.CDN_ENDPOINT_NAME_STAGING
    : process.env.CDN_ENDPOINT_NAME_PRODUCTION;

const NEXT_PUBLIC_AZURE_CDN_ENDPOINT = isProduction 
 ? process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT
 : NEXT_PUBLIC_AZURE_CDN_ENDPOINT_STAGING

module.exports = nextTranslate({
    sassOptions: {
        includePaths: [path.join(__dirname, 'scss')],
    },
    env: {
        NEXT_PUBLIC_SITE_NAME:"Eureka",
        NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL:"/assets",
        NEXT_PUBLIC_AZURE_CDN_ENDPOINT,
        NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME: process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME,
        NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM:process.env.NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM
    },
    images:{
        domains:[`${domain}.azureedge.net`],
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
