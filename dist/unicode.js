if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/unicode.production.js');
} else {
    module.exports = require('./cjs/unicode.development.js');
}
