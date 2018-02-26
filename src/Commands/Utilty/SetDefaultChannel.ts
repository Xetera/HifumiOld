import {Database} from "../../Database/Database";
import {Channel, TextChannel} from "discord.js";

export default function setDefaultChannel(guildId : string, channel : Channel, db : Database){
    if (channel instanceof TextChannel){
        db.updateDefaultChannel(guildId, channel.id).then((channelId : string) => {
            const returnedChannel: Channel = channel.guild.channels.find('id', channelId);
            if (returnedChannel instanceof TextChannel){
                channel.send(`Set ${returnedChannel} as default channel.`);
            }
        });
    }
}