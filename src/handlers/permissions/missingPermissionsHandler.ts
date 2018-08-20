import {Channel, GuildMember, RichEmbed, TextChannel} from "discord.js";
import {isMissingMessagingPermissions} from "../../utility/Util";
import {debug} from "../../utility/Logging";
import safeSendMessage from "../safe/SafeSendMessage";
import {missingPermissionsEmbed} from "../../embeds/permissions";

/**
 * Checks and handles the missing talk permission for text channels
 * @param {GuildMember} member
 * @param {Channel} targetChannel
 * @param {TextChannel} messageChannel
 * @returns {boolean} - true if lacking permissions, false if not
 */
export default function hasMessagingPermissions(member: GuildMember, targetChannel: Channel, messageChannel: TextChannel): boolean {
    const missingPermissions = isMissingMessagingPermissions(member, targetChannel);
    if (missingPermissions) {
        const embed: RichEmbed = missingPermissionsEmbed(targetChannel, missingPermissions, true);
        if (messageChannel instanceof TextChannel){
            safeSendMessage(messageChannel, embed);
        }
        else {
            debug.error(`Could not send permissions warning embed to ${messageChannel}, not a text channel.`);
        }
        return false;
    }
    return true;
}
