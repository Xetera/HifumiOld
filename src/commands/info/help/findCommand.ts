import gb from "../../../misc/Globals";
import {Command} from "../../../handlers/commands/Command";


export default function findCommand(name: string): Command | undefined {
    return gb.instance.commandHandler.commands.find(command => command.names.some(n => n.toLowerCase() === name.toLowerCase()));
}
