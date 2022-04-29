import wrapTextImpl from './wrapTextImpl.js';
import {charLoaderFn, lineBreakOpportunityTestFn} from './lineBreaking.base.js';
import {context2d, DefaultFont, DefaultTabSize} from './constants.js';
import measureText from './measureText.js';

function wrapText(text, options = {}) {
    const {
        font = DefaultFont,
        tabSize = DefaultTabSize,
    } = options;
    
    context2d.font = font;

    const charToWidth = Object.create(null);

    const cw = (char) => {
        let width = charToWidth[char];
        if (width === undefined) {
            if (char === '\t') {
                width = context2d.measureText(new Array(tabSize).fill(' ').join('')).width;
            } else {
                width = context2d.measureText(char).width;
            }
            charToWidth[char] = width;
        }
        return width;
    };

    const tw = (chars) => {
        let sum = 0;
        for (let i = chars.length - 1; i >= 0; i--) {
            sum += cw(chars[i]);
        }
        return sum;
    };

    const lineFittingFn = (lineChars, charProvider, offset, currentMaxWidth) => {
        let lineWidth = tw(lineChars);

        let nextChar = '';
        while (
            lineWidth < currentMaxWidth &&
            (nextChar = charProvider.get(offset + lineChars.length)) !== ''
        ) {
            lineChars.push(nextChar);
            lineWidth += cw(nextChar);
        }

        while (lineWidth > currentMaxWidth) {
            const char = lineChars.pop();
            lineWidth -= cw(char);
        }
    };
    
    const etcLineFittingFn = (lastLineChars, etc, currentMaxWidth) => {
        // If etc contains some chars, we can consider it as a combinated-char
        const etcWidth = cw(etc);
        let lastLineWidth = tw(lastLineChars);
        while (lastLineWidth + etcWidth > currentMaxWidth) {
            lastLineWidth -= cw(lastLineChars.pop());
        }
        lastLineChars.push(etc);
    };
    
    const lines = wrapTextImpl(text, {
        charLoaderFn,
        lineBreakOpportunityTestFn,
        lineFittingFn,
        etcLineFittingFn,
        typicalCharWidth: cw('a'),
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
