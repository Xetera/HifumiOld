import * as Moment from 'moment'

export enum SecurityLevels {
    Dangerous = "DANGEROUS",
    Medium = "MEDIUM",
    High = "HIGH",
}

export function resolveSecurityLevel(security : SecurityLevels) : string {
    if (security === SecurityLevels.Dangerous)
        return "Dangerous";
    else if (security === SecurityLevels.Medium)
        return "Medium";
    else if (security === SecurityLevels.High)
        return "High";
    else throw new TypeError(`${security} is not a valid SecurityLevel`);
}

export let securityLevel : SecurityLevels = SecurityLevels.Medium;

export let raidDetectionInterval = 30 * 1000;


export function setSecurityLevel(level : SecurityLevels){
    securityLevel = level;
}

/**
 *
 * @returns {number} - number of messages the bot tolerates before
 */
export function getSpamTolerance() : number {
    switch(securityLevel) {
        case SecurityLevels.Dangerous: {
            return 0;
        }
        case SecurityLevels.Medium: {
            return 6;
        }
        case SecurityLevels.High: {
            return 5;
        }
    }
}

export function getOnBanMessageSnipeCount() : number {
    switch(securityLevel) {
        case SecurityLevels.Dangerous: {
            return 0;
        }
        case SecurityLevels.Medium: {
            return 1;
        }
        case SecurityLevels.High: {
            return 4;
        }
    }
}

export function getBulkDeleteCount() : number {
    switch(securityLevel) {
        case SecurityLevels.Dangerous: {
            return 0;
        }
        case SecurityLevels.Medium: {
            return 100;
        }
        case SecurityLevels.High: {
            return 300;
        }
    }
}

const DANGEROUS_DURATION : number = 0;
const MEDIUM_DURATION    : number = 1/60 * 60;
const HIGH_DURATION      : number = 30 * 60;

export function getMuteDate() : Date {
    switch(securityLevel) {
        case SecurityLevels.Dangerous: {
            return Moment(Date.now()).toDate();
        }
        case SecurityLevels.Medium: {
            const date : Date = Moment(new Date()).add(MEDIUM_DURATION, 's').toDate();
            return date;// 5 sec
        }
        case SecurityLevels.High: {
            return Moment(new Date()).add(HIGH_DURATION, 's').toDate(); // update later
        }
    }
}

export function getMuteTime() : number /* seconds */ {
    switch(securityLevel) {
        case SecurityLevels.Dangerous: {
            return DANGEROUS_DURATION;
        }
        case SecurityLevels.Medium: {
            return MEDIUM_DURATION;
        }
        case SecurityLevels.High: {
            return HIGH_DURATION;
        }
    }
}

export function getMemberTrackDuration() : Date | undefined {
    switch(securityLevel) {
        case SecurityLevels.Dangerous: {
            return undefined;
        }
        case SecurityLevels.Medium: {
            return Moment(new Date()).add(5, 'm').toDate();
        }
        case SecurityLevels.High: {
            return Moment(new Date()).add(15, 'm').toDate();
        }
    }
}