import { RichEmbedOptions } from "discord.js";
import { Track, TrackResponse } from "lavalink";
import { createCommand } from "../command";
import { requiresVc } from "../mixins";
import { ArgType } from "../types/parser";

const songEmbed = (track: Track): RichEmbedOptions => ({
  author: {
    name: track.info.title,
    icon_url: 'https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/512/youtube.png'
  },
  description: `Now Playing: [${track.info.title}](${track.info.uri})`,
  color: '16746734'
});

export default {
  play: createCommand({
    names: ['play', 'p'],
    description: "Plays a song",
    expects: [ArgType.Phrase],
    ...requiresVc,
    run: async ctx => {
      const player = ctx.voice.players.get(ctx.message.guild.id);
      const search = ctx.args.join(' ');
      // @ts-ignore
      const res = await ctx.voice.load(`ytsearch:${search}`) as TrackResponse;
      const [track] = res.tracks;

      console.log(track);

      await player.play(track.track);
      return ctx.message.channel.send({ embed: songEmbed(track) });
    }
  }),
  pause: createCommand({
    names: ['pause'],
    description: "Pauses the current song",
    expects: [],
    ...requiresVc,
    run: async ctx => {
      const player = ctx.voice.players.get(ctx.message.guild.id);
      if (player.paused) {
        return ctx.message.channel.send("But I'm not playing anything...");
      }
      return player.pause();
    }
  }),
  resume: createCommand({
    names: ['resume', 'r'],
    description: "Pauses the current song",
    expects: [],
    ...requiresVc,
    run: async ctx => {
      const player = ctx.voice.players.get(ctx.message.guild.id);
      if (!player.paused) {
        return ctx.message.channel.send(`I'm already playing ${player.status}`);
      }
      return player.pause(false);
    }
  }),
  leave: createCommand({
    names: ['leave'],
    description: "Leaves the voice channel",
    expects: [],
    ...requiresVc,
    run: async ctx => {
      const player = ctx.voice.players.get(ctx.message.guild.id);
      if (!ctx.message.guild.me.voiceChannel) {
        return ctx.message.channel.send(`I'm not even in a voice channel`);
      }
      // await player.pause();
      return player.leave();
    }
  })
};


