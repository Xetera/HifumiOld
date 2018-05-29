export const youtubeVideoRegex : RegExp = /((https?):\/\/(www\.)?)?youtu\.?be(\.com)?\/(watch\?v=)?\w{11}/;
export const discordInviteRegex : RegExp = /(discord|discordapp).(gg|me|io|com\/invite)\/(\S+)/g; // \S => non-whitespace
export const telegramInviteRegex: RegExp = /(https?):\/\/t.me\/joinchat\/[A-z 0-9 -_]+/;

// third matching group is literally just special characters and line end
export const hexRegex: RegExp = /(#|0x)([A-Fa-f0-9]{6})([!&*)(+=._\-\s]|$)/;
