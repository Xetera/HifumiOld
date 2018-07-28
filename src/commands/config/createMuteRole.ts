import {Guild, Message, Role} from "discord.js";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";
import {gb} from "../../misc/Globals";
import resolveBooleanUncertainty from "../../resolvers/resolveBooleanUncertainty";
import {APIErrors} from "../../interfaces/Errors";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {debug} from "../../utility/Logging";

async function createMuteRole(guild: Guild, name: string = 'muted-by-hifumi'): Promise<Role> {
    const role = await guild.createRole({
        name: name,
        color: '#7c6666',
        hoist: false,
        position: guild.roles.size - 1,
        permissions: ["READ_MESSAGE_HISTORY", "READ_MESSAGES"],
    }).catch(err => {
        return Promise.reject(new Error(APIErrors.MISSING_PERMISSIONS))
    });

    await gb.database.setMuteRole(guild.id, role.id);
    return role;
}

async function run(message: Message, input: [(string | undefined)]): Promise<any> {
    //const [name] = input;
    let existingRole = await gb.database.getMuteRole(message.guild.id);
    if (!existingRole) {
        const prompt: string = `I could not find a mute role, would you like me to set one up automatically ` +
            `with the name ? '${input ? input : 'muted-by-hifumi'}' (you can set a custom role name by ` +
            `using the command again with the name you want)`;
        const confirmation = await resolveBooleanUncertainty(message, prompt, 20);
        if (!confirmation) {
            return;
        }

        let createdRole;

        try {
            createdRole = await createMuteRole(message.guild);
        } catch (err) {
            debug.error(err);
            return void handleFailedCommand(message.channel, `Something went wrong and I couldn't create that role.`);
        }

        existingRole = createdRole.id;
    }

    const role = message.guild.roles.get(existingRole);
    if (!role) {
        return void handleFailedCommand(message.channel,
            `I had a mute role saved for this server but it seems to be gone, I've deleted ` +
            `my records of it, try recreating it again by running this command`
        );
    }
}

export const command: Command = new Command(
    {
        names: ['muterole'],
        info: 'Checks to see if a mute role exists, if not, creates one automatically',
        usage: '{{prefix}}muterole { role name ? }',
        examples: ['{{prefix}}muterole', '{{prefix}}muterole muted'],
        category: 'Settings',
        expects: [{type: ArgType.String, options: {optional: true}}],
        run: run,
        userPermissions: UserPermissions.Moderator,
        clientPermissions: ['MANAGE_ROLES']
    }
);

