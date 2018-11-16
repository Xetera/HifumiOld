import { StatsD, Tags } from 'hot-shots'
import {Environments} from "../../events/systemStartup";
import {gb} from "../../misc/Globals";

const datadog = new StatsD();

export function increment(target: string, tags?: Tags){
    if (gb.ENV === Environments.Production){
        datadog.increment(target, tags);
    }
}
