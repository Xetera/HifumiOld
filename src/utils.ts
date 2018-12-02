import axios from 'axios';
import { List } from "immutable";
import { from, Observable, of } from "rxjs";

export class CommandError extends Error {
  constructor(...args: any[]) {
    super(...args);
    Error.captureStackTrace(this, CommandError);
  }
}

export class ArgumentError extends Error {
  constructor(...args: any[]) {
    super(...args);
    Error.captureStackTrace(this, CommandError);
  }
}

export const random = <T>(input: string | List<T>) => {
  const target = typeof input === 'string'
    ? List(input.split(''))
    : input;

  return target.get(Math.floor(Math.random() * target.size))!;
};

export const quote = (str: string) =>
  `\`${str}\``;
export const wrapCode = (str: string | number, lang?: string): string =>
  `\`\`\`${lang || ''}\n${str}\n\`\`\``;

export const HASTEBIN_ENDPOINT = 'https://hastebin.com/documents';

export const postToHastebin = (output: string) =>
  axios.post(HASTEBIN_ENDPOINT, output, { timeout: 1000 }).then(
    res => `https://hastebin.com/${res.data.key}`,
    () => `[Whoops, I couldn't reach the hastebin servers for some reason]`
  );

export const removeToken = (input: any) => {
  if (!process.env.BOT_TOKEN) {
    throw new CommandError(
      "Token environment variable was not set, could not " +
      "search and remove token from the response. If you're trying to " +
      "use eval make sure the BOT_TOKEN environment variable is set correctly."
    );
  }
  return String(input).replace(process.env.BOT_TOKEN, '[token removed]');
};



export const liftP = (fn: any) => {
  return (...args: any[]) => {
    return Promise.all(args).then((x) => fn.apply(null, x));
  };
};
