import {formatTime, getUrlExtension, getYesNo, randBool, random} from "../utility/Util";
import {isBoolean} from "util";
import {codeBlock} from "../utility/Markdown";
import * as moment from "moment";

class TestObject {
    test: string;
    id: number;

    constructor(test: string, id: number) {
        this.test = test;
        this.id = id;
    }
}

const intArray: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const objArray: TestObject[] = [new TestObject('1', 2), new TestObject('2', 3), new TestObject('4', 5)];

test('Random on array', function () {
    expect(intArray).toContain(random(intArray));
    expect(typeof random(intArray)).toBe('number');
});

test('Random on number range', function () {
    const num = random(0, 100);
    expect(num).toBeGreaterThan(0);
    expect(num).toBeLessThanOrEqual(100);
    expect(typeof num).toBe('number');
});

test('Random on objects', function () {
    expect(typeof random(objArray)).toBe('object');
    expect(random(objArray)).toBeInstanceOf(TestObject)
});

test('Random boolean', function () {
    expect(isBoolean(randBool())).toBeTruthy();
});

test('Codeblock formatting', function () {
    expect(codeBlock(' hello ')).toEqual('\`\`\`\nhello\n\`\`\`');
});

test('Codeblock formatting with language', function () {
    expect(codeBlock('testing 🚫 unicode', 'css')).toEqual('\`\`\`css\ntesting 🚫 unicode\n\`\`\`');
});

test('Formatting time', function () {
    const startTime = moment(Date.now());
    const endTime = moment(Date.now()).add(90, 's');
    const delta = endTime.diff(startTime, 's');
    expect(formatTime(delta)).toEqual({
        s: 30,
        m: 1,
        h: 0,
        d: 0
    });
});

test('Getting yes/no input', () => {
    expect(getYesNo('yes')).toBeTruthy();
    expect(getYesNo('no')).toBeFalsy();
    expect(getYesNo('asdakf')).toBeFalsy()
});

test('Getting extensions from urls', () => {
    expect(
        getUrlExtension('http://cdn.hifumi.io/image.png')
    ).toBe('png');
    expect(
        getUrlExtension('invalid.url')
    ).toBeFalsy();
    expect(
        getUrlExtension(
            'https://cdn.discordapp.com/' +
            'attachments/id/id/name.png')
    ).toBe('png');
});
