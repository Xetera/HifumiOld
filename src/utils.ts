import axios from 'axios';
import { List } from "immutable";

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

export const quote = (str: string) => `\`${str}\``;

export const HASTEBIN_ENDPOINT = 'https://hastebin.com/documents';

export const postToHastebin = (output: string) =>
  axios.post(HASTEBIN_ENDPOINT, output).then(
    res => `https://hastebin.com/${res.data.key}`,
    () => `[Whoops, had a problem reaching the hastebin servers!]`
  );

export const removeToken = (input: string) => {
  if (!process.env.BOT_TOKEN) {
    throw new CommandError(
      "Token environment variable was not set, could not " +
      "search and remove token from the response. If you're trying to " +
      "use eval make sure the BOT_TOKEN environment variable is set correctly."
    );
  }
  return input.replace(process.env.BOT_TOKEN, '[token removed]');
};
