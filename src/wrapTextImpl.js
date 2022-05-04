import CharProvider from './CharProvider.js';
import {Infinity} from './constants.js';

export default function wrapTextImpl(text, options = {}) {
    let {
        charLoaderFn,
        lineBreakOpportunityTestFn,
        lineFittingFn,
        etcLineFittingFn,
        typicalCharWidth,

        maxWidth,
        maxLines,
        indent,
        lastIndent,
        etc,
        newlines,
        inlineSpaces,
    } = options;

    if (maxLines <= 0) {
        return [];
    }

    const trimsLines = inlineSpaces === 'collapse' || inlineSpaces === 'trim';
    const collapsesSpaces = inlineSpaces === 'collapse';
    const collapsesNewlines = newlines === 'collapse';

    // Estimate how many characters a line can contains
    let avgCharWidth_sum = 0;
    let avgCharWidth_count = 0;

    const getEstimatedLineCapacity = (width) => {
        if (avgCharWidth_count === 0) {
            return Math.ceil(width / typicalCharWidth);
        }
        return Math.ceil(width / (avgCharWidth_sum / avgCharWidth_count));
    };

    // An array of lines
    // Each line is an array of characters
    const outputLines = [];

    // We get character by position from this provider
    // Do not use string directly
    // because there are some Unicode rules that merge nearby characters into a combined-character
    // CharProvider also optimizes string parsing process by pagination
    const charProvider = new CharProvider(text, {
        charLoaderFn,
        collapsesSpaces,
        collapsesNewlines,
        initialChunkSize: maxLines === Infinity ? Infinity : Math.max(1, Math.floor(
            1.2 * // empirical number, try to load only one time, but keep the characters need to load not too many
            maxLines * // number of lines should be loaded for the first page
            getEstimatedLineCapacity(maxWidth) // estimated number of chars per line
        )),
        supplementalChunkSize: Math.max(1,
            2 * // number of lines should be loaded if the first page is fully used, this number should be small
            getEstimatedLineCapacity(maxWidth)
        ),
    });

    // There are more than max lines?
    let hasEtc = false;

    // Use this number to check if any new line is added later
    let prevNumberOfOutputLines = outputLines.length;

    // Position of the next character
    let offset = 0;

    while (true) {
        let firstCharOfLine = charProvider.get(offset);

        if (trimsLines) {
            while (/\s/.test(firstCharOfLine)) {
                offset++;
                firstCharOfLine = charProvider.get(offset);
            }
        }

        // ===
        // End of Section
        // If the first character of the line is empty
        if (firstCharOfLine === '') {
            // Add an empty line if no any line was added for this section
            // Make sure any section has at least one line, even it is empty
            if (prevNumberOfOutputLines === outputLines.length) {
                // Here, we have an empty line to be added
                // However, if we have enough lines
                // Then we have etc and finish the process
                if (outputLines.length === maxLines) {
                    hasEtc = true;
                    break;
                }

                outputLines.push([]);
            }

            if (charProvider.enterNextSection()) {
                // Reset numbers for the new section
                offset = 0;
                prevNumberOfOutputLines = outputLines.length;
                continue;
            }

            // Finish
            // The text was fully processed
            break;
        }

        // ===
        // Section continues
        // The first character of the line is NOT empty

        // Here, we will definitely have more characters to be added
        // However, if we have enough lines
        // Then we have etc and finish the process
        if (outputLines.length === maxLines) {
            hasEtc = true;
            break;
        }

        // The max width of this line
        // after considering indentation
        const currentMaxWidth = outputLines.length === 0
            ? maxWidth - indent
            : (outputLines.length === maxLines - 1
                ? maxWidth - lastIndent
                : maxWidth);

        // The characters of this line
        // Make sure we are adding as many characters as possible
        const lineChars = charProvider.slice(
            offset,
            offset + getEstimatedLineCapacity(currentMaxWidth) + 1
            // Add 1 extra char to make it bigger than max width
        );
        lineFittingFn(lineChars, charProvider, offset, currentMaxWidth);

        // Collect info to make the estimation more precise in the next rounds
        avgCharWidth_sum += currentMaxWidth;
        avgCharWidth_count += lineChars.length;

        // Make sure the line is broke at the valid position
        if (charProvider.has(offset + lineChars.length)) {
            let lastCharIndex = -1;

            for (let i = lineChars.length - 1; i >= 0; i--) {
                if (lineBreakOpportunityTestFn(charProvider, offset + i, trimsLines)) {
                    lastCharIndex = i;
                    break;
                }
            }

            if (lastCharIndex > -1 && lastCharIndex < lineChars.length - 1) {
                lineChars.splice(lastCharIndex + 1);
            }
        }

        // Update the position of the next character
        offset += lineChars.length;

        if (trimsLines) {
            while (lineChars.length > 0 && /\s/.test(lineChars[lineChars.length - 1])) {
                lineChars.length -= 1;
            }
            // lineChars is never empty there
            // because we have checked to make sure there are non-space chars above
        }

        // Finally, add the new line
        outputLines.push(lineChars);
    }

    if (hasEtc) {
        const lastLineChars = outputLines[outputLines.length - 1];
        etcLineFittingFn(lastLineChars, etc, maxWidth - lastIndent);
    }

    return outputLines;
}
