import * as rd from 'redis';
import { promisify } from "util";
import { Command, UserID } from "./types";
import { from } from "rxjs";

export const keyRateLimit = (commandName: string, id: string) => `ratelimit:${commandName}:${id}`;


/**
 * Redis client, should not be initialized while testing
 */
const client = rd.createClient() as rd.RedisClient;
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

export const isUserRateLimited = (userId: UserID, command: Command): Promise<boolean> => {
  return getAsync(
    keyRateLimit(command.names.first(), userId)
  ).then(Boolean);
};
export const userRateLimitedStream = (userId: string, command: Command) => from(isUserRateLimited(userId, command));

export const rateLimitForCommand = async (userId: UserID, command: Command): Promise<void> => {
  const { debounce, names } = command;
  if (!debounce) {
    return;
  }
  const keyName = keyRateLimit(names.first(), userId);
  return setAsync(keyName, debounce, 'EX', debounce)
};
