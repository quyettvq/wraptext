import {context2d} from './constants.js';

// Canvas context treat a tab character as a space character when measuring the text
// So we need to handle the tab size manually
let spacesAsTab;

// IMPORTANT!!!
// Always set the tab size before using other functions
let setTabSize = (value) => {
    spacesAsTab = new Array(value).fill(' ').join('');
};

let tw = (chars) => {
    let textToMeasure = '';
    for (let i = 0; i < chars.length; i++) {
        let char = chars[i];
        textToMeasure += char === '\t' ? spacesAsTab : char;
    }
    return context2d.measureText(textToMeasure).width;
};

let lineFittingFn = (lineChars, charProvider, offset, currentMaxWidth) => {
    while (charProvider.has_(offset + lineChars.length) &&
        tw(lineChars) < currentMaxWidth
    ) {
        lineChars.push(charProvider.get_(offset + lineChars.length));
    }
    
    if (lineChars.length === 0) {
        // Every line always has at least a character
        lineChars.push(charProvider.get_(offset));
    } else {
        while (lineChars.length > 1 &&
            tw(lineChars) > currentMaxWidth
        ) {
            lineChars.length -= 1;
        }
    }
};

let etcLineFittingFn = (lastLineChars, etc, currentMaxWidth) => {
    while (lastLineChars.length > 0 &&
        tw(lastLineChars.concat(etc)) > currentMaxWidth
    ) {
        lastLineChars.length -= 1;
    }

    // If etc contains some chars, we can consider it as a combinated-char
    lastLineChars.push(etc);
};

export {
    setTabSize,
    tw,
    lineFittingFn,
    etcLineFittingFn,
};
