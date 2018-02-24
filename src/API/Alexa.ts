import * as Discord from 'discord.js'
import {Cleverbot, Config, Mood} from 'clevertype'
import * as dbg from 'debug'

const debug = {
    silly   : dbg('Bot:Cleverbot:Silly'),
    info    : dbg('Bot:Cleverbot:Info'),
    warning : dbg('Bot:Cleverbot:Warning'),
    error   : dbg('Bog:Cleverbot:Error')
};

export class Alexa {
    cleverbot : Cleverbot;
    identifier : RegExp = /alexa/i;

    constructor(apiKey : string){
        this.cleverbot = new Cleverbot(apiKey);
        debug.info('Cleverbot module is ready');
    }

    private replaceKeyword(phrase : string) : string {
        return phrase.replace(this.identifier, 'cleverbot');
    }

    public setEmotion(mood : number){
        this.cleverbot.setEmotion(mood);
    }

    public setEngagement(mood : number ) : void {
        this.cleverbot.setEngagement(mood);
    }

    public setRegard(mood : number ) : void {
        this.cleverbot.setRegard(mood);
    }

    public checkMessage(message : Discord.Message, bot :Discord.Client) {
        let alexaRequest = message.content.match(/alexa/i);
        if (message.channel instanceof Discord.TextChannel){
            if (message.channel.name === 'chat-with-alexa' || alexaRequest || message.isMentioned(bot.user)) {
                // don't respond to messages not meant for me
                if (message.mentions.users.array().length !== 0 && !message.isMentioned(bot.user)) return;
                else if (message.content.startsWith('-')) return;

                debug.info(`${message.member.nickname || message.author.username} from guild ${message.member.guild} mentioned me in ${message.channel.name}`);
                message.react('👀');
                let response : string;

                if (message.channel.name === 'chat-with-alexa')
                    this.say(message.content, false).then((resp : string) => {
                    message.channel.send(resp);
                });
                else
                    this.say(message.content).then((resp : string) => {
                    message.channel.send(resp);
                });
            }
        }

    }
    public say(phrase : string, replaceKeyword : boolean = true) : Promise<string>{
        const that = this;
        return new Promise<string>(function (resolve, reject) {
            let parsedArg :string;
            if (replaceKeyword)
                parsedArg = that.replaceKeyword(phrase);
            else
                parsedArg = phrase;
            that.cleverbot.say(parsedArg).then((response : string) => {
                resolve(response);
            }).catch(err => {
                reject(err);
            });
        });
    }

    public getMood(){
        return this.cleverbot.mood;
    }
}