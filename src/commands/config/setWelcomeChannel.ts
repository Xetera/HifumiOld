import {Database} from "../../database/Database";
import {Channel, Message, TextChannel} from "discord.js";
import {runtimeErrorResponses} from "../../interfaces/Replies";
import {random} from "../../utility/Util";
import {debug} from '../../utility/Logging'
import setConfigChannelEmbed from "../../embeds/commands/configEmbed/setConfigChannelEmbed";

export default function setWelcome(message : Message, db : Database){
    const channel = message.channel;
    const guildId = message.guild.id;
    if (channel instanceof TextChannel){
        db.updateWelcomeChannel(guildId, channel.id).then((channelId : string) => {
            const returnedChannel: Channel = channel.guild.channels.find('id', channelId);

            if (returnedChannel instanceof TextChannel){
                channel.send(setConfigChannelEmbed(message.channel, 'welcome'));
            }
        }).catch(err => {
            debug.error(`Error while trying to set welcome channel\n` + err, 'setWelcomeChannel');
            channel.send(random(runtimeErrorResponses));
        })
    }
}
