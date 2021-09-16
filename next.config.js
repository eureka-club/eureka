const nextTranslate = require('next-translate');
const path = require('path');

module.exports = {
    ...nextTranslate(),
    sassOptions: {
        includePaths: [path.join(__dirname, 'scss')],
    },
};
