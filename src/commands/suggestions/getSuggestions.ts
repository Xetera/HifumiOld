import gb from "../../misc/Globals";
import {Message, MessageCollector, MessageReaction, ReactionCollector, User} from "discord.js";
import {Suggestion} from "../../database/models/suggestion";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import getSuggestionEmbed from "../../embeds/commands/suggestions/getSuggestionEmbed";
import approveSuggestion from "./_approveSuggestion";
import denySuggestion from "./_denySuggestion";
import {debug} from "../../utility/Logging";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";

async function run(message: Message): Promise<any> {
    let index = 0;
    let errored = false;
    let end = false;

    const prefix = await gb.instance.database.getPrefix(message.guild.id);
    const suggestions: Suggestion[] = await gb.instance.database.getPendingSuggestions(message.guild.id);
    const embed = await getSuggestionEmbed(message, suggestions, index, prefix);
    const suggestionMenu = <Message> await safeSendMessage(message.channel, embed);

    if (embed.title === `No suggestions`) {
        return;
    }

    const collector = new ReactionCollector(suggestionMenu, (reaction: MessageReaction, user: User) => {
        const emoji = reaction.emoji.name;
        return (emoji === '⬅' || emoji === '➡'
            || emoji === '✅' || emoji === '❌'
            || emoji === '🚪')
            && user.id === message.author.id;
    }, {time: 120000});

    collector.on('collect', async (msg: Message, collector) => {
        const emoji = collector.collected.last().emoji.name;

        if (emoji === '➡') {
            if (index + 1 < suggestions.length) {
                index++;
            }
            suggestionMenu.edit(getSuggestionEmbed(message, suggestions, index, prefix))
        }
        else if (emoji === '⬅') {
            if (index - 1 >= 0) {
                index--;
            }
            suggestionMenu.edit(getSuggestionEmbed(message, suggestions, index, prefix))
        }
        else if (emoji === '✅') {
            approveSuggestion(message, [suggestions[index].suggestion_id])
                .catch(() => {
                    errored = true;
                    suggestionMenu.delete();
                });
            suggestions.splice(index, 1);

            if (suggestions[index]) {
                suggestionMenu.edit(getSuggestionEmbed(message, suggestions, index, prefix));
            }
            else if (!suggestions.length) {
                suggestionMenu.edit(getSuggestionEmbed(message, suggestions, index, prefix));
                suggestionMenu.clearReactions();
                collector.stop();
                end = true;
            }
            else if (suggestions[index - 1]) {
                index--;
                suggestionMenu.edit(getSuggestionEmbed(message, suggestions, index, prefix));
            }
        }
        else if (emoji === '❌') {
            denySuggestion(message, [suggestions[index].suggestion_id])
                .catch(() => {
                    suggestionMenu.delete()
                });
            suggestions.splice(index, 1);

            if (suggestions[index]) {
                // we don't want to increase the index here
                // since the elements in the array slide
                // back when spliced
                suggestionMenu.edit(getSuggestionEmbed(message, suggestions, index, prefix));
            }
            else if (!suggestions.length) {
                suggestionMenu.edit(getSuggestionEmbed(message, suggestions, index, prefix));
                collector.stop();
                end = true;
            }
            else if (suggestions[index - 1]) {
                index--;
                suggestionMenu.edit(getSuggestionEmbed(message, suggestions, index, prefix));
            }
        }

        else if (emoji === '🚪') {
            return void collector.stop();
        }
        try {
            const reaction = await suggestionMenu.reactions.find(r => r.emoji.name === emoji);
            const reactionUsers = await reaction.fetchUsers();
            const user = await reactionUsers.filter(_ => _.id === message.author.id).first();
            await reaction.remove(user);
        }
        catch (e) {
            if (e.message === 'Unknown Message') {
                return;
            }
            debug.error(e, `getSuggestions`);
        }
    });

    collector.on('end', () => suggestionMenu.delete());

    if (end)
        return;
    // it's possible that the user clicks on one of the buttons and
    // gets an error before we're done putting all the reactions
    // so we don't want to have a stroke if that happens
    try {
        await suggestionMenu.react(`⬅`);
        await suggestionMenu.react(`➡`);
        await suggestionMenu.react(`✅`);
        await suggestionMenu.react(`❌`);
        await suggestionMenu.react(`🚪`);
    }
    catch (e) {
        if (e.message === 'Unknown Message') {
            return;
        }
        debug.error(e, `getSuggestions`);
    }
}

export const command: Command = new Command(
    {
        names: ['suggestions'],
        info: 'Get all the suggestions that are awaiting approval',
        usage: '{{prefix}}suggestions',
        examples: ['{{prefix}}suggestions'],
        category: 'Utility',
        expects: [{type: ArgType.None}],
        run: run,
        clientPermissions: ['MANAGE_MESSAGES'],
        userPermissions: UserPermissions.Moderator,
    }
);
