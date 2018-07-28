import {gb} from "../../misc/Globals";

export default function getInvite(){
    const bot = gb.bot;
    const selfId = bot.user.id;
    /* currently using custom permissions with
    Read Messages
    Send Messages
    Manage Messages
    Manage Roles
    Add Reactions
    Ban Members
    View Channel
    Change Nickname
    ?Manage Nicknames
     */
    return `https://discordapp.com/oauth2/authorize?client_id=${selfId}&scope=bot&permissions=335555652`;
}
