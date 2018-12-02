import * as rd from 'redis';
import { promisify } from "util";
import { Command, UserID } from "./types/types";

export const keyRateLimit = (commandName: string, id: string) => `ratelimit:${commandName}:${id}`;

/**
 * Redis client, should not be initialized while testing
 */
export const redis = rd.createClient() as rd.RedisClient;

export const lrangeAsync = promisify(redis.lrange).bind(redis);
export const lpushAsync = promisify(redis.lpush).bind(redis);
export const rpopAsync = promisify(redis.rpop).bind(redis);
export const getAsync = promisify(redis.get).bind(redis);
export const existsAsync = promisify(redis.exists).bind(redis);
export const setAsync = promisify(redis.set).bind(redis);
export const delAsync = promisify(redis.del).bind(redis);

export const isUserRateLimited = (userId: UserID, command: Command): Promise<boolean> => command.debounce
  ? existsAsync(keyRateLimit(command.names.first(), userId))
  : Promise.resolve(false);

export const rateLimitForCommand = async (userId: UserID, command: Command): Promise<void> => {
  const { debounce, names } = command;
  if (!debounce) {
    return;
  }
  const keyName = keyRateLimit(names.first(), userId);
  return setAsync(keyName, '1', 'EX', debounce);
};

export const removeRateLimit = (userId: UserID, command: Command) => command.debounce
  ? delAsync(keyRateLimit(command.names.first(), userId))
  : Promise.resolve(false);
