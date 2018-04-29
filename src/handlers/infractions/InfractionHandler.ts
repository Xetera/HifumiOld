import {Collection, GuildMember, Message, MessageCollector} from "discord.js";
import {debug} from "../../utility/Logging";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import gb from "../../misc/Globals";
import {Infraction} from "../../database/models/infraction";
import infractionAreYouSureEmbed from "../../embeds/commands/infractionAreYouSureEmbed";
import {
    InfractionRejectionReason,
    InfractionRequestRejection,
    isInfractionRequestRejection
} from "./infractions.interface";
import {APIErrors} from "../../interfaces/Errors";
import {runtimeErrorResponses} from "../../interfaces/Replies";
import {emptySpace, random} from "../../utility/Util";
import infractionDMEmbed from "../../embeds/moderation/infractionDMEmbed";
import resolveBooleanUncertainty from "../../resolvers/resolveBooleanUncertainty";
import banByInfractionDMEmbed from "../../embeds/moderation/banByInfractionDMEmbed";
import moment = require("moment");
import safeSendMessage from "../safe/SafeSendMessage";
import safeBanUser from "../safe/SafeBanUser";

export default class InfractionHandler {
    private static _instance: InfractionHandler;
    private constructor(){}
    public static getInstance(): InfractionHandler {
        if (!InfractionHandler._instance){
            InfractionHandler._instance = new this();
        }
        return InfractionHandler._instance;
    }

    public getActiveInfractions(infractions: Infraction[]): Infraction[]{
        const date = new Date();
        return infractions.filter(i => i.expiration_date <= date);
    }

    public static formatInfraction(i: Infraction, anonymous: boolean = false){
        return '' +
            `${anonymous ? `**ID**: ${i.infraction_id}  **Issued By**: ${i.staff_name}\n` : ''}` +
            `**Expired**: ${i.expiration_date <= new Date() ? 'Yes' : '__No__'}  ` +
            `**Weight**: ${i.infraction_weight}\n` +
            `**Date**: ${moment(i.infraction_date).calendar()}\n` +
            `**Reason Given**:\n${i.infraction_reason}\n ${emptySpace}`;
    }
    /**
     * Checks requirements for striking members, returns max strike weight of the members guild
     * @param {module:discord.js.GuildMember} member
     * @param {module:discord.js.GuildMember} target
     * @param {number} weight
     * @returns {Promise<number>} - Max strike limit of the target guild
     */
    private static async memberCanInfract(member: GuildMember, target: GuildMember, weight: number): Promise<number> {
        const infractionLimit = await gb.instance.database.getInfractionLimit(member.guild.id);

        if (!member.hasPermission('BAN_MEMBERS')){
            debug.silly(`User ${member.user.username} cannot infract members, missing mod.`);
            return Promise.reject(
                <InfractionRequestRejection>
                    {
                        errorMessage: InfractionRejectionReason.MISSING_PERMISSIONS,
                        responseMessage: '',
                        target: target
                    }
            );
        }

        else if (weight && (weight > infractionLimit || weight < 0)){
            debug.silly(`User ${member.user.username} inputted an out-of-bounds infraction request`);
            return Promise.reject(
                <InfractionRequestRejection>
                    {
                        errorMessage: InfractionRejectionReason.INCORRECT_RANGE,
                        responseMessage: `Strike weight must be between 0 and ${infractionLimit}.`,
                        target: target
                    }
            );
        }

        else if (member.guild.ownerID !== member.id
            && (member.highestRole.comparePositionTo(target.highestRole) < 0
            || target.hasPermission('ADMINISTRATOR'))) {
            debug.silly(`User ${member.user.username} tried to infract a user with a higher role`);
            return Promise.reject(
                <InfractionRequestRejection>
                    {
                        errorMessage: InfractionRejectionReason.LOWER_ROLE_RANKING,
                        responseMessage: `You cannot infract administrators or users that are higher ranked than yourself.`,
                        target: target
                    }
            );
        }
        return Promise.resolve(infractionLimit);
    }

    /**
     * Returns true if user is banned after infraction
     * @param {Message} message
     * @param {GuildMember} staff
     * @param {GuildMember} target
     * @param {string} reason
     * @param {number} weight
     * @returns {Promise<boolean>} - is user banned
     */
    public async addInfraction(message: Message, staff: GuildMember, target: GuildMember, reason: string, weight: number): Promise<boolean> {
        return InfractionHandler.memberCanInfract(staff, target, weight).then(async(infractionLimit: number) => {
            const currentUserStrikes: Infraction[] = await gb.instance.database.getInfractions(target.guild.id, target.id);
            const activeInfractions = this.getActiveInfractions(currentUserStrikes);
            const currentWeight = activeInfractions.reduce((total, inf) => total + inf.infraction_weight, 0);

            let isBan: boolean = false;
            if (weight + currentWeight >= infractionLimit){

                if (!target.bannable){
                    safeSendMessage(message.channel, `Striking this member would result in them getting banned but I can't ban that member.`);
                    return Promise.reject(`Target ${target.user.username} in guild ${target.guild.name} not bannable by infraction.`);
                }

                const areYouSureMessage = infractionAreYouSureEmbed(`Striking this member will put them at ${weight + currentWeight}/${infractionLimit} total strikes, getting them banned.`, 30);
                let response = await resolveBooleanUncertainty(message, areYouSureMessage, 30000);
                if (response === undefined)
                    return Promise.reject(`User denied boolean confirmation`);
                isBan = true;
            }

            return Promise.all([gb.instance.database.addInfraction(staff, target, reason, weight), staff, target, infractionLimit, isBan]);
        }).then(async(r: [Partial<Infraction>, GuildMember, GuildMember, number, boolean]) => {
            const [response, staff, target, strikeLimit, isBan] = r;
            if (isBan && target.bannable){
                const infractions: Infraction[] = await gb.instance.database.getInfractions(target.guild.id);
                const currentIndex = infractions.findIndex(i => i.infraction_id === response.infraction_id);
                const currentInfraction = infractions.splice(currentIndex, 1)[0];
                const embed = banByInfractionDMEmbed(target, currentInfraction, infractions);
                const banReason =  `Banned for exceeding the strike cap for the server.\n\nBan Reason:\n${response.infraction_reason!}`;
                target.send(embed);

                await safeBanUser(target, banReason).catch((err) => {
                    debug.error(err, 'InfractionHandler');
                    return Promise.reject(err);
                });
                return Promise.resolve(true);
            }
            // We are already checking for isBan && !target.bannable before we enter the promise
            staff.send(`Infracted user <@${target.id}> with weight **${weight}** and reason:\n${reason}`);
            target.send(infractionDMEmbed(
                staff.guild,
                weight,
                reason,
                weight,
                strikeLimit
            ));
            return Promise.resolve(false);
        }).catch(async(err: string | Error) => {
            if (err === 'EVENT_CANCELLED'){
                return Promise.reject(`EVENT_CANCELLED`);
            }
            else if (typeof err !== 'string' && isInfractionRequestRejection(err)){
                await handleFailedCommand(message.channel, err.responseMessage);
                return Promise.reject(`Errored on infraction`);
            }
            debug.error(err, `InfractionHandler`);
            await handleFailedCommand(message.channel, random(runtimeErrorResponses));
            return Promise.reject(`Errored on infraction`);

        });
    }
}
