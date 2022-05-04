import {context2d} from './constants.js';

export default function measureText(text, options = {}) {
    normalizeTypographyOptions(options);

    const {font, fontKerning, tabSize} = options;
    
    context2d.font = font;
    context2d.fontKerning = fontKerning;

    // Canvas context treat a tab character as a space character when measuring the text
    // So we need to handle the tab size manually
    const spacesAsTab = new Array(tabSize).fill(' ').join('');

    return context2d.measureText(
        text.replace(/\t/g, spacesAsTab)
    );
}
