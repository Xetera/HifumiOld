import {GuildMember} from "discord.js";

export namespace PermissionUtils {
    export const canModerate = (member1: GuildMember, member2: GuildMember) => {
        return member1.highestRole.comparePositionTo(member2.highestRole) > 0 || member1.guild.ownerID === member1.id;
    };
    export const isGuildOwner = (member: GuildMember) => {
        return member.guild.ownerID === member.id;
    };
}
