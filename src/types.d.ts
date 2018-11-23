import { Client, Message } from "discord.js";
import { List, Record } from "immutable";

export type CommandReturn = any;
export type UserID = string;

interface SemiContext {
  readonly bot: Client;
  readonly message: Message;
}

interface Context extends SemiContext {
  readonly args: List<string>;
  readonly input: string;
  readonly command?: Command;
}


type Commands = List<Command>;
interface BaseCommand {
  /**
   * Names the command goes by, first is
   */
  readonly run: (ctx: Context) => CommandReturn;
  readonly dmDisabled?: boolean;
  readonly debounce?: number;
  readonly description: string;
}

interface CommandInput extends BaseCommand {
  readonly names: string[];
}

interface Command extends BaseCommand {
  /**
   * Names the command goes by, first is
   */
  readonly names: List<string>;
}
