import {Container} from "typescript-ioc";
import {IClient} from "../interfaces/injectables/client.interface";
import {IDatabase} from "../interfaces/injectables/datbase.interface";
import {ICommandHandler} from "../interfaces/injectables/commandHandler.interface";
import {Message} from "discord.js";

export function _eval(message: Message, prompt: string){
    // setting context for eval
    //@ts-ignore
    const bot = Container.get(IClient);
    //@ts-ignore
    const database = Container.get(IDatabase);
    //@ts-ignore
    const commandHandler = Container.get(ICommandHandler);
    let result;
    try {
        result = eval(prompt);
    } catch (e) {
        result = e.toString();
    }
    return result;
}
