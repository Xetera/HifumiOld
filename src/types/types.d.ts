import { Channel, Client, GuildMember, Message, User } from "discord.js";
import { List } from "immutable";
import { Observable } from "rxjs";
import { Connection } from "typeorm";
import { Url } from "url";
import { ArgType, ArgTypes, Arguments } from "./parser";

export type CommandReturn = Promise<any> | Observable<any> | void ;
export type CommandCanRun = Promise<boolean> | Observable<boolean> | boolean;
export type UserID = string;

interface SemiContext {
  readonly bot: Client;
  readonly db: Connection;
  readonly message: Message;
}

interface Context extends SemiContext {
  readonly args: List<string>;
  readonly input: string;
  readonly command?: Command;
}

type Commands = List<Command>;

interface BaseCommand {
  readonly run: (ctx: Context, arguments: any) => CommandReturn;
  readonly expects?: Array<ArgTypes | ArgType>;
  readonly canRun?: (ctx: Context) => CommandCanRun;
  readonly dmDisabled?: boolean;
  readonly debounce?: number;
  readonly ownerOnly?: boolean;
  readonly hidden?: boolean;
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
