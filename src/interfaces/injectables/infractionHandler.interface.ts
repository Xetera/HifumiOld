import {Infraction} from "../../database/models/infraction";
import {GuildMember, Message} from "discord.js";

export abstract class IInfractionHandler {
    abstract getActiveInfractions(infractions: Infraction[]): Infraction[];
    abstract formatInfraction(i: Infraction, anonymous?: boolean): string;
    abstract async addInfraction(message: Message, staff: GuildMember, target: GuildMember, reason: string, weight: number): Promise<boolean>;
}

