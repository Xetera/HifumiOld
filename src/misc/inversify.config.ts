import { Container } from "inversify";
import {ITokenBucket} from "../interfaces/injectables/tokenBucket.interface";
import TokenBucket from "../moderation/TokenBucket";
import {Types} from "../interfaces/injectables/types.interface";
import {ICleverbot} from "../interfaces/injectables/cleverbot.interface";
import {Cleverbot} from "../API/Cleverbot";

const container = new Container();

container.bind<ITokenBucket>(Types.TokenBucket).to(TokenBucket);
container.bind<ICleverbot>(Types.Cleverbot).to(Cleverbot);

export { container };
