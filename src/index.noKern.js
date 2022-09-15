import {wrapTextImpl} from './wrapTextImpl.js';
import {charLoaderFn, lineBreakOpportunityTestFn} from './lineBreaking.base.js';
import {context2d} from './constants.js';
import {measureText} from './measureText.js';
import {normalizeTypographyOptions, normalizeWrappingOptions} from './options.js';

let wrapText = (text, userOptions) => {
    let options = {};
    normalizeTypographyOptions(options, userOptions);
    normalizeWrappingOptions(options, userOptions);

    context2d.font = options.font_;

    let charToWidth = Object.create(null);

    let cw = (char) => {
        let width = charToWidth[char];
        if (width === undefined) {
            if (char === '\t') {
                width = context2d.measureText(new Array(options.tabSize_).fill(' ').join('')).width;
            } else {
                width = context2d.measureText(char).width;
            }
            charToWidth[char] = width;
        }
        return width;
    };

    let tw = (chars) => {
        let sum = 0;
        for (let i = chars.length - 1; i >= 0; i--) {
            sum += cw(chars[i]);
        }
        return sum;
    };

    let lineFittingFn = (lineChars, charProvider, offset, currentMaxWidth) => {
        let lineWidth = tw(lineChars);

        let nextChar = '';
        while (
            lineWidth < currentMaxWidth &&
            (nextChar = charProvider.get_(offset + lineChars.length)) !== ''
        ) {
            lineChars.push(nextChar);
            lineWidth += cw(nextChar);
        }

        if (lineChars.length === 0) {
            // Every line always has at least a character
            lineChars.push(charProvider.get_(offset));
        } else {
            while (lineWidth > currentMaxWidth && lineChars.length > 1) {
                let char = lineChars.pop();
                lineWidth -= cw(char);
            }
        }
    };
    
    let etcLineFittingFn = (lastLineChars, etc, currentMaxWidth) => {
        // If etc contains some chars, we can consider it as a combinated-char
        let etcWidth = cw(etc);
        let lastLineWidth = tw(lastLineChars);
        while (lastLineWidth + etcWidth > currentMaxWidth) {
            lastLineWidth -= cw(lastLineChars.pop());
        }
        lastLineChars.push(etc);
    };
    
    let lines = wrapTextImpl(text, Object.assign(options, {
        charLoaderFn_: charLoaderFn,
        lineBreakOpportunityTestFn_: lineBreakOpportunityTestFn,
        lineFittingFn_: lineFittingFn,
        etcLineFittingFn_: etcLineFittingFn,
        typicalCharWidth_: cw('a')
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
