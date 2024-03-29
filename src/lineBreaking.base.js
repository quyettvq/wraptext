let charLoaderFn = (loadedChars, char, collapsesSpaces) => {
    if (collapsesSpaces && /\s/.test(char)) {
        if (loadedChars[loadedChars.length - 1] !== ' ') {
            loadedChars.push(' ');
        }
        return;
    }

    loadedChars.push(char);
};

let lineBreakOpportunityTestFn = (charProvider, indexBefore, trimsLines) => {
    if (/[\s-]/.test(charProvider.get_(indexBefore))) {
        return true;
    }

    // If we will remove leading and trailing spaces of lines
    // then we need to consider the character after
    if (trimsLines && /\s/.test(charProvider.get_(indexBefore + 1))) {
        return true;
    }
    
    return false;
};

export {
    charLoaderFn,
    lineBreakOpportunityTestFn,
};
