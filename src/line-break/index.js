import data from './LineBreak.js';

let dataReady = false;

function ensureDataReady() {
    if (dataReady) {
        return;
    }

    for (let lineBreakClass in data) {
        if (data.hasOwnProperty(lineBreakClass)) {
            const [pointCompacts, rangeCompacts] = data[lineBreakClass];
            const pointSet = new Set();

            let nextPoint = 0;
            for (let i = pointCompacts.length; --i >= 0; ) {
                nextPoint += pointCompacts[i];
                pointSet.add(nextPoint);
            }

            let nextEnd = 0;
            for (let i = rangeCompacts.length - 1; i >= 0; i -= 2) {
                const start = rangeCompacts[i] + nextEnd;
                nextEnd = rangeCompacts[i - 1] + start;
                // end === nextEnd

                for (let point = nextEnd + 1; --point >= start; ) {
                    pointSet.add(point);
                }
            }

            data[lineBreakClass] = pointSet;
        }
    }

    dataReady = true;
}

function cc(charCode, lineBreakClass) {
    return data[lineBreakClass].has(charCode);
}

function mc(charCode, lineBreakClassList) {
    for (let i = 0; i < lineBreakClassList.length; i++) {
        if (data[lineBreakClassList[i]].has(charCode)) {
            return true;
        }
    }
    return false;
}

export {
    ensureDataReady,
    cc,
    mc,
}
