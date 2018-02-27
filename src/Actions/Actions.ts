import * as dbg from "debug";

export const debug = {
    silly  : dbg('Bot:Actions:Silly'),
    info   : dbg('Bot:Actions:Info'),
    warning: dbg('Bot:Actions:Warning'),
    error  : dbg('Bot:Actions:Error')
};
