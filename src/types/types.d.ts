import { Channel, Client, GuildMember, Message, RichEmbed, User } from "discord.js";
import { List } from "immutable";
import Node from "lavalink/typings/Node";
import { Observable } from "rxjs";
import { Connection } from "typeorm";
import { ArgType, ArgTypes, Arguments } from "./parser";
import { Track } from "lavalink";

export type CommandReturn = Promise<any> | Observable<any> | void ;
export type CommandCanRun = Promise<boolean> | Observable<boolean> | boolean;
export type UserID = string;

interface SemiContext {
  readonly bot: Client;
  readonly db: Connection;
  readonly voice: Node;
  readonly message: Message;
}

interface Context extends SemiContext {
  readonly args: List<Arguments | undefined>;
  readonly input: string;
  readonly command?: Command;
}

type Commands = List<Command>;

type Expect = ArgTypes | ArgType;

type CommandArgs = List<Expect>;
interface BaseCommand {
  readonly run: (ctx: Context, arguments: any) => CommandReturn;
  readonly canRun?: (ctx: Context) => CommandCanRun;
  readonly onFail?: (ctx: Context) => Promise<any>;
  readonly pre?: (ctx: Context) => Promise<any>;
  readonly post?: (ctx: Context) => Promise<any>;
  readonly dmDisabled?: boolean;
  readonly debounce?: number;
  readonly ownerOnly?: boolean;
  readonly hidden?: boolean;
  readonly description: string;
}

interface CommandInput extends BaseCommand {
  readonly names: string[];
  readonly expects?: Expect[];
}

interface Command extends BaseCommand {
  /**
   * Names the command goes by, first is
   */
  readonly names: List<string>;
  readonly expects?: CommandArgs;
}

type GuildQueues = Map<string, Track[]>;
