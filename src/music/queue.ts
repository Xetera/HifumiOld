import { Track, TrackResponse } from "lavalink";
import { redis } from "../redis";
import Node from "lavalink/typings/Node";
import Player from "lavalink/typings/core/Player";
import { List } from "immutable";
import { CommandError } from "../utils";

const PAGE_INCREMENT = 10;

// const paginateFromCursor = (page: number) =>

export const getTrack = (trackId: string): Promise<Track> => redis.hgetall(`tracks${trackId}`);

export const saveTrack = (track: Track) => redis.hmset(`tracks:${track.track}`, track);

export const delTrack = (track: Track) => redis.del(`tracks:${track.track}`);

export const getQueue = (guildId: string, paginate: number = 0) =>
  redis.lrange(`queue:${guildId}`, paginate * PAGE_INCREMENT, (paginate * PAGE_INCREMENT) + PAGE_INCREMENT)
    .then((songs: string[]) => Promise.all(songs.map(getTrack)));

export const queueTrack = (guildId: string, track: Track) => redis.lpush(`queue:${guildId}`, track.track).then(() =>
  saveTrack(track)
);

export const popTrack = async (guildId: string) => {
  const hash = await redis.rpop(`queue:${guildId}`);
  const out = await getTrack(hash);
  await delTrack(out);
  return out;
};

export const searchAndPlay = async (search: string, voice: Node, player: Player) => {
  const queue = List(await getQueue(player.guildID));
  if (queue.size >= 100) {
    throw new CommandError('')
  }
  // @ts-ignore
  const res = voice.load(`ytsearch:${search}`) as TrackResponse;
  const [bestMatch] = res.tracks;
  await queueTrack(player.guildID, bestMatch);
};
