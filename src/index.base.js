import {wrapTextImpl} from './wrapTextImpl.js';
import {charLoaderFn, lineBreakOpportunityTestFn} from './lineBreaking.base.js';
import {tw, lineFittingFn, etcLineFittingFn, setTabSize} from './lineFitting.base.js';
import {context2d} from './constants.js';
import {measureText} from './measureText.js';
import {normalizeTypographyOptions, normalizeWrappingOptions} from './options.js';

let wrapText = (text, userOptions) => {
    let options = {};
    normalizeTypographyOptions(options, userOptions);
    normalizeWrappingOptions(options, userOptions);

    context2d.font = options.font_;
    context2d.fontKerning = options.fontKerning_;
    setTabSize(options.tabSize_);
    
    let lines = wrapTextImpl(text, Object.assign(options, {
        charLoaderFn_: charLoaderFn,
        lineBreakOpportunityTestFn_: lineBreakOpportunityTestFn,
        lineFittingFn_: lineFittingFn,
        etcLineFittingFn_: etcLineFittingFn,
        typicalCharWidth_: tw(['a'])
    }));

    return {
        lines,
        font: context2d.font,
    };
};

export {
    wrapText,
    measureText,
};
