import { createCommand } from "../command";
import { Command, Context } from "../types/types";
import { CommandError, postToHastebin, removeToken } from "../utils";
import R = require("ramda");
import { from, Observable, of, pipe, merge } from "rxjs";
import { catchError, filter, flatMap, map, partition } from "rxjs/operators";

const canPost = (input: string) =>
  input.length < 1950;

const splitPostable = partition(canPost);

const customEval: Command = createCommand({
  names: ['eval'],
  description: "Evals a state",
  hidden: true,
  canRun: (ctx: Context) => ctx.message.author.id === process.env.OWNER_ID,
  run: async (ctx: Context, [code]: [string]) => {
    const evalResult = from(code).pipe(
      map(eval),
      catchError(error => of(error.toString())),
      map(removeToken),
    );

    const [postable$, unpostable$] = splitPostable(evalResult);

    const uploaded$ = unpostable$.pipe(flatMap(postToHastebin));

    merge(uploaded$, postable$).subscribe(response => {
      ctx.message.channel.send(response);
    });
  }
});

export default { customEval };
