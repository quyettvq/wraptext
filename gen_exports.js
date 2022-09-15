const fs = require('fs');

const typesExports = fs.readFileSync('./src/spec.d.ts', 'utf-8');

const cjsExports = impl => 
`if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/${impl}.production.js');
} else {
    module.exports = require('./cjs/${impl}.development.js');
}
`;

const mjsExports = impl => 
`import {wrapText as wrapText_dev, measureText as measureText_dev}  from './esm/${impl}.development.js';
import {wrapText as wrapText_prod, measureText as measureText_prod}  from './esm/${impl}.production.js';

let isDev = process.env.NODE_ENV !== 'production';

export let wrapText = isDev ? wrapText_dev : wrapText_prod;
export let measureText = isDev ? measureText_dev : measureText_prod;
`;

['base', 'unicode', 'noKern'].forEach(impl => {
    ['umd', 'cjs', 'esm'].forEach((libTypeAlias) => {
        ['production', 'development'].forEach(environment => {
            fs.writeFileSync(`./dist/${libTypeAlias}/${impl}.${environment}.d.ts`, typesExports);
        });
    });

    fs.writeFileSync(`./dist/${impl}.d.ts`, typesExports);
    
    fs.writeFileSync(`./dist/${impl}.js`,  cjsExports(impl));
    
    fs.writeFileSync(`./dist/${impl}.mjs`,  mjsExports(impl));
});
