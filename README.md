# WrapText

## Installation

```
npm install @quyettvq/wraptext
```

Then, you can import as bellow:

```js
import {wrapText, measureText} from '@quyettvq/wraptext';
```

## APIs

### wrapText

```ts
export function wrapText(text: string, options?: {
    // The font properties you want to render the text with
    // It is the same with CanvasRenderingContext2D.font
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font
    font?: string,

    // The same with CSS font-kerning property
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font-kerning
    fontKerning?: 'auto' | 'normal' | 'none',

    // A multiple of the width of the space character to be used as the width of tabs
    // Must be non-negative
    // Default value is 8
    tabSize?: number,

    // The maximum width (in pixels) of every line of text
    // Default value is Infinity
    maxWidth?: number,

    // The maximum number of lines
    // Default value is Infinity
    maxLines?: number,

    // The character to display at the end of text when it is too long
    // to indicate that there are more text that are hidden
    // Default value is '…'
    etc?: string,

    // The empty space (in pixels) that takes place at the start of the first line
    // Default value is 0
    indent?: number,

    // The empty space (in pixels) that takes place at the end of the last line
    // This only be applied when the text exceeds the maximum number of lines
    // Default value is 0
    lastIndent?: number,

    // Do you want to collapse every newline characters in the source text or not?
    // Default value is 'collapse'
    newlines?: 'collapse' | 'preserve',

    // Control how to treat with white-space characters in a line
    // Default value is 'collapse'
    inlineSpaces?: 'collapse' | 'trim' | 'preserve',
}): {
    // An array of lines
    // Each line is an array of characters
    // It is not string or string[] to support some special use cases
    // such as drawing text on the canvas, letter spacing justification,...
    lines: string[][],

    // The font that is applied to measure the text
    // It might be different from your input font in case it is invalid
    font: string,
};
```

### measureText

```ts
export function measureText(text: string, options?: {
    font?: string,
    fontKerning?: 'auto' | 'normal' | 'none',
    tabSize?: number,
}): TextMetrics;
// https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
```

## Usage examples

### Wrap mixed content with max height

```js
import {wrapText, measureText} from '@quyettvq/wraptext';

function wrapAdContent({
    titleContent,
    titleFont,
    titleLineHeight,
    descriptionContent,
    descriptionFont,
    descriptionLineHeight,
    ctaContent,
    ctaFont,
    maxWidth,
    maxHeight,
    titleDescriptionGap,
}) {
    const titleMaxLines = Math.floor(maxHeight / titleLineHeight);
    
    const titleLines = wrapText(titleContent, {
        font: titleFont,
        maxWidth: maxWidth,
        maxLines: titleMaxLines,
    }).lines.map(t => t.join(''));

    const remainingHeight = maxHeight - titleLines.length * titleLineHeight;

    const descriptionMaxLines = Math.floor((remainingHeight - titleDescriptionGap) / descriptionLineHeight);

    let descriptionLines = [];

    if (descriptionMaxLines > 0) {
        const ctaWidth = measureText(ctaContent, {
            font: ctaFont,
        }).width;

        descriptionLines = wrapText(descriptionContent, {
            font: descriptionFont,
            maxWidth: maxWidth,
            maxLines: descriptionMaxLines,
            lastIndent: ctaWidth + 2, // Add 2px to deal with pixel manipulation of browsers
        }).lines.map(t => t.join(''));
    }

    return {
        title: titleLines.join('\n'),
        description: descriptionLines.join('\n'),
    };
}
```

If you want to render the output text into HTML elements,
it is safe to use `white-space: pre` in your CSS.
The browser may produce different results in some edge cases.
You know, different browsers also produce different results in some cases.
Even the [Unicode line breaking algorithm](http://unicode.org/reports/tr14/#Algorithm) has changed some times,
and also some rules are tailorable, so it is ok to not to be exact the same result with browsers.

## Editions

There are three editions: base, unicode (default), noKern (no font-kerning support).

**base**:

- Line breaking logic only work with languages use the space character as a word separator
- Line fitting logic is good

```js
import {wrapText, measureText} from '@quyettvq/wraptext/base';
```

**unicode**:

- Line breaking logic is good
- Line fitting logic is good

```js
import {wrapText, measureText} from '@quyettvq/wraptext/unicode';
```

**noKern**:

- Line breaking logic only work with languages use the space character as a word separator
- Line fitting logic does not consider font kerning

```js
import {wrapText, measureText} from '@quyettvq/wraptext/noKern';
```

Comparation:
- Quality: unicode > base > noKern
- File size: unicode (20kb) >>>> noKern ~ base (3.2kb)
- Performance: noKern >> base > unicode

If you are dealing with languages that considers space characters make [line break opportunities](http://unicode.org/reports/tr14/#Definitions), you might want to use the **base** edition.

If you don't worry about the file size, it is highly recommended to use the **unicode** version to support all languages.

## Demos

Install http-server for the first time

```
npm install http-server -g
```

Start the server

```
cd node_modules/@quyettvq/wraptext
http-server
```

Your demos now available here: http://localhost:8080/sandbox/
