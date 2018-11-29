import { Client } from 'discord.js';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
dotenv.config();
import './db';
import { handleEvents } from "./events";


const bot = new Client();
handleEvents(bot);
bot.login(process.env.BOT_TOKEN);

