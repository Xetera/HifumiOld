import * as Redis from "redis";
import { promisify } from "util";

const _redis = Redis.createClient();

export namespace redis {
    export const get = promisify(_redis.get).bind(_redis);
    export const set = promisify(_redis.set).bind(_redis);
    export const del = promisify(_redis.del).bind(_redis);
}
