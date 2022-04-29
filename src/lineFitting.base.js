import {context2d} from './constants.js';

// Canvas context treat a tab character as a space character when measuring the text
// So we need to handle the tab size manually
let spacesAsTab;

// IMPORTANT!!!
// Always set the tab size before using other functions
function setTabSize(value) {
    spacesAsTab = new Array(value).fill(' ').join('');
}

function tw(chars) {
    let textToMeasure = '';
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        textToMeasure += char === '\t' ? spacesAsTab : char;
    }
    return context2d.measureText(textToMeasure).width;
}

function lineFittingFn(lineChars, charProvider, offset, currentMaxWidth) {
    while (charProvider.has(offset + lineChars.length) &&
        tw(lineChars) < currentMaxWidth
    ) {
        lineChars.push(charProvider.get(offset + lineChars.length));
    }
    
    while (lineChars.length > 0 &&
        tw(lineChars) > currentMaxWidth
    ) {
        lineChars.length -= 1;
    }
}

function etcLineFittingFn(lastLineChars, etc, currentMaxWidth) {
    while (lastLineChars.length > 0 &&
        tw(lastLineChars.concat(etc)) > currentMaxWidth
    ) {
        lastLineChars.length -= 1;
    }

    // If etc contains some chars, we can consider it as a combinated-char
    lastLineChars.push(etc);
}

export {
    setTabSize,
    tw,
    lineFittingFn,
    etcLineFittingFn,
}
