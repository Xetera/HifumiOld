import {Guild, GuildMember} from "discord.js";
import gb from "../misc/Globals";


export default async function onGuildUpdate(oldGuild : Guild, newGuild : Guild){
    if (!await gb.instance.database.getGuildEnabled(newGuild.id)){
        return;
    }
}
