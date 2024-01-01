/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode:true,
  images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname: `${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net`,
      },
      {
        protocol: 'https',
        hostname: 'mozilla.design',
      },
      {
        protocol: 'https',
        hostname: 'datapopalliance.org',
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
      }
    ],
      
  },
  output: 'standalone'
}

module.exports = nextConfig
