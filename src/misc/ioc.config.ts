import {Container, Scope} from "typescript-ioc";
import {ITokenBucket} from "../interfaces/injectables/tokenBucket.interface";
import TokenBucket from "../moderation/TokenBucket";
import {ICleverbot} from "../interfaces/injectables/cleverbot.interface";
import {Cleverbot} from "../API/Cleverbot";
import {ICommandHandler} from "../interfaces/injectables/commandHandler.interface";
import CommandHandler from "../handlers/commands/CommandHandler";
import {DiscordClient, IClient} from "../interfaces/injectables/client.interface";
import {IMessageQueue} from "../interfaces/injectables/messageQueue.interface";
import {MessageQueue} from "../moderation/MessageQueue";
import {IMuteQueue} from "../interfaces/injectables/muteQueue.interface";
import {MuteQueue} from "../moderation/MuteQueue";
import {ITracklist} from "../interfaces/injectables/tracklist.interface";
import Tracklist from "../moderation/Tracklist";
import {IDatabase} from "../interfaces/injectables/datbase.interface";
import {Database} from "../database/Database";
import {IAnime} from "../interfaces/injectables/anime.interface";
import Anime from "../API/anime";
import {IInfractionHandler} from "../interfaces/injectables/infractionHandler.interface";
import InfractionHandler from "../handlers/internal/infractions/InfractionHandler";

export function setupContainers() {
    const targets = [
        [ITokenBucket, TokenBucket],
        [ICleverbot, Cleverbot],
        [ICommandHandler, CommandHandler],
        [IMessageQueue, MessageQueue],
        [IMuteQueue, MuteQueue],
        [ITracklist, Tracklist],
        [IDatabase, Database],
        [IAnime, Anime],
        [IClient, DiscordClient],
        [IInfractionHandler, InfractionHandler]
    ];
    for (const [abstract, definition] of targets) {
        Container.bind(abstract).to(definition).scope(Scope.Singleton);
    }
}

export function loadContainers() {
    // We need to reference these once so that the singleton
    // classes are loaded before the application starts
    Container.get(ICommandHandler);
    Container.get(IDatabase);
    Container.get(IClient);
}
