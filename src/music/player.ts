import { getAsync, lpushAsync, lrangeAsync, rpopAsync } from "../redis";

export const getQueue = (guildId: string) => lrangeAsync(guildId, 0, 100);

export const queueTrack = (guildId: string, trackId: string) => lpushAsync(guildId, trackId);

export const shiftTrack = (guildId: string) => rpopAsync(guildId);
