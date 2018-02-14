export enum SecurityLevels {
    Dangerous,
    Medium,
    High,
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

export function setSecurityLevel(level : SecurityLevels){
    securityLevel = level;
}

export function getSpamTolerance() : number{
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

/**
 *
 * @returns {number} - in milliseconds
 */
export function getMuteDuration() : number {
    switch(securityLevel) {
        case SecurityLevels.Dangerous: {
            return 0;
        }
        case SecurityLevels.Medium: {
            return 5000; // 5 sec
        }
        case SecurityLevels.High: {
            return 30000;
        }
    }
}