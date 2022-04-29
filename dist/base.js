if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/base.production.js');
} else {
    module.exports = require('./cjs/base.development.js');
}
