import * as _Redis from "redis";
import { promisify } from "util";

let client;

/**
 * Intentionally made this way because otherwise
 * testing code that imports this file starts to
 * run Redis which gives errors if redis doesn't
 * exist, example: Travis builds
 */
export namespace redis {
    export const _create = () => (client = _Redis.createClient());
    /**
     * Redis functions should never be called from a non-bot instance
     * like a test function so this is ok
     */
    export const get = (...args) =>
        promisify(client!.get).bind(client)(...args);
    export const set = (...args) =>
        promisify(client!.set).bind(client)(...args);
    export const del = (...args) =>
        promisify(client!.del).bind(client)(...args);
}
