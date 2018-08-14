import {setupEnvironment, setupProcess} from "../events/systemStartup";
import {expect} from 'chai';

process.env.ENV = 'DEVELOPMENT';


test('Pre-startup setup should execute', () => {
    expect(() => {
        setupEnvironment();
        setupProcess();
    }).to.not.throw(Error)
});
