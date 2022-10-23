# WrapText

Wrap text to fit a box with limitations of width and height (in pixels).
Supports Unicode and non-monospace fonts.

## Installation

```
npm install wraptext.js
```

Then, you can import as bellow:

```js
import {wrapText, measureText} from 'wraptext.js';
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

## Examples

### Basic usage

```js
import {wrapText} from 'wraptext.js';

function testWrapText(text) {
    const lines = wrapText(text, {
        font: 'bold 14px Arial, sans-serif',
        maxWidth: 400, // px
    }).lines.map(t => t.join(''));

    return lines.join('\n');
}

// English

testWrapText(`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`);

/** Output **
Lorem Ipsum is simply dummy text of the printing and
typesetting industry. Lorem Ipsum has been the industry's
standard dummy text ever since the 1500s, when an
unknown printer took a galley of type and scrambled it to
make a type specimen book. It has survived not only five
centuries, but also the leap into electronic typesetting,
remaining essentially unchanged. It was popularised in the
1960s with the release of Letraset sheets containing Lorem
Ipsum passages, and more recently with desktop
publishing software like Aldus PageMaker including
versions of Lorem Ipsum.
*/

// Tiếng Việt (Vietnamese)

testWrapText(`Lorem Ipsum chỉ đơn giản là một đoạn văn bản giả, được dùng vào việc trình bày và dàn trang phục vụ cho in ấn. Lorem Ipsum đã được sử dụng như một văn bản chuẩn cho ngành công nghiệp in ấn từ những năm 1500, khi một họa sĩ vô danh ghép nhiều đoạn văn bản với nhau để tạo thành một bản mẫu văn bản. Đoạn văn bản này không những đã tồn tại năm thế kỉ, mà khi được áp dụng vào tin học văn phòng, nội dung của nó vẫn không hề bị thay đổi. Nó đã được phổ biến trong những năm 1960 nhờ việc bán những bản giấy Letraset in những đoạn Lorem Ipsum, và gần đây hơn, được sử dụng trong các ứng dụng dàn trang, như Aldus PageMaker.`);

/** Output **
Lorem Ipsum chỉ đơn giản là một đoạn văn bản giả, được
dùng vào việc trình bày và dàn trang phục vụ cho in ấn.
Lorem Ipsum đã được sử dụng như một văn bản chuẩn cho
ngành công nghiệp in ấn từ những năm 1500, khi một họa
sĩ vô danh ghép nhiều đoạn văn bản với nhau để tạo thành
một bản mẫu văn bản. Đoạn văn bản này không những đã
tồn tại năm thế kỉ, mà khi được áp dụng vào tin học văn
phòng, nội dung của nó vẫn không hề bị thay đổi. Nó đã
được phổ biến trong những năm 1960 nhờ việc bán những
bản giấy Letraset in những đoạn Lorem Ipsum, và gần đây
hơn, được sử dụng trong các ứng dụng dàn trang, như
Aldus PageMaker.
*/

// 中文简体 (Chinese)

testWrapText(`Lorem Ipsum，也称乱数假文或者哑元文本， 是印刷及排版领域所常用的虚拟文字。由于曾经一台匿名的打印机刻意打乱了一盒印刷字体从而造出一本字体样品书，Lorem Ipsum从西元15世纪起就被作为此领域的标准文本使用。它不仅延续了五个世纪，还通过了电子排版的挑战，其雏形却依然保存至今。在1960年代，”Leatraset”公司发布了印刷着Lorem Ipsum段落的纸张，从而广泛普及了它的使用。最近，计算机桌面出版软件”Aldus PageMaker”也通过同样的方式使Lorem Ipsum落入大众的视野。`);

/** Output **
Lorem Ipsum，也称乱数假文或者哑元文本， 是印刷及排版领域
所常用的虚拟文字。由于曾经一台匿名的打印机刻意打乱了一盒
印刷字体从而造出一本字体样品书，Lorem Ipsum从西元15世纪
起就被作为此领域的标准文本使用。它不仅延续了五个世纪，还
通过了电子排版的挑战，其雏形却依然保存至今。在1960年
代，”Leatraset”公司发布了印刷着Lorem Ipsum段落的纸张，
从而广泛普及了它的使用。最近，计算机桌面出版软件”Aldus
PageMaker”也通过同样的方式使Lorem Ipsum落入大众的视
野。
*/

// Pyccкий (Russian)

testWrapText(`Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн. Его популяризации в новое время послужили публикация листов Letraset с образцами Lorem Ipsum в 60-х годах и, в более недавнее время, программы электронной вёрстки типа Aldus PageMaker, в шаблонах которых используется Lorem Ipsum.`);

/** Output **
Lorem Ipsum - это текст-"рыба", часто используемый в
печати и вэб-дизайне. Lorem Ipsum является
стандартной "рыбой" для текстов на латинице с начала
XVI века. В то время некий безымянный печатник
создал большую коллекцию размеров и форм шрифтов,
используя Lorem Ipsum для распечатки образцов. Lorem
Ipsum не только успешно пережил без заметных
изменений пять веков, но и перешагнул в электронный
дизайн. Его популяризации в новое время послужили
публикация листов Letraset с образцами Lorem Ipsum в
60-х годах и, в более недавнее время, программы
электронной вёрстки типа Aldus PageMaker, в шаблонах
которых используется Lorem Ipsum.
*/

// हिन्दी (Hindi)

