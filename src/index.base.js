import wrapTextImpl from './wrapTextImpl.js';
import {charLoaderFn, lineBreakOpportunityTestFn} from './lineBreaking.base.js';
import {tw, lineFittingFn, etcLineFittingFn, setTabSize} from './lineFitting.base.js';
import {context2d, DefaultFont, DefaultFontKerning, DefaultTabSize} from './constants.js';
import measureText from './measureText.js';

function wrapText(text, options = {}) {
    const {
        font = DefaultFont,
        fontKerning = DefaultFontKerning,
        tabSize = DefaultTabSize,
    } = options;
    
    context2d.font = font;
    context2d.fontKerning = fontKerning;
    setTabSize(tabSize);
    
    const lines = wrapTextImpl(text, {
        charLoaderFn,
        lineBreakOpportunityTestFn,
        lineFittingFn,
        etcLineFittingFn,
        typicalCharWidth: tw(['a']),
        ...options
    });

    return {
        lines,
        font: context2d.font,
    };
}

export {
    wrapText,
    measureText,
}
