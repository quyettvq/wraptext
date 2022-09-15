import {cc, mc} from './line-break/index.js';

// Reference document
// https://www.unicode.org/reports/tr14/tr14-45.html#Algorithm

let charLoaderFn = (loadedChars, char, collapsesSpaces) => {
    if (collapsesSpaces && /\s/.test(char)) {
        if (loadedChars[loadedChars.length - 1] !== ' ') {
            loadedChars.push(' ');
        }
        return;
    }

    // LB9: Do not break combined-characters
    if (loadedChars.length > 0 &&
        !mc(loadedChars[loadedChars.length - 1].charCodeAt(0), ['BK', 'CR', 'LF', 'NL', 'SP', 'ZW']) &&
        mc(char.charCodeAt(0), ['CM', 'ZWJ'])
    ) {
        loadedChars[loadedChars.length - 1] += char;
        return;
    }

    loadedChars.push(char);
};

let lineBreakOpportunityTestFn = (charProvider, indexBefore, trimsLines) => {
    // We always have characters before and after the line break opportunity
    // But the character before of before may not exist
    // In case the character is not exist, the code will be NaN
    let beforeBefore = charProvider.get_(indexBefore - 1).charCodeAt(0);
    let before = charProvider.get_(indexBefore).charCodeAt(0);
    let after = charProvider.get_(indexBefore + 1).charCodeAt(0);

    // If we have a character and zero, one or many following spaces
    // Then we call that character beforeSP
    let beforeSP = before; // indexBefore
    if (cc(beforeSP, 'SP')) {
        beforeSP = beforeBefore; // indexBefore - 1
        if (cc(beforeSP, 'SP')) {
            for (let i = indexBefore - 2; cc(beforeSP, 'SP'); i--) {
                beforeSP = charProvider.get_(i).charCodeAt(0);
                // beforeSP will be NaN if there is no character left
                // then the loop will be finished after checking the condition
                // DON'T check for i >= 0,
                // because the loop will be finished at the final character, even it is a space
                // That is not what we expect
            }
        }
    }

    // LB1 - LB6: Out of scope of this function

    // LB7: If we will remove leading and trailing spaces of lines,
    // then skip this rule
    if (!trimsLines && mc(after, ['SP', 'ZW'])) {
        return false;
    }

    // LB8
    if (cc(beforeSP, 'ZW')) {
        return true;
    }

    // LB8a
    if (cc(before, 'ZWJ')) {
        return false;
    }

    // LB9
    // LB10: CM or ZWJ not follows a base char, be treated as AL class
    if (mc(before, ['CM', 'ZWJ'])) {
        before = 'a'.charCodeAt(0);
    }

    // LB11
    if (cc(before, 'WJ') || cc(after, 'WJ')) {
        return false;
    }

    // LB12
    if (cc(before, 'GL')) {
        return false;
    }

    // LB12a
    if (cc(after, 'GL') && !mc(before, ['SP', 'BA', 'HY'])) {
        return false;
    }

    // LB13
    if (mc(after, ['CL', 'CP', 'EX', 'IS', 'SY'])) {
        return false;
    }

    // LB14
    if (cc(beforeSP, 'OP')) {
        return false;
    }

    // LB15
    if (cc(beforeSP, 'QU') && cc(after, 'OP')) {
        return false;
    }

    // LB16
    if (mc(beforeSP, ['CL', 'CP']) && cc(after, 'NS')) {
        return false;
    }

    // LB17
    if (cc(beforeSP, 'B2') && cc(after, 'B2')) {
        return false;
    }

    // LB18
    if (cc(before, 'SP')) {
        return true;
    }

    // LB19
    if (cc(before, 'QU') || cc(after, 'QU')) {
        return false;
    }

    // LB20
    if (cc(before, 'CB') || cc(after, 'CB')) {
        return true;
    }

    // LB21
    if (cc(before, 'BB') || mc(after, ['BA', 'HY', 'NS'])) {
        return false;
    }

    // LB21a
    if (cc(beforeBefore, 'HL') && mc(before, ['HY', 'BA'])) {
        return false;
    }

    // LB21b
    if (cc(before, 'SY') && cc(after, 'HL')) {
        return false;
    }

    // LB22
    if (cc(after, 'IN')) {
        return false;
    }

    // LB23
    if (mc(before, ['AL', 'HL']) && cc(after, 'NU') ||
        cc(before, 'NU') && mc(after, ['AL', 'HL'])
    ) {
        return false;
    }

    // LB23a
    if (cc(before, 'PR') && mc(after, ['ID', 'EB', 'EM']) ||
        mc(before, ['ID', 'EB', 'EM']) && cc(after, 'PO')
    ) {
        return false;
    }

    // LB24
    if (mc(before, ['PR', 'PO']) && mc(after, ['AL', 'HL']) ||
        mc(before, ['AL', 'HL']) && mc(after, ['PR', 'PO'])
    ) {
        return false;
    }

    // LB25
    if (mc(before, ['CL', 'CP', 'NU']) && mc(after, ['PO', 'PR']) ||
        mc(before, ['PO', 'PR']) && cc(after, 'OP') ||
        mc(before, ['PO', 'PR', 'HY', 'IS', 'NU', 'SY']) && cc(after, 'NU')
    ) {
        return false;
    }

    // LB26
    if (cc(before, 'JL') && mc(after, ['JL', 'JV', 'H2', 'H3']) ||
        mc(before, ['JV', 'H2']) && mc(after, ['JV', 'JT']) ||
        mc(before, ['JT', 'H3']) && cc(after, 'JT')
    ) {
        return false;
    }

    // LB27
    if (mc(before, ['JL', 'JV', 'JT', 'H2', 'H3']) && mc(after, ['IN', 'PO']) ||
        cc(before, 'PR') && mc(after, ['JL', 'JV', 'JT', 'H2', 'H3'])
    ) {
        return false;
    }

    // LB28
    if (mc(before, ['AL', 'HL']) && mc(after, ['AL', 'HL'])) {
        return false;
    }

    // LB29
    if (cc(before, 'IS') && mc(after, ['AL', 'HL'])) {
        return false;
    }

    // LB30 (incomplete)
    if (mc(before, ['AL', 'HL', 'NU']) && cc(after, 'OP') ||
        cc(before, 'CP') && mc(after, ['AL', 'HL', 'NU'])
    ) {
        return false;
    }

    // LB30a: Skip

    // LB30b
    if (cc(before, 'EB') && cc(after, 'EM')) {
        return false;
    }

    // LB31
    return true;
};

export {
    charLoaderFn,
    lineBreakOpportunityTestFn,
};
