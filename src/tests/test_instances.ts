import 'mocha'
import {expect} from 'chai'
import * as Discord from "discord.js";
import CommandHandler from "../handlers/CommandHandler";
import {MessageQueue} from "../moderation/MessageQueue";
import {Database, DatabaseConfig, PostgresDevLoginConfig} from "../database/Database";
import {Alexa} from "../API/Alexa";
import {MuteQueue} from "../moderation/MuteQueue";
import {Instance} from "../misc/Globals";
import Watchlist from "../moderation/Watchlist";
import {getDatabaseConnection, getEnvironmentSettings, getTokens} from "../events/systemStartup";
import gb from "../misc/Globals";

let credentials = <PostgresDevLoginConfig>{};
credentials.user = 'postgres';
credentials.host = 'localhost';
credentials.port = 5432;
credentials.database = 'discord';

gb.ENV  = getEnvironmentSettings();

const [BOT_TOKEN, CLEVERBOT_TOKEN] : string[] = getTokens(gb.ENV);
const DATABASE_URL : DatabaseConfig = getDatabaseConnection(gb.ENV);

function createInstance(): Instance {
    // this is how we avoid scoping problems, a little ugly but
    // it gets the job done
    let bot =new Discord.Client();
    let alexa = new Alexa(CLEVERBOT_TOKEN);
    let database = new Database(DATABASE_URL, bot);
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
        // we don't want to modify our code to take in a string as well as message so
        // it's a lot easier to just cast it to a message
        const [command, args] = CommandHandler.parseInput(<Discord.Message> {content: "!command args args args"});
        expect(command).to.equal("command");
        expect(args.join(' ')).to.equal('args args args')
    });
});

describe('Alexa', function() {
    it('Setting clevertype emotion incorrectly', () => {
        expect(() => instances.alexa.setEmotion(101)).to.throw(RangeError);
    });
    it('Setting clevertype regard incorrectly', () => {
        expect(() => instances.alexa.setRegard(101)).to.throw(RangeError);
    });
    it('Setting clevertype engagement incorrectly', () => {
        expect(() => instances.alexa.setEngagement(101)).to.throw(RangeError);
    });
    it('Getting cleverbot response', function(done : MochaDone) {
        instances.alexa.say('hello').then((reply: any)=> {
            expect(reply).to.be.a('string');
            done();
        });
    });
    it('Clevertype correctly recording calls', () => {
        expect(instances.alexa.cleverbot.callAmount).to.equal(1);
    });

});
