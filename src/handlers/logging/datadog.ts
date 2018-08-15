import {Tags} from 'hot-shots'
// import {Environments} from "../../events/systemStartup";
import {gb} from "../../misc/Globals";
import {debug} from "../../utility/Logging";

export function incrementStat(target: string, tags?: Tags) {
    gb.stats.increment(target, tags);
    const tagOutput = tags ? `[${tags}]` : '';
    debug.silly(`Incremented ${target} ${tagOutput}`);
}

export function distributionStat(target: string, value: number, sampleRate?: number, tags?: Tags){
    gb.stats.distribution(target, value);
    debug.silly(`Recorded distribution for ${target}: ${value}`);
}

export function timedStat(target: string, value: number){
    gb.stats.timing(target, value);
    debug.silly(`Recorded timer for ${target}: ${value}`);
}

