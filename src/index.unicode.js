import wrapTextImpl from './wrapTextImpl.js';
import {charLoaderFn, lineBreakOpportunityTestFn} from './lineBreaking.unicode.js';
import {tw, lineFittingFn, etcLineFittingFn, setTabSize} from './lineFitting.base.js';
import {context2d} from './constants.js';
import measureText from './measureText.js';
import {normalizeTypographyOptions, normalizeWrappingOptions} from './options.js';
import {ensureDataReady} from './line-break/index.js';

function wrapText(text, options = {}) {
    ensureDataReady();

    normalizeTypographyOptions(options);
    normalizeWrappingOptions(options);

    const {font, fontKerning, tabSize} = options;
    
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
