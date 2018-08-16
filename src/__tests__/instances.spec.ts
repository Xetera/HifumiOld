import {setupEnvironment, setupProcess} from "../events/systemStartup";
import TokenBucket from "../moderation/TokenBucket";
import {MuteQueue} from "../moderation/MuteQueue";
import Tracklist from "../moderation/Tracklist";

process.env.ENV = 'DEVELOPMENT';


test('Pre-startup setup should execute', () => {
    expect(() => {
        setupEnvironment();
        setupProcess();
    }).not.toThrow(Error)
});

test('Instances should start up properly', () => {
    expect(() => new TokenBucket()).not.toThrow();
    expect(() => new MuteQueue()).not.toThrow();
    expect(() => new Tracklist()).not.toThrow();
});
