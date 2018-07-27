import {Container, Scope} from "typescript-ioc";
import {ITokenBucket} from "../interfaces/injectables/tokenBucket.interface";
import TokenBucket from "../moderation/TokenBucket";
import {ICleverbot} from "../interfaces/injectables/cleverbot.interface";
import {Cleverbot} from "../API/Cleverbot";
import {ICommandHandler} from "../interfaces/injectables/commandHandler.interface";
import CommandHandler from "../handlers/commands/CommandHandler";
import {DiscordClient, IClient} from "../interfaces/injectables/client.interface";

export function setupContainers(){
    Container.bind(ITokenBucket).to(TokenBucket).scope(Scope.Singleton);
    Container.bind(ICleverbot).to(Cleverbot).scope(Scope.Singleton);
    Container.bind(ICommandHandler).to(CommandHandler).scope(Scope.Singleton);
    // a bit of a hack, we need a single instance of the discord client
    // to exist but we can't make it extend an abstract class easily
    // since it's not our own class
    Container.bind(IClient).to(DiscordClient).scope(Scope.Singleton);

    // We need to reference these once so that the singleton
    // classes are loaded before the application starts
    Container.get(ICommandHandler);
}
