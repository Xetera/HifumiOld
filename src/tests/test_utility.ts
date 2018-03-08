import {formatTime, randBool, random} from "../utility/Util";
import {expect} from 'chai'
import {isBoolean} from "util";
import {codeBlock} from "../utility/Markdown";
import * as moment from "moment";

class testObj {
    test: string;
    id : number;
    constructor(test: string, id: number){
        this.test= test;
        this.id = id;
    }
}

const intArray : number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const objArray : testObj[] = [new testObj('1', 2), new testObj('2', 3), new testObj('4', 5)];
describe('utility', function(){
    it('Random on array', function(){
        expect(random(intArray)).to.be.oneOf(intArray);
        expect(random(intArray)).to.be.a('number');
    });
    it('Random on number range', function(){
        expect(random(0, 100)).to.be.within(0, 100);
        expect(random(0, 100)).to.be.a('number');
    });
    it('Random on objects', function(){
        expect(random(objArray)).to.be.oneOf(objArray);
        expect(random(objArray)).to.be.instanceof(testObj);
    });
    it('Random boolean', function () {
        expect(randBool()).to.satisfy((bool : any ) => isBoolean(bool));
    });
    it('Codeblock formatting', function () {
        expect(codeBlock(' hello ')).to.equal('\`\`\`\nhello\n\`\`\`');
    });
    it('Codeblock formatting with language', function() {
        expect(codeBlock('testing 🚫 unicode', 'css')).to.equal('\`\`\`css\ntesting 🚫 unicode\n\`\`\`');
    });
    it('Formatting time', function () {
        const startTime = moment(Date.now());
        const endTime = moment(Date.now()).add(90,'s');
        const delta = endTime.diff(startTime, 's');
        expect(formatTime(delta)).to.deep.equal({
            s: 30,
            m: 1,
            h: 0,
            d: 0
        });
    })
});