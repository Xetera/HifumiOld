import { Client, Message, RichEmbed } from "discord.js";

export type CommandReturn = string | RichEmbed | Error | undefined | void;

interface SemiContext {
  readonly bot: Client;
  readonly message: Message;
}

interface Context extends SemiContext {
  readonly args: string[];
  readonly input: string;
}


interface Command {
  readonly names: string[];
  readonly run: (ctx: Context) => CommandReturn;
  readonly dmDisabled?: boolean;
}
