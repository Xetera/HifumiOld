import {Database} from "../../database/Database";
import {Channel, Message, TextChannel} from "discord.js";
import {runtimeErrorResponses} from "../../handlers/Replies";
import {randChoice} from "../../utility/Util";

export default function setDefaultChannel(message : Message, db : Database){
    const channel = message.channel;
    const guildId = message.guild.id;
    if (channel instanceof TextChannel){
        db.updateDefaultChannel(guildId, channel.id).then((channelId : string) => {
            const returnedChannel: Channel = channel.guild.channels.find('id', channelId);

            if (returnedChannel instanceof TextChannel){
                channel.send(`Set ${returnedChannel} as default channel.`);
            }
        }).catch(err => {
            channel.send(randChoice(runtimeErrorResponses));
        })
    }
}