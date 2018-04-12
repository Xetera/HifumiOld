import {Database} from "../../database/Database";
import {Channel, Message, TextChannel} from "discord.js";
import {runtimeErrorResponses} from "../../interfaces/Replies";
import {random} from "../../utility/Util";
import {debug} from '../../utility/Logging'
import hasMessagingPermissions from "../../handlers/permissions/missingPermissionsHandler";

export default function setLogsChannel(message: Message, db: Database){
    const channel = message.channel;
    const guildId = message.guild.id;
    if (channel instanceof TextChannel){
        const returnedChannel: Channel = channel.guild.channels.find('id', channel.id);

        db.updateLogsChannel(guildId, channel.id).then((channelId : string) => {
            if (returnedChannel instanceof TextChannel){
                channel.send(`Set ${returnedChannel} as the default logging channel.`);
            }
        }).catch(err => {
            debug.error(`Error while trying to set logs channel\n` + err, 'setWelcomeChannel');
            channel.send(random(runtimeErrorResponses));
        })
    }
}
