const fs = require('fs');

const typesContent = fs.readFileSync('./src/spec.d.ts', 'utf-8');

const getExportsContent = impl => 
`if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/${impl}.production.js');
} else {
    module.exports = require('./cjs/${impl}.development.js');
}
`;

['base', 'unicode', 'noKern'].forEach(impl => {
    ['umd', 'cjs'].forEach((libTypeAlias) => {
        ['production', 'development'].forEach(environment => {
            fs.writeFileSync(`./dist/${libTypeAlias}/${impl}.${environment}.d.ts`, typesContent);
        });
    });

    fs.writeFileSync(`./dist/${impl}.d.ts`, typesContent);
    
    fs.writeFileSync(`./dist/${impl}.js`,  getExportsContent(impl));
});
