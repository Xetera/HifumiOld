import 'mocha'
/*
let credentials = <PostgresDevLoginConfig>{};
credentials.user = 'postgres';
credentials.host = 'localhost';
credentials.port = 5432;
credentials.database = 'discord';

gb.ENV  = setupEnvironment();

const [BOT_TOKEN, CLEVERBOT_TOKEN] : string[] = getTokens(gb.ENV);
const DATABASE_URL : string = getDatabaseConnection(gb.ENV);

function createInstance(): Instance {
    // this is how we avoid scoping problems, a little ugly but
    // it gets the job done
    let bot =new Discord.Client();
    let hifumi = new Cleverbot(CLEVERBOT_TOKEN);
    let database = new Database(DATABASE_URL);
    let muteQueue = new MuteQueue();
    let trackList = new Tracklist();
    let messageQueue = new MessageQueue(muteQueue, database, trackList);
    let commandHandler = new CommandHandler();
    let heroku = new Heroku();
    return {
        bot: bot,
        hifumi: hifumi,
        muteQueue: muteQueue,
        database: database,
        messageQueue: messageQueue,
        commandHandler:commandHandler,
        trackList: trackList,
        heroku:
        eval: (params: CommandParameters, message: Message, x : any) => eval(x)
    }
}

const instances = createInstance();

describe('Handling commands', () => {
    it('Should be parsing input properly', () => {
        // we don't want to modify our code to take in a string as well as message so
        // it's a lot easier to just cast it to a message
        //const [command, args] = CommandHandler.parseInput(<Discord.Message> {content: "!command args args args"});
        //expects(command).to.equal("command");
        //expects(args.join(' ')).to.equal('args args args')
    });
});

describe('Cleverbot', function() {
    it('Error on setting clevertype emotion incorrectly', () => {
        expects(() => instances.hifumi.setEmotion(101)).to.throw(RangeError);
    });
    it('Error on setting clevertype regard incorrectly', () => {
        expects(() => instances.hifumi.setRegard(101)).to.throw(RangeError);
    });
    it('Error on setting clevertype engagement incorrectly', () => {
        expects(() => instances.hifumi.setEngagement(101)).to.throw(RangeError);
    });
    this.timeout(20000);
    it('Getting cleverbot response', function(done : MochaDone) {
        instances.hifumi.say('hello').then((reply: any)=> {
            expects(reply).to.be.a('string');
            done();
        })
    }).timeout(20000);
    it('Clevertype correctly recording calls', () => {
        expects(instances.hifumi.cleverbot.callAmount).to.equal(1);
    });
});
*/
