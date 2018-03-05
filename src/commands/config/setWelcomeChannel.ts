import {Database} from "../../database/Database";
import {Channel, Message, TextChannel} from "discord.js";
import {runtimeErrorResponses} from "../../handlers/Replies";
import {randChoice} from "../../utility/Util";
import {debug} from '../../utility/Logging'

export default function setWelcome(message : Message, db : Database){
    const channel = message.channel;
    const guildId = message.guild.id;
    if (channel instanceof TextChannel){
        db.updateWelcomeChannel(guildId, channel.id).then((channelId : string) => {
            const returnedChannel: Channel = channel.guild.channels.find('id', channelId);

            if (returnedChannel instanceof TextChannel){
                channel.send(`Set ${returnedChannel} as default channel.`);
            }
        }).catch(err => {
            debug.error(`Error while trying to set welcome channel\n` + err, 'setWelcomeChannel');
            channel.send(randChoice(runtimeErrorResponses));
        })
    }
}