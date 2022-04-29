const path = require('path');

const configs = [];

['base', 'unicode', 'noKern'].forEach(impl => {
    [[`WrapText_${impl}`, 'umd2', 'umd'], [undefined, 'commonjs2', 'cjs']].forEach(([libName, libType, libTypeAlias]) => {
        ['production', 'development'].forEach(environment => {
            configs.push({
                mode: environment,
                entry: `./src/index.${impl}.js`,
                output: {
                    path: path.resolve(__dirname, 'dist', libTypeAlias),
                    filename: `${impl}.${environment}.js`,
                    library: {
                        name: libName,
                        type: libType,
                    },
                },
                target: 'web',
                devtool: false,
            });
        });
    });
});

module.exports = configs;
