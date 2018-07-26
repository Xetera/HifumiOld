import setInvites from "./_setInvites";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";

export const command: Command = new Command(
    {
        names: ['invitefilter', 'ifilter'],
        info: 'Toggles my filter settings for invites',
        usage: "{{prefix}}invitefilter { 'on' | 'off' } ",
        examples: ['{{prefix}}invitefilter off'],
        category: 'Settings',
        expects: [{type: ArgType.Boolean}],
        run: setInvites,
        userPermissions: UserPermissions.Moderator,
        clientPermissions: ['MANAGE_MESSAGES']
    }
);
