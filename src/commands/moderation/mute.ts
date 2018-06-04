import {Message, GuildMember} from "discord.js";
import gb from "../../misc/Globals";
import moment = require("moment");
import {formattedTimeString} from "../../utility/Util";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";

/**
 * Mutes the user a certain duration
 * @param {Message} message
 * @param {any[]} input
 */
export default async function muteUser(message: Message, input: [GuildMember, number, string]) {
    const [member, duration, reason] = input;

    // controlling for edge cases
    if (duration == 0 || typeof duration !== 'number' || isNaN(duration)) {
        return void await handleFailedCommand(
            message.channel, `Got **${duration}** when I was expecting a number in minutes.`
        );
    }
    else if (member === message.guild.me){
        return void await handleFailedCommand(
            message.channel, `Rude... If you want me to be quiet just don't talk to me.`
        )
    }
    else if (member.hasPermission('ADMINISTRATOR')){
        return void await handleFailedCommand(
            message.channel,
            `Muting an admin huh? Someone's about to get really mad at you.\n` +
            `Besides, permission overrides don't work for administrators.`
        )
    }
    else if(duration > 24 * 60){
        return void await handleFailedCommand(
            message.channel, `I currently can't mute people for longer than 1 day.`
        );
    }
    else if (!message.guild.roles.find('name', 'muted')){
        return handleFailedCommand(message.channel, `There's no mute role in the server called 'muted'`);
    }

    // message.channel.send returns (Message|Message[]), typeguards guarantee Message here
    const placeholder = <Message> await message.channel.send(`Working on it...`);

    const unmuteDate = moment(new Date()).add(duration, 'm').toDate();

    gb.instance.muteQueue.add(
        member,
        message.member,
        unmuteDate,
        reason,
        duration * 60 /* duration is in seconds */
    ).then(res => {
        // editing the "Please wait" message we sent earlier on completion
        return placeholder.edit(`Muted ${member.user.username} for ${formattedTimeString(duration * 60)}`);
    }).then(x => x.delete(30000));
}
