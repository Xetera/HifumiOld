import {Command} from "../../../handlers/commands/Command";
import {ICommandHandler} from "../../../interfaces/injectables/commandHandler.interface";
import {Container} from "typescript-ioc";


export default function findCommand(name: string): Command | undefined {
    const commandHandler: ICommandHandler = Container.get(ICommandHandler);
    return commandHandler.commands.find(command => command.names.some(n => n.toLowerCase() === name.toLowerCase()));
}
