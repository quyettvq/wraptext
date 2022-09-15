function CharProvider(sourceText, options) {
    let {
        charLoaderFn_,
        collapsesSpaces_,
        collapsesNewlines_,
        initialChunkSize_,
        supplementalChunkSize_,
        // First time, we should load the number of chars slightly more than estimated total chars we need
        // If that number of chars is not enough, then we need to load more
        // but we should load a small amount as a supplement
    } = options;

    let loadedChars = [];
    let iterator = sourceText[Symbol.iterator]();
    let next = iterator.next();
    let currentChunkSize = initialChunkSize_;
    let totalReleasedChars = 0;
    let isNextSectionReady = false;
    
    let loadNextChunk = () => {
        if (isNextSectionReady) {
            return;
        }

        let limit = loadedChars.length + currentChunkSize;
        
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
    this.enterNextSection_ = () => {
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
    this.has_ = (index) => {
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
    this.get_ = (index) => {
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
    this.slice_ = (start, end) => {
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
    };
};

export {
    CharProvider,
};
