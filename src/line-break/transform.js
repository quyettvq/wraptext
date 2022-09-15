let fs = require('fs');

let data = fs.readFileSync('./LineBreak.txt', 'utf-8');

let lines = data
    .split(/\r\n|\n|\r/)
    .map(line => line.trim())
    .filter(line => line !== '' && !line.startsWith('#'))
    .map(line => line.split('#', 1)[0].trim());

let json = Object.create(null);

lines.forEach(line => {
    let [code, lbc] = line.split(';');
    let codes = json[lbc];
    if (codes === undefined) {
        json[lbc] = [code];
    } else {
        codes.push(code);
    }
});

let keys = Object.keys(json);
keys.sort();

let numCode = {};
for (let lbc of keys) {
    let src = json[lbc];
    
    let points = [];
    let ranges = [];

    for (let i = 0; i < src.length; i++) {
        let item = src[i];
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

    let pointCompacts = [];
    let rangeCompacts = [];

    let nextPoint = 0;
    for (let i = points.length - 1; i >= 0; i--) {
        let point = points[i];
        pointCompacts.unshift(point - nextPoint);
        nextPoint = point;
    }

    let nextEnd = 0;
    for (let i = ranges.length - 1; i >= 0; i--) {
        let [start, end] = ranges[i];
        rangeCompacts.unshift(start - nextEnd);
        rangeCompacts.unshift(end - start);
        nextEnd = end;
    }

    numCode[lbc] = [pointCompacts, rangeCompacts];
}

let jsCode = `/**
 *
 * LineBreak
 * @source: https://www.unicode.org/Public/UCD/latest/ucd/LineBreak.txt
 */
export default ${JSON.stringify(numCode).replace(/"/g, '')};
`;

fs.writeFileSync('./LineBreak.js', jsCode, {encoding: 'utf-8'});
