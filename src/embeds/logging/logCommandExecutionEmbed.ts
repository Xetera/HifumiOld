import {GuildMember, RichEmbed} from "discord.js";

export default function logCommandExecutionEmbed(member: GuildMember, command: string){
    return new RichEmbed()
        .setColor(`#c6eaff`)
        .setDescription(`${member} invoked the command **${command}**`);
}
