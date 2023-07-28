const nextTranslate = require('next-translate-plugin') 
const path = require('path');

// const isProduction = process.env.NODE_ENV == 'production'

module.exports = nextTranslate({
    // experimental: { appDir: true },

    sassOptions: {
        includePaths: [path.join(__dirname, 'scss')],
    },
    images:{
        domains:[
            `${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net`,
            'mozilla.design',
            'datapopalliance.org',
            'static.wixstatic.com',
        ],
        
    },
    
    output: 'standalone'
  })
