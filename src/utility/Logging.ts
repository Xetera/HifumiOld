import * as Discord from'discord.js'
import {gb} from "../misc/Globals";
import * as winston from "winston";
const cli = require('heroku-cli-util');

const options = {
    file: {
        level: 'info',
        filename: `/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.align(),
            winston.format.timestamp(),
            winston.format.printf((info) => {
                const {
                    timestamp, level, message, ...args
                } = info;

                const ts = timestamp.slice(0, 19).replace('T', ' ');
                return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
            }),
        )
    },
};
export const debug = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),

        new winston.transports.Console(options.console)
    ],
    exitOnError: false,
});

interface GuildStats {
    name: string;
    members:number;
    channels: number;
}

export function startupTable(guilds : GuildStats[]){
    cli.styledHeader(`${guilds.length} guilds total.`);
    cli.table(guilds, {
        columns: [
            {key: 'name', label: 'Name' ,format: (name :string ) => cli.color.red(name)},
            {key: 'members', label:'Members', format: (members: string )=> cli.color.yellow(members)},
            {key: 'channels', label:'Channels',format: (channels: string )=> cli.color.blue(channels)},
        ]
    });
}


// TODO: remove this and just convert everything that bot sends into embeds
export function log(guild: Discord.Guild, message : string) : void {
    message = message.replace('@', '@');
    const logsChannel = gb.database.getLogsChannel(guild.id);
    if (!logsChannel){
        return void debug.info(`Tried to log a message in ${guild.name} but a logs channel was not found.`);
    }
   if (logsChannel instanceof Discord.TextChannel){
        logsChannel.send(message);
        return void debug.info(`Logged a message in ${guild.name}`);
   }
}
