export const youtubeInviteRegex : RegExp = /((https?):\/\/(www\.)?)?youtu\.?be(\.com)?\/(watch\?v=)?\w{11}/;
export const discordInviteRegex : RegExp = /(\n|.)*((discord|discordapp).(gg|me|io|com\/invite)\/)(\n|.)*/;
export const telegramInviteRegex: RegExp = /(https?):\/\/t.me\/joinchat\/[A-z 0-9 -_]+/;

export const channelMentionRegex : RegExp = /\\d{18}(?=>)/;