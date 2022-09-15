import {context2d} from './constants.js';
import {normalizeTypographyOptions} from './options.js';

let measureText = (text, userOptions) => {
    let options = {};
    normalizeTypographyOptions(options, userOptions);

    context2d.font = options.font_;
    context2d.fontKerning = options.fontKerning_;

    // Canvas context treat a tab character as a space character when measuring the text
    // So we need to handle the tab size manually
    let spacesAsTab = new Array(options.tabSize_).fill(' ').join('');

    return context2d.measureText(
        text.replace(/\t/g, spacesAsTab)
    );
};

export {
    measureText,
};
