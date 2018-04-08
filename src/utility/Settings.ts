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

// in seconds
const MUTE_TIME_DANGEROUS : number = 0;
const MUTE_TIME_MEDIUM    : number = 15 * 60;
const MUTE_TIME_HIGH      : number = 30 * 60;

export function getMuteDate() : Date {
    switch(securityLevel) {
        case SecurityLevels.Dangerous: {
            return Moment(Date.now()).toDate();
        }
        case SecurityLevels.Medium: {
            const date : Date = Moment(new Date()).add(MUTE_TIME_MEDIUM, 's').toDate();
            return date;// 5 sec
        }
        case SecurityLevels.High: {
            return Moment(new Date()).add(MUTE_TIME_HIGH, 's').toDate(); // update later
        }
    }
}

/* seconds */
export function getMuteTime() : number  {
    switch(securityLevel) {
        case SecurityLevels.Dangerous: {
            return MUTE_TIME_DANGEROUS;
        }
        case SecurityLevels.Medium: {
            return MUTE_TIME_MEDIUM;
        }
        case SecurityLevels.High: {
            return MUTE_TIME_HIGH;
        }
    }
}

const MEMBER_TRACKING_DANGEROUS  = 0;
const MEMBER_TRACKING_MEDIUM = 5 * 60;
const MEMBER_TRACKING_HIGH  = 15 * 60;

// in seconds
export function getMemberTrackDate() : Date | undefined {
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
export const commandEmbedColor = '#FFE5B4';
export function getMemberTrackDuration(): number {
    switch(securityLevel) {
        case SecurityLevels.Dangerous: {
            return MEMBER_TRACKING_DANGEROUS;
        }
        case SecurityLevels.Medium: {
            return MEMBER_TRACKING_MEDIUM;
        }
        case SecurityLevels.High: {
            return MEMBER_TRACKING_HIGH
        }
    }
}
