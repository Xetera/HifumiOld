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
            winston.format.timestamp(() => new Date()),
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

function fetchMaxPropertyLength<T>(array: T[], prop: (_:T) => T[keyof T], func: (..._:number[]) => number) {
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
    const maxName = fetchMaxPropertyLength(
        stats, (stat: GuildStats) => stat.name, Math.max
    );
    const maxMembers = fetchMaxPropertyLength(
        stats, (stat: GuildStats) => stat.members.toString(), Math.max
    );
    const maxChannels = fetchMaxPropertyLength(
        stats, (stat: GuildStats) => stat.channels.toString(), Math.max
    );

    const nameHeader = forceLength('Name', maxName + padding - 3);
    const usersHeader = forceLength('Users', maxMembers + padding);
    const channelsHeader = forceLength('Channels', maxChannels + padding);

    debug.info('|' + '-'.repeat(nameHeader.length + usersHeader.length + channelsHeader.length + 2) + '|');
    debug.info(
        `|${nameHeader}|${usersHeader}|${channelsHeader}|`
    );
    // because of the separator columns
    debug.info('|' + '-'.repeat(nameHeader.length + usersHeader.length + channelsHeader.length + 2) + '|');

    for (const [index, guild] of stats.entries()) {
        const name     = forceLength(guild.name, maxName + padding - 3);
        const members  = forceLength(guild.members.toString(), maxMembers + padding);
        const channels = forceLength(guild.channels.toString(), maxChannels + padding);
        debug.info(`|${name}|${members}|${channels}|`);
        if (index > 50) {
            break;
        }
    }
    debug.info('|' + '-'.repeat(nameHeader.length + usersHeader.length + channelsHeader.length + 2) + '|');
    const totals: [number, number] = stats.reduce((total, stat) => {
        total[0] += stat.members;
        total[1] += stat.channels;
        return total;
    }, <[number, number]> [0, 0]);

    const totalMembers = forceLength(totals[0].toString(), maxMembers + padding);
    const totalChannels = forceLength(totals[1].toString(), maxChannels + padding);
    debug.info(`|Total${' '.repeat(nameHeader.length - 5)}|${totalMembers}|${totalChannels}|`)
    debug.info('|' + '-'.repeat(nameHeader.length + usersHeader.length + channelsHeader.length + 2) + '|');
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
