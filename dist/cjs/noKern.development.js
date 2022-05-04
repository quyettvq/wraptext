/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/CharProvider.js":
/*!*****************************!*\
  !*** ./src/CharProvider.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CharProvider)
/* harmony export */ });
function CharProvider(sourceText, options = {}) {
    const {
        charLoaderFn,
        collapsesSpaces,
        collapsesNewlines,
        initialChunkSize,
        supplementalChunkSize,
        // First time, we should load the number of chars slightly more than estimated total chars we need
        // If that number of chars is not enough, then we need to load more
        // but we should load a small amount as a supplement
    } = options;

    const loadedChars = [];
    const iterator = sourceText[Symbol.iterator]();
    let next = iterator.next();
    let currentChunkSize = initialChunkSize;
    let totalReleasedChars = 0;
    let isNextSectionReady = false;
    
    const loadNextChunk = () => {
        if (isNextSectionReady) {
            return;
        }

        const limit = loadedChars.length + currentChunkSize;
        
        if (collapsesNewlines) {
            while (!next.done && loadedChars.length < limit) {
                charLoaderFn(loadedChars, next.value, collapsesSpaces);
                next = iterator.next();
            }
        } else {
            while (!next.done && loadedChars.length < limit) {
                if (next.value === '\r' || next.value === '\n') {
                    isNextSectionReady = true;
                    break;
                }

                charLoaderFn(loadedChars, next.value, collapsesSpaces);
                next = iterator.next();
            }
        }

        currentChunkSize = Math.max(initialChunkSize - totalReleasedChars, supplementalChunkSize);
    };

    /**
     * 
     * @returns {boolean}
     */
    this.enterNextSection = () => {
        if (!isNextSectionReady) {
            return false;
        }

        if (next.value === '\r') {
            next = iterator.next();
        }

        // '\r\n' is only one newline breakpoint
        if (next.value === '\n') {
            next = iterator.next();
        }

        totalReleasedChars += loadedChars.length;
        loadedChars.length = 0;

        isNextSectionReady = false;
        
        return true;
    };

    // The last loaded character may not be complete.
    // If we load the next chunk,
    // the first character of the next chunk may be combined with that character.
    // So, we don't return the last loaded character until the next chunk is loaded,
    // except in case there are no more characters left in the current section.
    // This value is fixed to be 1, don't change
    const buffer = 1;

    /**
     * 
     * @param {number} index
     * @returns {boolean}
     */
    this.has = (index) => {
        if (index < 0) {
            return false;
        }

        while (true) {
            // The character at this position is completely loaded
            if (index < loadedChars.length - buffer) {
                return true;
            }

            // Nothing left to do with this chunk
            if (next.done || isNextSectionReady) {
                return index < loadedChars.length;
            }

            loadNextChunk();
        }
    };

    /**
     * 
     * @param {number} index
     * @returns {string}
     */
    this.get = (index) => {
        if (index < 0) {
            return '';
        }

        while (true) {
            // The character at this position is completely loaded
            if (index < loadedChars.length - buffer) {
                return loadedChars[index];
            }

            // Nothing left to do with this chunk
            if (next.done || isNextSectionReady) {
                if (index < loadedChars.length) {
                    return loadedChars[index];
                } else {
                    return '';
                }
            }

            loadNextChunk();
        }
    };

    /**
     * 
     * @param {number} start
     * @param {number} end
     * @returns {Array<string>}
     */
    this.slice = (start, end) => {
        if (end <= 0 || end <= start) {
            return [];
        }
        
        while (true) {
            // The characters between these slice positions are completely loaded
            if (end <= loadedChars.length - buffer) {
                return loadedChars.slice(start, end);
            }

            // Nothing left to do with this chunk
            if (next.done || isNextSectionReady) {
                return loadedChars.slice(start, end);
            }

            loadNextChunk();
        }
        console.log(start, end)
    };
}


/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Infinity": () => (/* binding */ Infinity),
/* harmony export */   "context2d": () => (/* binding */ context2d)
/* harmony export */ });
const context2d = document.createElement('canvas').getContext('2d');

const Infinity = Number.POSITIVE_INFINITY;


/***/ }),

/***/ "./src/lineBreaking.base.js":
/*!**********************************!*\
  !*** ./src/lineBreaking.base.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "charLoaderFn": () => (/* binding */ charLoaderFn),
/* harmony export */   "lineBreakOpportunityTestFn": () => (/* binding */ lineBreakOpportunityTestFn)
/* harmony export */ });
function charLoaderFn(loadedChars, char, collapsesSpaces) {
    if (collapsesSpaces && /\s/.test(char)) {
        if (loadedChars[loadedChars.length - 1] !== ' ') {
            loadedChars.push(' ');
        }
        return;
    }

    loadedChars.push(char);
}

function lineBreakOpportunityTestFn(charProvider, indexBefore, trimsLines) {
    if (/[\s-]/.test(charProvider.get(indexBefore))) {
        return true;
    }

    // If we will remove leading and trailing spaces of lines
    // then we need to consider the character after
    if (trimsLines && /\s/.test(charProvider.get(indexBefore + 1))) {
        return true;
    }
    
    return false;
}




/***/ }),

