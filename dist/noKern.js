if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/noKern.production.js');
} else {
    module.exports = require('./cjs/noKern.development.js');
}
