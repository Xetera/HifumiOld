import { Message } from "discord.js";
import * as glob from 'glob';
import { List, Set } from 'immutable';
import * as R from "ramda";
import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";
import { fromPromise } from "rxjs/internal-compatibility";
import { flatMap, map, tap } from "rxjs/operators";
import { promisify } from "util";
import { msgStream$ } from "./events";
import { Command } from "./types";

const globAsync = promisify(glob);

export const handleUnavailableDmCommand = (msg: Message) =>
  msg.reply(`This command is not available in DMs`);


export const awaitCommands =
  globAsync(`${__dirname}/commands/**/*.js`, { absolute: true }).then(
    R.pipe(
      R.map(require), R.pluck('default'), R.flatten
    ),
  ) as Promise<Command[]>;


export const handleCommand = (msg: Message) => awaitCommands.then((commands: Command[]) => {
  console.log(commands);
});
