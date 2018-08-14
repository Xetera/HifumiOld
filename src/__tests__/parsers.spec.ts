import {expect} from "chai";
import {parseMacro} from "../parsers/parseMacro";
import templateParser from "../parsers/templateParser";
import {TemplatedMessage} from "../parsers/parsers.interface";


test('Macro parser should identify urls', async () => {
    const macro = 'example text http://cdn.hifumi.io/wqoybeB6Q.png';
    const [text, links] = await parseMacro(macro);

    expect(text).to.equal('example text');
    expect(links).to.be.an('array');
    expect(links![0]).to.equal('http://cdn.hifumi.io/wqoybeB6Q.png');
});

test('Template parser should be identifying fields', () => {
    const templates = ['testfield', 'specfield'];
    const input = '%testfield% testvalue %specfield% specvalue';
    const template = <TemplatedMessage> templateParser(templates, input);

    expect(template).to.be.an('object').but.not.a('string');
    expect(template['testfield']).to.equal('testvalue');
    expect(template['specfield']).to.equal('specvalue');
});
