'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function CharProvider(sourceText, options) {
  var charLoaderFn_ = options.charLoaderFn_,
      collapsesSpaces_ = options.collapsesSpaces_,
      collapsesNewlines_ = options.collapsesNewlines_,
      initialChunkSize_ = options.initialChunkSize_,
      supplementalChunkSize_ = options.supplementalChunkSize_;
  var loadedChars = [];
  var iterator = sourceText[Symbol.iterator]();
  var next = iterator.next();
  var currentChunkSize = initialChunkSize_;
  var totalReleasedChars = 0;
  var isNextSectionReady = false;

  var loadNextChunk = function loadNextChunk() {
    if (isNextSectionReady) {
      return;
    }

    var limit = loadedChars.length + currentChunkSize;

    if (collapsesNewlines_) {
      while (!next.done && loadedChars.length < limit) {
        charLoaderFn_(loadedChars, next.value, collapsesSpaces_);
        next = iterator.next();
      }
    } else {
      while (!next.done && loadedChars.length < limit) {
        if (next.value === '\r' || next.value === '\n') {
          isNextSectionReady = true;
          break;
        }

        charLoaderFn_(loadedChars, next.value, collapsesSpaces_);
        next = iterator.next();
      }
    }

    currentChunkSize = Math.max(initialChunkSize_ - totalReleasedChars, supplementalChunkSize_);
  };
  /**
   * 
   * @returns {boolean}
   */


  this.enterNextSection_ = function () {
    if (!isNextSectionReady) {
      return false;
    }

    if (next.value === '\r') {
      next = iterator.next();
    } // '\r\n' is only one newline breakpoint


    if (next.value === '\n') {
      next = iterator.next();
    }

    totalReleasedChars += loadedChars.length;
    loadedChars.length = 0;
    isNextSectionReady = false;
    return true;
  }; // The last loaded character may not be complete.
  // If we load the next chunk,
  // the first character of the next chunk may be combined with that character.
  // So, we don't return the last loaded character until the next chunk is loaded,
  // except in case there are no more characters left in the current section.
  // This value is fixed to be 1, don't change


  var buffer = 1;
  /**
   * 
   * @param {number} index
   * @returns {boolean}
   */

  this.has_ = function (index) {
    if (index < 0) {
      return false;
    }

    while (true) {
      // The character at this position is completely loaded
      if (index < loadedChars.length - buffer) {
        return true;
      } // Nothing left to do with this chunk


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


  this.get_ = function (index) {
    if (index < 0) {
      return '';
    }

    while (true) {
      // The character at this position is completely loaded
      if (index < loadedChars.length - buffer) {
        return loadedChars[index];
      } // Nothing left to do with this chunk


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


  this.slice_ = function (start, end) {
    if (end <= 0 || end <= start) {
      return [];
    }

    while (true) {
      // The characters between these slice positions are completely loaded
      if (end <= loadedChars.length - buffer) {
        return loadedChars.slice(start, end);
      } // Nothing left to do with this chunk


      if (next.done || isNextSectionReady) {
        return loadedChars.slice(start, end);
      }

      loadNextChunk();
    }
  };
}

var context2d = document.createElement('canvas').getContext('2d');
var Infinity = Number.POSITIVE_INFINITY;

var wrapTextImpl = function wrapTextImpl(text, options) {
  var charLoaderFn_ = options.charLoaderFn_,
      lineBreakOpportunityTestFn_ = options.lineBreakOpportunityTestFn_,
      lineFittingFn_ = options.lineFittingFn_,
      etcLineFittingFn_ = options.etcLineFittingFn_,
      typicalCharWidth_ = options.typicalCharWidth_,
      maxWidth_ = options.maxWidth_,
      maxLines_ = options.maxLines_,
      indent_ = options.indent_,
      lastIndent_ = options.lastIndent_,
      etc_ = options.etc_,
      newlines_ = options.newlines_,
      inlineSpaces_ = options.inlineSpaces_;

  if (maxLines_ <= 0) {
    return [];
  }

  var trimsLines = inlineSpaces_ === 'collapse' || inlineSpaces_ === 'trim';
  var collapsesSpaces = inlineSpaces_ === 'collapse';
  var collapsesNewlines = newlines_ === 'collapse'; // Estimate how many characters a line can contains

  var avgCharWidth_sum = 0;
  var avgCharWidth_count = 0;

  var getEstimatedLineCapacity = function getEstimatedLineCapacity(width) {
    if (avgCharWidth_count === 0) {
      return Math.ceil(width / typicalCharWidth_);
    }

    return Math.ceil(width / (avgCharWidth_sum / avgCharWidth_count));
  }; // An array of lines
  // Each line is an array of characters


  var outputLines = []; // We get character by position from this provider
  // Do not use string directly
  // because there are some Unicode rules that merge nearby characters into a combined-character
  // CharProvider also optimizes string parsing process by pagination

  var charProvider = new CharProvider(text, {
    charLoaderFn_: charLoaderFn_,
    collapsesSpaces_: collapsesSpaces,
    collapsesNewlines_: collapsesNewlines,
    initialChunkSize_: maxLines_ === Infinity ? Infinity : Math.max(1, Math.floor(1.2 * // empirical number, try to load only one time, but keep the characters need to load not too many
    maxLines_ * // number of lines should be loaded for the first page
    getEstimatedLineCapacity(maxWidth_) // estimated number of chars per line
    )),
    supplementalChunkSize_: Math.max(1, 2 * // number of lines should be loaded if the first page is fully used, this number should be small
    getEstimatedLineCapacity(maxWidth_))
  }); // There are more than max lines?

  var hasEtc = false; // Use this number to check if any new line is added later

  var prevNumberOfOutputLines = outputLines.length; // Position of the next character

  var offset = 0;

  while (true) {
    var firstCharOfLine = charProvider.get_(offset);

    if (trimsLines) {
      while (/\s/.test(firstCharOfLine)) {
        offset++;
        firstCharOfLine = charProvider.get_(offset);
      }
    } // ===
    // End of Section
    // If the first character of the line is empty


    if (firstCharOfLine === '') {
      // Add an empty line if no any line was added for this section
      // Make sure any section has at least one line, even it is empty
      if (prevNumberOfOutputLines === outputLines.length) {
        // Here, we have an empty line to be added
        // However, if we have enough lines
        // Then we have etc and finish the process
        if (outputLines.length === maxLines_) {
          hasEtc = true;
          break;
        }

        outputLines.push([]);
      }

      if (charProvider.enterNextSection_()) {
        // Reset numbers for the new section
        offset = 0;
        prevNumberOfOutputLines = outputLines.length;
        continue;
      } // Finish
      // The text was fully processed


      break;
    } // ===
    // Section continues
    // The first character of the line is NOT empty
    // Here, we will definitely have more characters to be added
    // However, if we have enough lines
    // Then we have etc and finish the process


    if (outputLines.length === maxLines_) {
      hasEtc = true;
      break;
    } // The max width of this line
    // after considering indentation


    var currentMaxWidth = outputLines.length === 0 ? maxWidth_ - indent_ : outputLines.length === maxLines_ - 1 ? maxWidth_ - lastIndent_ : maxWidth_; // The characters of this line
    // Make sure we are adding as many characters as possible

    var lineChars = charProvider.slice_(offset, offset + getEstimatedLineCapacity(currentMaxWidth) + 1 // Add 1 extra char to make it bigger than max width
    );
    lineFittingFn_(lineChars, charProvider, offset, currentMaxWidth); // Collect info to make the estimation more precise in the next rounds

    avgCharWidth_sum += currentMaxWidth;
    avgCharWidth_count += lineChars.length; // Make sure the line is broke at the valid position

    if (charProvider.has_(offset + lineChars.length)) {
      var lastCharIndex = -1;

      for (var i = lineChars.length - 1; i >= 0; i--) {
        if (lineBreakOpportunityTestFn_(charProvider, offset + i, trimsLines)) {
          lastCharIndex = i;
          break;
        }
      }

      if (lastCharIndex > -1 && lastCharIndex < lineChars.length - 1) {
        lineChars.splice(lastCharIndex + 1);
      }
    } // Update the position of the next character


    offset += lineChars.length;

    if (trimsLines) {
      while (lineChars.length > 0 && /\s/.test(lineChars[lineChars.length - 1])) {
        lineChars.length -= 1;
      } // lineChars is never empty there
      // because we have checked to make sure there are non-space chars above

    } // Finally, add the new line


    outputLines.push(lineChars);
  }

  if (hasEtc) {
    var lastLineChars = outputLines[outputLines.length - 1];
    etcLineFittingFn_(lastLineChars, etc_, maxWidth_ - lastIndent_);
  }

  return outputLines;
};

var charLoaderFn = function charLoaderFn(loadedChars, _char, collapsesSpaces) {
  if (collapsesSpaces && /\s/.test(_char)) {
    if (loadedChars[loadedChars.length - 1] !== ' ') {
      loadedChars.push(' ');
    }

    return;
  }

  loadedChars.push(_char);
};

var lineBreakOpportunityTestFn = function lineBreakOpportunityTestFn(charProvider, indexBefore, trimsLines) {
  if (/[\s-]/.test(charProvider.get_(indexBefore))) {
    return true;
  } // If we will remove leading and trailing spaces of lines
  // then we need to consider the character after


  if (trimsLines && /\s/.test(charProvider.get_(indexBefore + 1))) {
    return true;
  }

  return false;
};

var normalizeTypographyOptions = function normalizeTypographyOptions(options, userOptions) {
  if (userOptions === undefined) {
    userOptions = {};
  }

  if (typeof userOptions.font === 'string') {
    options.font_ = userOptions.font;
  } else {
    options.font_ = '10px sans-serif';
  }

  if (['auto', 'normal', 'none'].includes(userOptions.fontKerning)) {
    options.fontKerning_ = userOptions.fontKerning;
  } else {
    options.fontKerning_ = 'auto';
  }

  if (typeof userOptions.tabSize === 'number') {
    options.tabSize_ = userOptions.tabSize;
  } else {
    options.tabSize_ = 8;
  }
};

var normalizeWrappingOptions = function normalizeWrappingOptions(options, userOptions) {
  if (userOptions === undefined) {
    userOptions = {};
  }

  if (typeof userOptions.maxWidth === 'number') {
    options.maxWidth_ = userOptions.maxWidth;
  } else {
    options.maxWidth_ = Infinity;
  }

  if (typeof userOptions.maxLines === 'number') {
    options.maxLines_ = userOptions.maxLines;
  } else {
    options.maxLines_ = Infinity;
  }

  if (typeof userOptions.indent === 'number') {
    options.indent_ = userOptions.indent;
  } else {
    options.indent_ = 0;
  }

  if (typeof userOptions.lastIndent === 'number') {
    options.lastIndent_ = userOptions.lastIndent;
  } else {
    options.lastIndent_ = 0;
  }

  if (typeof userOptions.etc === 'string') {
    options.etc_ = userOptions.etc;
  } else {
    options.etc_ = '…';
  }

  if (['collapse', 'preserve'].includes(userOptions.newlines)) {
    options.newlines_ = userOptions.newlines;
  } else {
    options.newlines_ = 'collapse';
  }

  if (['collapse', 'trim', 'preserve'].includes(userOptions.inlineSpaces)) {
    options.inlineSpaces_ = userOptions.inlineSpaces;
  } else {
    options.inlineSpaces_ = 'collapse';
  }
};

var measureText = function measureText(text, userOptions) {
  var options = {};
  normalizeTypographyOptions(options, userOptions);
  context2d.font = options.font_;
  context2d.fontKerning = options.fontKerning_; // Canvas context treat a tab character as a space character when measuring the text
  // So we need to handle the tab size manually

  var spacesAsTab = new Array(options.tabSize_).fill(' ').join('');
  return context2d.measureText(text.replace(/\t/g, spacesAsTab));
};

var wrapText = function wrapText(text, userOptions) {
  var options = {};
  normalizeTypographyOptions(options, userOptions);
  normalizeWrappingOptions(options, userOptions);
  context2d.font = options.font_;
  var charToWidth = Object.create(null);

  var cw = function cw(_char2) {
    var width = charToWidth[_char2];

    if (width === undefined) {
      if (_char2 === '\t') {
        width = context2d.measureText(new Array(options.tabSize_).fill(' ').join('')).width;
      } else {
        width = context2d.measureText(_char2).width;
      }

      charToWidth[_char2] = width;
    }

    return width;
  };

  var tw = function tw(chars) {
    var sum = 0;

    for (var i = chars.length - 1; i >= 0; i--) {
      sum += cw(chars[i]);
    }

    return sum;
  };

  var lineFittingFn = function lineFittingFn(lineChars, charProvider, offset, currentMaxWidth) {
    var lineWidth = tw(lineChars);
    var nextChar = '';

    while (lineWidth < currentMaxWidth && (nextChar = charProvider.get_(offset + lineChars.length)) !== '') {
      lineChars.push(nextChar);
      lineWidth += cw(nextChar);
    }

    if (lineChars.length === 0) {
      // Every line always has at least a character
      lineChars.push(charProvider.get_(offset));
    } else {
      while (lineWidth > currentMaxWidth && lineChars.length > 1) {
        var _char3 = lineChars.pop();

        lineWidth -= cw(_char3);
      }
    }
  };

  var etcLineFittingFn = function etcLineFittingFn(lastLineChars, etc, currentMaxWidth) {
    // If etc contains some chars, we can consider it as a combinated-char
    var etcWidth = cw(etc);
    var lastLineWidth = tw(lastLineChars);

    while (lastLineWidth + etcWidth > currentMaxWidth) {
      lastLineWidth -= cw(lastLineChars.pop());
    }

    lastLineChars.push(etc);
  };

  var lines = wrapTextImpl(text, Object.assign(options, {
    charLoaderFn_: charLoaderFn,
    lineBreakOpportunityTestFn_: lineBreakOpportunityTestFn,
    lineFittingFn_: lineFittingFn,
    etcLineFittingFn_: etcLineFittingFn,
    typicalCharWidth_: cw('a')
  }));
  return {
    lines: lines,
    font: context2d.font
  };
};

exports.measureText = measureText;
exports.wrapText = wrapText;
