import {Tags} from 'hot-shots'
// import {Environments} from "../../events/systemStartup";
import {gb} from "../../misc/Globals";
import {debug} from "../../utility/Logging";
import {Environments} from "../../events/systemStartup";

export function incrementStat(target: string, tags?: Tags) {
    if (gb.ENV === Environments.Development) {
        return;
    } else if (!gb.stats) {
        return debug.info(`Cannot record ${target} stats, datadog client not ready.`)
    }
    gb.stats.increment(target, tags);
    const tagOutput = tags ? `[${tags}]` : '';
    debug.silly(`Incremented ${target} ${tagOutput}`);
}

export function distributionStat(target: string, value: number, sampleRate?: number, tags?: Tags){
    if (gb.ENV === Environments.Development) {
        return;
    } else if (!gb.stats) {
        return debug.info(`Cannot record ${target} stats, datadog client not ready.`)
    }
    gb.stats.distribution(target, value);
    debug.silly(`Recorded distribution for ${target}: ${value}`);
}

export function timedStat(target: string, value: number, sampleRate?: number, tags?: Tags){
    if (gb.ENV === Environments.Development) {
        return;
    } else if (!gb.stats) {
        return debug.info(`Cannot record ${target} stats, datadog client not ready.`)
    }
    gb.stats.timing(target, value, sampleRate, tags);
    debug.silly(`Recorded timer for ${target}: ${value}`);
}

