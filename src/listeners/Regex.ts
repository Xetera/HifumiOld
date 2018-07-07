export const youtubeVideoRegex : RegExp = /((https?):\/\/(www\.)?)?youtu\.?be(\.com)?\/(watch\?v=)?\w{11}/;
export const discordInviteRegex : RegExp = /(discord|discordapp).(gg|me|io|com\/invite)\/(\S+)/g; // \S => non-whitespace
export const telegramInviteRegex: RegExp = /(https?):\/\/t.me\/joinchat\/[A-z 0-9 -_]+/;

// third matching group is literally just special characters and line end
export const hexRegex: RegExp = /(#|0x)([A-Fa-f0-9]{6})([!&*)(+=._\-\s]|$)/;
export const urlRegex: RegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,11}\b([-a-zA-Z0-9@:%_+.~#?&\/=]*)/;
export const emojiRegex: RegExp = /<:\w+:\d{17,21}>/;
export const specialCharRegex: RegExp = /[!@#$%^&*()_{}\[\]]/;
