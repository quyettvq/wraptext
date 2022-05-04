import {Infinity} from './constants.js';

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
        options.maxWidth = Infinity;
    }

    if (typeof options.maxLines !== 'number') {
        options.maxLines = Infinity;
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

export {
    normalizeTypographyOptions,
    normalizeWrappingOptions,
}
