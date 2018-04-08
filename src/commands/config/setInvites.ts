import {Message} from "discord.js";
import gb from "../../misc/Globals";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {getOnOff} from "../../utility/Util";

export default function setInvites(message: Message, args: string[]){
    if (!args.length){
        return void handleInvalidParameters(message.channel, 'checkinvites');
    }
    //invitefilter off -> allows_invites = on;
    const input = args.shift()!;
    const inputAllowed = !getOnOff(input);
    // state -> allow invites = true
    if (inputAllowed === undefined)
        return void handleInvalidParameters(message.channel, 'checkinvites');
    const allowed  = gb.instance.database.getInvitesAllowed(message.guild);

    if (!allowed && !inputAllowed){
        return void message.channel.send(`I'm already listening for all invites, no need to enable it again ${gb.emojis.get('alexa_all_good')}`)
    }

    else if (allowed && inputAllowed){
        return void message.channel.send(`I'm already not looking at invite links, you can send them whenever you like.`)
    }

    gb.instance.database.setInvitesAllowed(message.guild, inputAllowed).then(response => {
        message.channel.send(!response
            ? `Roger roger, I'll be removing all invites from non-admins now on!`
            : `Oh... OK, I turned off my invite checks. Everyone will be able to post invites now.`)
    })
}
