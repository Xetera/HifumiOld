import 'mocha'
import {expect} from 'chai'
import * as Discord from "discord.js";
import CommandHandler from "../handlers/CommandHandler";
import {MessageQueue} from "../moderation/MessageQueue";
import {Database, PostgresDevLoginConfig} from "../database/Database";
import {Alexa} from "../API/Alexa";
import {MuteQueue} from "../moderation/MuteQueue";
import {Instance} from "../misc/Globals";
import {default as Watchlist} from "../moderation/Watchlist";

let credentials = <PostgresDevLoginConfig>{};
credentials.user = 'postgres';
credentials.host = 'localhost';
credentials.port = 5432;
credentials.database = 'discord';

function createInstance(): Instance {
    // this is how we avoid scoping problems, a little ugly but
    // it gets the job done
    let bot =new Discord.Client();
    let alexa = new Alexa(require('../../config0.json').CleverBotAPI);
    let database = new Database(credentials);
    let muteQueue = new MuteQueue(database);
    let watchlist = new Watchlist();
    let messageQueue = new MessageQueue(muteQueue, database, watchlist);
    let commandHandler = new CommandHandler();
    return {
        bot: bot,
        alexa: alexa,
        muteQueue: muteQueue,
        database: database,
        messageQueue: messageQueue,
        commandHandler:commandHandler,
        watchlist: watchlist
    }
}

const instances = createInstance();

describe('Handling commands', () => {
    it('Should be parsing input properly', () => {
        const [command, args] = CommandHandler.parseInput(<Discord.Message> {content: "!command args args args"});
        expect(command).to.equal("command");
        expect(args.join(' ')).to.equal('args args args')
    });
});

describe('Alexa', function() {
    this.timeout(5000);
    it('Getting cleverbot response', function(done : MochaDone) {
        instances.alexa.say('hello').then((reply:string)=> {
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
    });
});