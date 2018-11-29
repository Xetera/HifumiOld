import * as rd from 'redis';
import { promisify } from "util";
import { Command, UserID } from "./types/types";

export const keyRateLimit = (commandName: string, id: string) => `ratelimit:${commandName}:${id}`;

/**
 * Redis client, should not be initialized while testing
 */
const client = rd.createClient() as rd.RedisClient;

const getAsync = promisify(client.get).bind(client);
const existsAsync = promisify(client.exists).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

export const isUserRateLimited = (userId: UserID, command: Command): Promise<boolean> => command.debounce
  ? existsAsync(keyRateLimit(command.names.first(), userId))
  : Promise.resolve(false);

export const rateLimitForCommand = async (userId: UserID, command: Command): Promise<void> => {
  const { debounce, names } = command;
  if (!debounce) {
    return;
  }
  const keyName = keyRateLimit(names.first(), userId);
  return setAsync(keyName, debounce, 'EX', debounce);
};

export const removeRateLimit = (userId: UserID, command: Command) => command.debounce
  ? delAsync(keyRateLimit(command.names.first(), userId))
  : Promise.resolve(false);
