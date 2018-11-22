import { Client, Message, RichEmbed } from "discord.js";

export type CommandReturn = string | RichEmbed | Error | undefined | void;

interface Context {
  readonly bot: Client;
  readonly message: Message;
  readonly args: string[];
}

interface Command {
  readonly names: string[];
  readonly run: (ctx: Context) => CommandReturn;
}
