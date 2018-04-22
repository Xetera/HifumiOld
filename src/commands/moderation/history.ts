import {GuildMember, Message, User} from "discord.js";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {INote} from "../../database/TableTypes";
import gb from "../../misc/Globals";
import historyEmbed from "../../embeds/commands/historyEmbed";
import {debug} from "../../utility/Logging";
import {Note} from "../../database/models/note";

export default async function getHistory(message: Message, args: string[]){
    if (!args.length){
        return void await handleInvalidParameters(
            message.channel, 'history'
        )
    }
    let targetMember: string | undefined;
    const userInput = args.shift()!;
    const mentions = message.mentions.members.first();

    if (mentions){
        targetMember = mentions.id;
    }
    else {
        targetMember = userInput;
    }

    if (!targetMember){
        return void handleFailedCommand(
            message.channel , `Could not find user ${userInput}`
        )
    }
    const placeholder = <Message> await message.channel.send(`Fetching user information...`);
    let userClass: GuildMember | User | undefined;
    userClass = message.guild.members.get(targetMember);
    if (!userClass)
        userClass = await message.client.fetchUser(targetMember);
    gb.instance.database.getNotes(targetMember, message.guild.id).then((notes: Note[]) => {
        placeholder.delete();
        message.channel.send(historyEmbed(userClass!, notes));
    }).catch(err => {
        placeholder.edit(`Uh, there was an error and I couldn't find that.`);
        debug.error(err.stack);
    })
}
