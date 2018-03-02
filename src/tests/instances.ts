import 'mocha'
import {expect} from 'chai'
import * as Discord from "discord.js";
import CommandHandler from "../handlers/CommandHandler";
import {MessageQueue} from "../moderation/MessageQueue";
import {Database} from "../database/Database";
import {Alexa} from "../API/Alexa";
import {MuteQueue} from "../moderation/MuteQueue";
import {Instance} from "../misc/Globals";

const muteQueue    : MuteQueue      = new MuteQueue();

const instances = <Instance> {
    // otherwise    throws no-implicit-any exception
    alexa          : new Alexa(require('../../config0.json').CleverBotAPI),
    muteQueue      : muteQueue,
    messageQueue   : new MessageQueue(muteQueue),
    commandHandler : new CommandHandler()
};

describe('Handling commands', () => {
    it('Should be parsing input properly', () => {
        const [command, args] = CommandHandler.parseInput(<Discord.Message> {content: "!command args args args"});
        expect(command).to.equal("command");
        expect(args.join(' ')).to.equal('args args args')
    });
    it('Should bz')
});

describe('Alexa', function() {
    this.timeout(5000);
    it('Getting cleverbot response', function(done : MochaDone) {
        instances.alexa.say('hello').then(reply => {
            this.timeout(5000);
            expect(reply).to.be.a('string');
            done();
        });
    });
    it('Clevertype correctly recording calls', () => {
        expect(instances.alexa.cleverbot.callAmount).to.equal(1);
    });
    it('Clevertype setting mood properly', () => {
        instances.alexa
    })
});