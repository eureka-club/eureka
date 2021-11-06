const nextTranslate = require('next-translate');
const path = require('path');

module.exports = {
    ...nextTranslate(),
    sassOptions: {
        includePaths: [path.join(__dirname, 'scss')],
    },
    env: {
        NEXT_PUBLIC_SITE_NAME:"Eureka",
        NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL:"/assets"
    }
};
