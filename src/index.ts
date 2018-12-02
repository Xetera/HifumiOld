import { Client } from 'discord.js';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
dotenv.config();
import './db';
import { handleEvents } from "./events";
import { logger } from "./loggers";

logger.info('Worker running');
const bot = new Client();
handleEvents(bot);
bot.login(process.env.BOT_TOKEN);

