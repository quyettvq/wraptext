import {Infinity} from './constants.js';

let normalizeTypographyOptions = (options, userOptions) => {
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

let normalizeWrappingOptions = (options, userOptions) => {
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

export {
    normalizeTypographyOptions,
    normalizeWrappingOptions,
};
