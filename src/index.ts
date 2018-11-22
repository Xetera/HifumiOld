import { Client } from 'discord.js';
import * as dotenv from 'dotenv';
import { handleEvents } from "./events";

dotenv.config();

const bot = new Client();

handleEvents(bot);
bot.login(process.env.BOT_TOKEN);

