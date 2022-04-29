import * as dev_base from '../src/index.base.js';
import * as dev_unicode from '../src/index.unicode.js';
import * as dev_noKern from '../src/index.noKern.js';
import '../dist/umd/base.production.js';
import '../dist/umd/unicode.production.js';
import '../dist/umd/noKern.production.js';

const libs = {
    dev: {base: dev_base, unicode: dev_unicode, noKern: dev_noKern},
    dist: {base: WrapText_base, unicode: WrapText_unicode, noKern: WrapText_noKern},
};

const params = new URLSearchParams(location.search);

let src = params.get('src');
if (!libs.hasOwnProperty(src)) {
    src = 'dev';
}

let impl = params.get('impl');
if (!libs[src].hasOwnProperty(impl)) {
    impl = 'unicode';
}

export const {wrapText, measureText} = libs[src][impl];

console.log('Source: ' + src);
console.log('Implementation: ' + impl);

console.time('WarmUp');
wrapText('');
console.timeEnd('WarmUp');
