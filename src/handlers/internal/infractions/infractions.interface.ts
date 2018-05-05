import {GuildMember} from "discord.js";

export enum InfractionRejectionReason {
    MISSING_PERMISSIONS,
    INCORRECT_RANGE,
    LOWER_ROLE_RANKING
}

export interface InfractionRequestRejection {
    errorMessage: InfractionRejectionReason;
    responseMessage: string;
    target: GuildMember;
}

export function isInfractionRequestRejection(t: any): t is InfractionRequestRejection {
    return 'errorMessage' in t;
}
