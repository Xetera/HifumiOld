import {default as catchUncaughtExceptions} from '../handlers/process/uncaughtException'
import {catchSigterm} from '../handlers/process/sigterm'
import {default as catchUnhandledRejections} from '../handlers/process/unhandledRejection'
export enum Environments {
    Development,
    Production
}

export function setupProcess(){
    catchUncaughtExceptions();
    catchUnhandledRejections();
    catchSigterm(true);
}


