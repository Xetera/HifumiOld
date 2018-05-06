import {Message} from "discord.js";
import {codeBlock} from "../../utility/Markdown";
import gb from "../../misc/Globals";

export default async function listGuilds(message: Message) {
    const guilds = await gb.instance.database.getGuilds();
    const rows = guilds.map(g => {
        const guild = gb.instance.bot.guilds.get(g.id);
        if (!guild) {
            return `GUILD [${g.id}] MISSING`
        }
        return `${guild.name} => ${guild.memberCount} members | ${g.cleverbot_calls} API calls`;
    });
    return message.channel.send(codeBlock(rows.join('\n')));
}
