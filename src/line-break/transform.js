const fs = require('fs');

const data = fs.readFileSync('./LineBreak.txt', 'utf-8');

const lines = data
    .split(/\r\n|\n|\r/)
    .map(line => line.trim())
    .filter(line => line !== '' && !line.startsWith('#'))
    .map(line => line.split('#', 1)[0].trim());

const json = Object.create(null);

lines.forEach(line => {
    const [code, lbc] = line.split(';');
    const codes = json[lbc];
    if (codes === undefined) {
        json[lbc] = [code];
    } else {
        codes.push(code);
    }
});

const keys = Object.keys(json);
keys.sort();

const numCode = {};
for (let lbc of keys) {
    const src = json[lbc];
    
    const points = [];
    const ranges = [];

    for (let i = 0; i < src.length; i++) {
        const item = src[i];
        if (item.includes('..')) {
            ranges.push(item.split('..').map(t => parseInt(`0x${t}`)));
        } else {
            points.push(parseInt(`0x${item}`));
        }
    }

    // Sorting
    // direction: End -> Start
    points.sort((a, b) => b - a);
    ranges.sort((a, b) => b[0] - a[0]);

    const pointCompacts = [];
    const rangeCompacts = [];

    let nextPoint = 0;
    for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];
        pointCompacts.unshift(point - nextPoint);
        nextPoint = point;
    }

    let nextEnd = 0;
    for (let i = ranges.length - 1; i >= 0; i--) {
        const [start, end] = ranges[i];
        rangeCompacts.unshift(start - nextEnd);
        rangeCompacts.unshift(end - start);
        nextEnd = end;
    }

    numCode[lbc] = [pointCompacts, rangeCompacts];
}

const jsCode = `/**
 *
 * LineBreak
 * @source: https://www.unicode.org/Public/UCD/latest/ucd/LineBreak.txt
 */
export default ${JSON.stringify(numCode).replace(/"/g, '')};
`;

fs.writeFileSync('./LineBreak.js', jsCode, {encoding: 'utf-8'});
