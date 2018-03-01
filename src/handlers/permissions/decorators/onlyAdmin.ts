import {Message, PermissionString} from "discord.js";

export default function onlyAdmin(target : any, key: any , descriptor: any) {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
        const message : Message = arguments[0].message;
        if (!message.member.permissions.has('ADMINISTRATOR')){
            message.channel.send(
                'Uh... sorry, I was told to only let Admins use this. '
                + message.client.emojis.find('name', 'alexa_feels_bad_man'));
            return;
        }

        return originalMethod.apply(this, arguments);
    };

    if (descriptor.value != null)
        return descriptor;
}
