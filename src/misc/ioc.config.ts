import {Container} from "typescript-ioc";
import {ITokenBucket} from "../interfaces/injectables/tokenBucket.interface";
import TokenBucket from "../moderation/TokenBucket";
import {ICleverbot} from "../interfaces/injectables/cleverbot.interface";
import {Cleverbot} from "../API/Cleverbot";
import {ICommandHandler} from "../interfaces/injectables/commandHandler.interface";
import CommandHandler from "../handlers/commands/CommandHandler";

export function setupContainers(){
    Container.bind(ITokenBucket).to(TokenBucket);
    Container.bind(ICleverbot).to(Cleverbot);
    Container.bind(ICommandHandler).to(CommandHandler);
}
