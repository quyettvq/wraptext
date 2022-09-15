const path = require('path');
const {terser} = require('rollup-plugin-terser');
const {getBabelOutputPlugin} = require('@rollup/plugin-babel');

const configs = [];

['base', 'unicode', 'noKern'].forEach(impl => {
    [[`WrapText_${impl}`, 'umd'], [undefined, 'cjs'], [undefined, 'esm']].forEach(([libName, libType]) => {
        ['production', 'development'].forEach(env => {
            configs.push({
                input: `./src/index.${impl}.js`,
                output: {
                    file: path.resolve(__dirname, 'dist', libType, `${impl}.${env}.js`),
                    format: libType,
                    name: libName,
                    plugins: [
                        getBabelOutputPlugin({
                            presets: ['@babel/preset-env'],
                            allowAllFormats: true,
                        }),
                        env === 'production' ? terser({
                            compress: {
                                module: true,
                                booleans_as_integers: false,
                                keep_infinity: true,
                                keep_fargs: false,
                                inline: true,
                            },
                            mangle: {
                                properties: {
                                    regex: /^[^_].*_$/,
                                },
                            },
                        }) : null,
                    ]
                },
            });
        });
    });
});

module.exports = configs;
