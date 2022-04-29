if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/cjs/unicode.production.js');
} else {
    module.exports = require('./dist/cjs/unicode.development.js');
}
