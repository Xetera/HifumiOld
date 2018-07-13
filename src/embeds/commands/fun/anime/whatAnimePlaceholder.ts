import {GuildMember, RichEmbed} from "discord.js";
import {animePlaceholders} from "../../../../commands/fun/getAnime";
import {random} from "../../../../utility/Util";

export default function whatAnimePlaceholder(member: GuildMember, url: string, isGif: boolean){
    return new RichEmbed()
        .setAuthor(isGif ? `Looking up gif's first frame` : `Looking up image` , member.user.displayAvatarURL)
        .setDescription(random(animePlaceholders))
        .setImage(url)
        .setColor(`#80ffe0`)
        .setFooter(`This might take a little while, hold on tight.`)
}
