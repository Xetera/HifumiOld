import { Client, Message } from 'discord.js';
import * as dotenv from 'dotenv';
import { fromEvent, Observable } from "rxjs";
import { handleEvents } from "./events";

(async () => {
  dotenv.config();
  const bot = new Client();
  bot.login(process.env.BOT_TOKEN);

  const context = {
    bot,
  };

  handleEvents(bot);


// === === === === MESSAGE === === === === === //
//   bot.on('messageUpdate', onMessageUpdate);
//
//   bot.on('messageDelete', () => {
//   });
//
// // === === === === GUILD MEMBER === === === === === //
//   bot.on('guildMemberAdd', onGuildMemberAdd);
//
//   bot.on('guildMemberRemove', onGuildMemberRemove);
//
//   bot.on('guildMemberUpdate', onGuildMemberUpdate);
//
// // === === === === GUILD === === === === === //
//   bot.on('guildUpdate', onGuildUpdate);
//
//   bot.on('guildCreate', onGuildCreate);
//
//   bot.on('guildBanAdd', LogManager.logBan);
//
//   bot.on('guildBanRemove', LogManager.logUnban);
//
// // === === === === CHANNEL === === === === === //
//   bot.on('channelCreate', onChannelCreate);
//
//   bot.on('channelDelete', onChannelDelete);
//
// // === === === === EXCEPTIONS === === === === === //
//   bot.on('error', websocketErrorHandler);
//
//   bot.on('warn', websocketWarningHandler);
})();
