import { Channel, GuildMember, Message, User } from "discord.js";
import { List } from "immutable";
import { Url } from "url";

interface CategoryInput {
  readonly chunk: string;
  readonly args: Arguments;
}

type Arguments =
  Channel
  | GuildMember
  | User
  | number
  | Url
  | string
  | string;


declare const enum ArgType {
  Channel = 0,
  GuildMember = 1,
  User = 2,
  Number = 3,
  Url = 4,
  Word = 5,
  Phrase = 6
}

type ArgTypes = List<ArgType>;

interface ParserContext {
  readonly message: Message;
  readonly chunks: List<string>;
  readonly cursor: number;
  readonly output: List<Arguments | undefined>;
}

interface ParsedCommandInput {
  readonly output: List<Arguments | undefined>;
  readonly commandName: string;
}

interface ArgParseCategory<T extends Arguments> {
  readonly is: (context: ParserContext) => boolean;
  readonly to: (context: ParserContext) => T;
  readonly toString: () => string;
}
