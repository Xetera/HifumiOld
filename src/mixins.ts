import { GuildMember } from "discord.js";
import { CommandInput } from "./types/types";
import { CommandError } from "./utils";

export const isInVoiceChannel = (member: GuildMember) =>
  Boolean(member.voiceChannel);

export const requiresVc: Partial<CommandInput> = {
  canRun: ctx => isInVoiceChannel(ctx.message.member),
  onFail: ctx => ctx.message.channel.send(`You have to be a in voice channel!`) ,
  pre: async ({ message, voice }) => {
    if (message.guild.me.voiceChannel) {
      return;
    }
    const player = voice.players.get(message.guild.id);
    return player.join(message.member.voiceChannel!.id, { deaf: true });
  }
};
