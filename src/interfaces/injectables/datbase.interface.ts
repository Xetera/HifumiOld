import {GuildMember, Message} from "discord.js";
import {DeleteResult, InsertResult, UpdateResult} from "typeorm";
import {User} from "../../database/models/user";
import {Guild, LoggingChannelType} from "../../database/models/guild";
import {Macro} from "../../database/models/macro";
import {Guild as DiscordGuild} from 'discord.js'
import {Note} from "../../database/models/note";
import {Infraction} from "../../database/models/infraction";
import {Suggestion} from "../../database/models/suggestion";
import {IgnoredChannel} from "../../database/models/ignoredChannel";

export interface IWelcomeMessage {
    message: Message;
    userId: string;
}

export interface ORMUpdateResult<T> extends UpdateResult {
    raw: T[];
}

export abstract class IDatabase {
    ready: boolean;
    abstract getUsers(guildId: string): Promise<User[]>;
    abstract getUser(guildId: string, userId: string): Promise<User>;
    abstract async getGuildColumn<T extends keyof Guild>(guildId: string, column: T): Promise<Guild[T] | undefined>;
    abstract async setGuildColumn<T extends keyof Guild>(guildId: string | undefined, column: T, value: Guild[T]): Promise<Partial<Guild>>;
    abstract getGuild(guildId: string): Promise<Guild> ;
    abstract getGuilds(): Promise<Guild[]>;
    abstract getMacros(guildId: string): Promise<Macro[]>;
    abstract getMacro(guildId: string, name: string): Promise<Macro | undefined>;
    abstract getMacroCount(guildId: string): Promise<number>;
    abstract getPrefix(guildId: string): Promise<string>;
    abstract addMember(target: GuildMember): Promise<Partial<User>>;
    abstract addMembers(targets: GuildMember[]): Promise<InsertResult>;
    abstract addGuild(guild: DiscordGuild): Promise<Partial<Guild>>;
    abstract addMacro(message: Message, macroName: string, macroContent?: string, macroLinks?: string[]): Promise<Partial<Macro>>;
    abstract setWelcomeChannel(guildId: string, channelId: string | undefined): Promise<Partial<Guild>>;
    abstract deleteMacro(guild: DiscordGuild, macroName: string): Promise<DeleteResult>;
    abstract addNote(guild: DiscordGuild, caller: GuildMember, target: GuildMember, noteContent: string): Promise<Partial<Note>>;
    abstract deleteNote(guild: DiscordGuild, noteId: string): Promise<DeleteResult>;
    abstract getNotes(memberId: string, guildId: string): Promise<Note[]>;
    abstract cacheWelcomeMessage(member: GuildMember, welcomeMessage: Message): void;
    abstract unCacheWelcomeMessage(member: GuildMember): Message | undefined;
    abstract removeWelcomeChannel(guildId: string): Promise<UpdateResult>;
    abstract setLogsChannel(guildId: string, channelId: string | undefined): Promise<Partial<Guild>>;
    abstract removeLogsChannel(guildId: string): Promise<UpdateResult>;
    abstract setWarningsChannel(guildId: string, channelId: string | undefined): Promise<Partial<Guild>>;
    abstract setChatChannel(guildId: string, channelId: string | undefined): Promise<Partial<Guild>>;
    abstract setUserIgnore(member: GuildMember, state: boolean): Promise<UpdateResult>;
    abstract isUserIgnored(member: GuildMember): Promise<boolean>;
    abstract getIgnoredUsers(guildId: string): Promise<User[]>;
    abstract incrementInviteStrike(member: GuildMember): Promise<number>;
    abstract getInviteStrikes(guildId: string, userId: string): Promise<number>;
    abstract incrementCleverbotCalls(guildId: string): Promise<void>;
    abstract addInfraction(staff: GuildMember, target: GuildMember, reason: string, weight: number): Promise<Partial<Infraction>>;
    abstract getInfractions(guildId: string, targetId?: string): Promise<Infraction[]>;
    abstract getInfractionById(id: number): Promise<Infraction | undefined>;
    abstract deleteInfractionById(id: number, guildId: string): Promise<DeleteResult>;
    abstract deleteAllInfractions(guildId: string, target_id: string): Promise<DeleteResult>;
    abstract incrementBanCount(guildId: string): Promise<void>;
    abstract incrementHistoryCalls(guildId: string, userId: string): Promise<void>;
    abstract getHistoryCalls(guildId: string, userId: string): Promise<number>;
    abstract addMutedUser(guildId: string, userId: string, muteAmount: Date): Promise<Partial<User>>;
    abstract setMuteRole(guildId: string, role: string): Promise<void>;
    abstract getMuteRole(guildId: string): Promise<string | undefined>;
    abstract addSuggestion(message: Message, suggestion: string): Promise<Partial<Suggestion>>;
    abstract changeSuggestionStatus(id: string, status: string, reason?: string): Promise<UpdateResult>;
    abstract setSuggestionMetadata(suggestionId: string, channelId: string, embedId: string): Promise<UpdateResult>;
    abstract approveSuggestion(id: string): Promise<UpdateResult>;
    abstract denySuggestion(id: string): Promise<UpdateResult>;
    abstract acceptSuggestion(id: string, reason: string): Promise<UpdateResult>;
    abstract rejectSuggestion(id: string, reason: string): Promise<UpdateResult>;
    abstract getSuggestion(guildId: string, suggestionId: string): Promise<Suggestion | undefined>
    abstract getPendingSuggestions(guildId: string): Promise<Suggestion[]>;
    abstract incrementCommandCalls(guildId: string, userId: string): Promise<void>;
    abstract incrementMacroCalls(guildId: string, userId: string): Promise<void>;
    abstract async changeSpecificLoggingChannel(guild: DiscordGuild, type: LoggingChannelType | LoggingChannelType[], channelId: string | undefined): Promise<Partial<Guild>>;
    abstract async getChannelIgnored(guildId: string, channelId: string): Promise<IgnoredChannel | undefined>;
    abstract async getIgnoredChannels(guildId: string): Promise<IgnoredChannel[]>
    abstract async setChannelIgnored(guildId: string, channelId: string, ignorer: string, status: boolean): Promise<DeleteResult>;
}
