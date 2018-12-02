import { Client } from "discord.js";
import { Connection, createConnection } from "typeorm";

export const conn = (!process.env.TEST && createConnection({
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: Number(process.env.TYPEORM_PORT) || 5431,
  type: 'postgres',
  entities: ['dist/entity/*.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: process.env.ENV === 'DEV',
  dropSchema: process.env.ENV === 'DEV',
  cli: {
    migrationsDir: 'migrations'
  }
})) as Promise<Connection>;

export const loadGuilds = async (bot: Client) => {
  const docs = bot.guilds.map(guild =>({
    id: guild.id
  }));
};