/***/ "./src/measureText.js":
/*!****************************!*\
  !*** ./src/measureText.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ measureText)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");


function measureText(text, options = {}) {
    normalizeTypographyOptions(options);

    const {font, fontKerning, tabSize} = options;
    
    _constants_js__WEBPACK_IMPORTED_MODULE_0__.context2d.font = font;
    _constants_js__WEBPACK_IMPORTED_MODULE_0__.context2d.fontKerning = fontKerning;

    // Canvas context treat a tab character as a space character when measuring the text
    // So we need to handle the tab size manually
    const spacesAsTab = new Array(tabSize).fill(' ').join('');

    return _constants_js__WEBPACK_IMPORTED_MODULE_0__.context2d.measureText(
        text.replace(/\t/g, spacesAsTab)
    );
}


/***/ }),

/***/ "./src/options.js":
/*!************************!*\
  !*** ./src/options.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "normalizeTypographyOptions": () => (/* binding */ normalizeTypographyOptions),
/* harmony export */   "normalizeWrappingOptions": () => (/* binding */ normalizeWrappingOptions)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");


function normalizeTypographyOptions(options = {}) {
    if (typeof options.font !== 'string') {
        options.font = '10px sans-serif';
    }

    if (!['auto', 'normal', 'none'].includes(options.fontKerning)) {
        options.fontKerning = 'auto';
    }

    if (typeof options.tabSize !== 'number') {
        options.tabSize = 8;
    }
}

function normalizeWrappingOptions(options = {}) {
    if (typeof options.maxWidth !== 'number') {
        options.maxWidth = _constants_js__WEBPACK_IMPORTED_MODULE_0__[Infinity];
    }

    if (typeof options.maxLines !== 'number') {
        options.maxLines = _constants_js__WEBPACK_IMPORTED_MODULE_0__[Infinity];
    }

    if (typeof options.indent !== 'number') {
        options.indent = 0;
    }

    if (typeof options.lastIndent !== 'number') {
        options.lastIndent = 0;
    }

    if (typeof options.etc !== 'string') {
        options.etc = '…';
    }

    if (!['collapse', 'preserve'].includes(options.newlines)) {
        options.newlines = 'collapse';
    }

    if (!['collapse', 'trim', 'preserve'].includes(options.inlineSpaces)) {
        options.inlineSpaces = 'collapse';
    }
}




/***/ }),

/***/ "./src/wrapTextImpl.js":
/*!*****************************!*\
  !*** ./src/wrapTextImpl.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ wrapTextImpl)
/* harmony export */ });
/* harmony import */ var _CharProvider_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CharProvider.js */ "./src/CharProvider.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");



function wrapTextImpl(text, options = {}) {
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
    const charProvider = new _CharProvider_js__WEBPACK_IMPORTED_MODULE_0__["default"](text, {
        charLoaderFn,
        collapsesSpaces,
        collapsesNewlines,
        initialChunkSize: maxLines === _constants_js__WEBPACK_IMPORTED_MODULE_1__[Infinity] ? _constants_js__WEBPACK_IMPORTED_MODULE_1__[Infinity] : Math.max(1, Math.floor(
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./src/index.noKern.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "measureText": () => (/* reexport safe */ _measureText_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "wrapText": () => (/* binding */ wrapText)
/* harmony export */ });
/* harmony import */ var _wrapTextImpl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wrapTextImpl.js */ "./src/wrapTextImpl.js");
/* harmony import */ var _lineBreaking_base_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lineBreaking.base.js */ "./src/lineBreaking.base.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _measureText_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./measureText.js */ "./src/measureText.js");
/* harmony import */ var _options_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./options.js */ "./src/options.js");






function wrapText(text, options = {}) {
    (0,_options_js__WEBPACK_IMPORTED_MODULE_4__.normalizeTypographyOptions)(options);
    (0,_options_js__WEBPACK_IMPORTED_MODULE_4__.normalizeWrappingOptions)(options);

    const {font, tabSize} = options;
    
    _constants_js__WEBPACK_IMPORTED_MODULE_2__.context2d.font = font;

    const charToWidth = Object.create(null);

    const cw = (char) => {
        let width = charToWidth[char];
        if (width === undefined) {
            if (char === '\t') {
                width = _constants_js__WEBPACK_IMPORTED_MODULE_2__.context2d.measureText(new Array(tabSize).fill(' ').join('')).width;
            } else {
                width = _constants_js__WEBPACK_IMPORTED_MODULE_2__.context2d.measureText(char).width;
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

        if (lineChars.length === 0) {
            // Every line always has at least a character
            lineChars.push(charProvider.get(offset));
        } else {
            while (lineWidth > currentMaxWidth && lineChars.length > 1) {
                const char = lineChars.pop();
                lineWidth -= cw(char);
            }
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
    
    const lines = (0,_wrapTextImpl_js__WEBPACK_IMPORTED_MODULE_0__["default"])(text, {
        charLoaderFn: _lineBreaking_base_js__WEBPACK_IMPORTED_MODULE_1__.charLoaderFn,
        lineBreakOpportunityTestFn: _lineBreaking_base_js__WEBPACK_IMPORTED_MODULE_1__.lineBreakOpportunityTestFn,
        lineFittingFn,
        etcLineFittingFn,
        typicalCharWidth: cw('a'),
        ...options
    });

    return {
        lines,
        font: _constants_js__WEBPACK_IMPORTED_MODULE_2__.context2d.font,
    };
}



})();

module.exports = __webpack_exports__;
/******/ })()
;