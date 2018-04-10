import {Message, GuildMember} from "discord.js";
import gb from "../../misc/Globals";
import moment = require("moment");
import {formattedTimeString} from "../../utility/Util";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";

/**
 *
 * @param {Message} message
 * @param {string[]} args
 */
export default async function muteUser(message: Message, args: string[]) {
    if (args.length <3){
        return void handleInvalidParameters(message.channel, 'mute');
    }
    const userInput = args.shift()!;
    const mention = message.mentions.members.first();
    let member: GuildMember;
    if (!mention){
        const user: GuildMember | undefined = message.guild.members.get(userInput);
        if (!user){
            return void message.channel.send(handleFailedCommand(
                message.channel, `User ${userInput} was not found`
            ));
        }
        member = user;
    }
    else {
        member = mention;
    }
    const durationInput = args.shift()!;
    const duration = Number(durationInput);

    // edge cases
    if (duration == 0 || typeof duration !== 'number' || isNaN(duration)) {
        return void message.channel.send(handleFailedCommand(
            message.channel, `Got ${durationInput} when I was expecting a number in minutes.`
        ))
    }
    else if(duration > 24 * 60){
        return void message.channel.send(handleFailedCommand(
            message.channel, `I currently can't mute people for longer than 1 day.`
        ));
    }
    const placeholder = <Message> await message.channel.send(`Working on it...`);
    const reason = args.join(' ');

    const unmuteDate = moment(new Date()).add(duration, 'm').toDate();
    //const formattedDuration = formattedTimeString(duration * 60);
    gb.instance.muteQueue.add(
        member,
        message.member,
        unmuteDate,
        reason,
        duration * 60 /* duration is in seconds */
    ).then(res => {
        console.log(res);
        return placeholder.edit(`Muted ${member.user.username} for ${formattedTimeString(duration)}`);
    }).then(x => x.delete(30000));
}
