import * as Discord from 'discord.js'
import {Database} from "../database/Database";
import {securityLevel, SecurityLevels, setSecurityLevel} from "../utility/Settings";
import Timer = NodeJS.Timer;

// duration in minutes
export default function raidMode(guild: Discord.Guild, database: Database, duration : number = 10){
    setSecurityLevel(SecurityLevels.High);

    const timeoutId : Timer = setTimeout(function(){

    },duration);
}