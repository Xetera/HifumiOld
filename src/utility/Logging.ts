import * as Discord from'discord.js'
import {gb} from "../misc/Globals";
import * as winston from "winston";

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
        level: 'silly',
        handleExceptions: true,
        json: false,
        colorize: true,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.align(),
            winston.format.timestamp(),
            winston.format.printf((info) => {
                const {
                    timestamp, level, message
                } = info;

                const ts = timestamp.slice(0, 19).replace('T', ' ');
                return `${ts} [${level}]: ${message}`;
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

function fetchStatByProperty<T>(array: T[], prop: (_:T) => T[keyof T], func: (..._:number[]) => number) {
    const propertyLength: number[] = array.map(item => {
        return prop(item).toString().length;
    });
    /**
     * unfortunately typescript can't infer rest types
     */
    // @ts-ignore
    return func(...propertyLength);
}


export function forceLength(str: string, length: number): string {
    const sliced = str.slice(0, length);
    return sliced + ' '.repeat(length - str.length);
}

export function startupTable(stats: GuildStats[]) {
    const padding = 7;
    const maxName = fetchStatByProperty(
        stats, (stat: GuildStats) => stat.name, Math.max
    );
    const maxMembers = fetchStatByProperty(
        stats, (stat: GuildStats) => stat.members.toString(), Math.max
    );
    const maxChannels = fetchStatByProperty(
        stats, (stat: GuildStats) => stat.channels.toString(), Math.max
    );

    const nameHeader = forceLength('Name', maxName + padding);
    const usersHeader = forceLength('Users', maxMembers + padding);
    const channelsHeader = forceLength('Channels', maxChannels + padding);

    debug.silly(
        `${nameHeader}|${usersHeader}|${channelsHeader}`
    );
    // because of the separator columns
    debug.silly('-'.repeat(nameHeader.length + usersHeader.length + channelsHeader.length + 2));
    for (const guild of stats) {
        const name     = forceLength(guild.name, maxName + padding);
        const members  = forceLength(guild.members.toString(), maxMembers + padding);
        const channels = forceLength(guild.channels.toString(), maxChannels + padding);
        debug.silly(`${name}|${members}|${channels}`)
    }

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
