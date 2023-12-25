/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode:true,
  images:{
      domains:[
          `${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net`,
          'mozilla.design',
          'datapopalliance.org',
          'static.wixstatic.com',
      ],
      
  },
  output: 'standalone'
}

module.exports = nextConfig