testWrapText(`Lorem Ipsum छपाई और अक्षर योजन उद्योग का एक साधारण डमी पाठ है. Lorem Ipsum सन १५०० के बाद से अभी तक इस उद्योग का मानक डमी पाठ मन गया, जब एक अज्ञात मुद्रक ने नमूना लेकर एक नमूना किताब बनाई. यह न केवल पाँच सदियों से जीवित रहा बल्कि इसने इलेक्ट्रॉनिक मीडिया में छलांग लगाने के बाद भी मूलतः अपरिवर्तित रहा. यह 1960 के दशक में Letraset Lorem Ipsum अंश युक्त पत्र के रिलीज के साथ लोकप्रिय हुआ, और हाल ही में Aldus PageMaker Lorem Ipsum के संस्करणों सहित तरह डेस्कटॉप प्रकाशन सॉफ्टवेयर के साथ अधिक प्रचलित हुआ.`);

/** Output **
Lorem Ipsum छपाई और अक्षर योजन उद्योग का एक साधारण डमी
पाठ है. Lorem Ipsum सन १५०० के बाद से अभी तक इस उद्योग का
मानक डमी पाठ मन गया, जब एक अज्ञात मुद्रक ने नमूना लेकर एक
नमूना किताब बनाई. यह न केवल पाँच सदियों से जीवित रहा बल्कि
इसने इलेक्ट्रॉनिक मीडिया में छलांग लगाने के बाद भी मूलतः
अपरिवर्तित रहा. यह 1960 के दशक में Letraset Lorem Ipsum अंश
युक्त पत्र के रिलीज के साथ लोकप्रिय हुआ, और हाल ही में Aldus
PageMaker Lorem Ipsum के संस्करणों सहित तरह डेस्कटॉप
प्रकाशन सॉफ्टवेयर के साथ अधिक प्रचलित हुआ.
*/

// ქართული (Georgian)

testWrapText(`Lorem Ipsum საბეჭდი და ტიპოგრაფიული ინდუსტრიის უშინაარსო ტექსტია. იგი სტანდარტად 1500-იანი წლებიდან იქცა, როდესაც უცნობმა მბეჭდავმა ამწყობ დაზგაზე წიგნის საცდელი ეგზემპლარი დაბეჭდა. მისი ტექსტი არამარტო 5 საუკუნის მანძილზე შემორჩა, არამედ მან დღემდე, ელექტრონული ტიპოგრაფიის დრომდეც უცვლელად მოაღწია. განსაკუთრებული პოპულარობა მას 1960-იან წლებში გამოსულმა Letraset-ის ცნობილმა ტრაფარეტებმა მოუტანა, უფრო მოგვიანებით კი — Aldus PageMaker-ის ტიპის საგამომცემლო პროგრამებმა, რომლებშიც Lorem Ipsum-ის სხვადასხვა ვერსიები იყო ჩაშენებული.`);

/** Output **
Lorem Ipsum საბეჭდი და ტიპოგრაფიული ინდუსტრიის
უშინაარსო ტექსტია. იგი სტანდარტად 1500-იანი წლებიდან
იქცა, როდესაც უცნობმა მბეჭდავმა ამწყობ დაზგაზე წიგნის
საცდელი ეგზემპლარი დაბეჭდა. მისი ტექსტი არამარტო 5
საუკუნის მანძილზე შემორჩა, არამედ მან დღემდე,
ელექტრონული ტიპოგრაფიის დრომდეც უცვლელად
მოაღწია. განსაკუთრებული პოპულარობა მას 1960-იან
წლებში გამოსულმა Letraset-ის ცნობილმა ტრაფარეტებმა
მოუტანა, უფრო მოგვიანებით კი — Aldus PageMaker-ის
ტიპის საგამომცემლო პროგრამებმა, რომლებშიც Lorem
Ipsum-ის სხვადასხვა ვერსიები იყო ჩაშენებული.
*/
```

### Wrap mixed content with max height

```js
import {wrapText, measureText} from 'wraptext.js';

function wrapPostContent({
    titleContent,
    titleFont,
    titleLineHeight,
    descriptionContent,
    descriptionFont,
    descriptionLineHeight,
    seeMoreText,
    seeMoreFont,
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
        const seeMoreWidth = measureText(seeMoreText, {
            font: seeMoreFont,
        }).width;

        descriptionLines = wrapText(descriptionContent, {
            font: descriptionFont,
            maxWidth: maxWidth,
            maxLines: descriptionMaxLines,
            lastIndent: seeMoreWidth + 2, // Add 2px to deal with pixel manipulation of browsers
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
import {wrapText, measureText} from 'wraptext.js/base';
```

**unicode**:

- Line breaking logic is good
- Line fitting logic is good

```js
import {wrapText, measureText} from 'wraptext.js/unicode';
```

**noKern**:

- Line breaking logic only work with languages use the space character as a word separator
- Line fitting logic does not consider font kerning

```js
import {wrapText, measureText} from 'wraptext.js/noKern';
```

Comparation:
- Quality: unicode > base > noKern
- File size: unicode (20kb) >>>> noKern ~ base (3.2kb)
- Performance: noKern >> base > unicode

If you are dealing with languages that considers space characters make [line break opportunities](http://unicode.org/reports/tr14/#Definitions), you might want to use the **base** edition.

If you don't worry about the file size, it is highly recommended to use the **unicode** version to support all languages.
