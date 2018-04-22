import * as Discord from 'discord.js'
import {Cleverbot as Clevertype, Config, Mood} from 'clevertype'
import {debug} from '../utility/Logging'
import gb from "../misc/Globals";
import {Channel} from "discord.js";

export class Cleverbot {
    cleverbot : Clevertype;
    identifier : RegExp = /hifumi/i;

    constructor(apiKey : string){
        this.cleverbot = new Clevertype(apiKey, true);
        debug.info('Cleverbot module is ready', "Cleverbot");
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

    public async checkMessage(message : Discord.Message, bot :Discord.Client) : Promise<void> {
        let alexaRequest = message.content.match(this.identifier);
        if (!gb.instance.database.ready) {
            message.channel.send(`😰 give me some time to get set up first.`);
            return void debug.info(`Got message from ${message.guild.name} but the DB hasn't finished caching.`);
        }

        if (message.system || await gb.instance.database.getUserIgnore(message.member) || !(message.channel instanceof Discord.TextChannel))
            return;

        const chatChannelId = await gb.instance.database.getChatChannel(message.guild.id);

        if (message.channel.id === chatChannelId || alexaRequest || message.isMentioned(bot.user)) {
            // don't respond to messages not meant for me
            if (message.mentions.users.array().length !== 0 && !message.isMentioned(bot.user))
                return;
            else if (message.content.startsWith('-') || message.content.startsWith(await gb.instance.database.getPrefix(message.guild.id)))
                return;

            debug.info(
                `[${message.member.guild}]::${message.channel.name}::<${message.author.username}> cleverbot call`, "Cleverbot");
            message.react('👀');

                this.say(message.content, message.member.id).then((resp : string) => {
                gb.instance.database.incrementCleverbotCalls(message.guild.id);
                message.channel.send(resp);
            });
        }
    }

    public say(phrase : string, id: string, replaceKeyword : boolean = true) : Promise<string>{
        return new Promise<string>( (resolve, reject) => {
            let parsedArg :string;
            if (replaceKeyword)
                parsedArg = this.replaceKeyword(phrase);
            else
                parsedArg = phrase;
            this.cleverbot.say(parsedArg, id).then((response : string) => {
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
