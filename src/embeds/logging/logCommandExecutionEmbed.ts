import { GuildMember, RichEmbed, TextChannel} from "discord.js";

export default function logCommandExecutionEmbed(member: GuildMember, channel: TextChannel, command: string){
    return new RichEmbed()
        .setColor(`#c6eaff`)
        .setDescription(`${member} invoked the stealth command **${command}** in ${channel}`);
}
