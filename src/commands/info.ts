import {
  Message,
  MessageReaction, ReactionCollector, RichEmbedOptions,
  User
} from "discord.js";
import { createCommand } from "../command";
import { commandRegistry$ } from "../command_handler";
import { Command, Commands, Context } from "../types";


const createEmbed = (commands: Commands): RichEmbedOptions => ({
  title: 'Hifumi 2.0',
  description: "I'm still in alpha! Don't be too harsh on me",
  fields: [{
    name: 'Commands',
    value: commands.map(command => command.names.first()).join(', ')
  }]
});

const dmHelp = async (user: User) =>
  commandRegistry$.subscribe(commands => {
    const embed = createEmbed(commands);
    user.send({ embed });
  });

const help: Command = createCommand({
  names: ['help', 'h'],
  description: 'Dms you a help message',
  run: async (ctx: Context) => {
    const message = await dmHelp(ctx.message.author).then(
      async () => ctx.message.channel.send(
        '**Help is on the way, check your DMs for the help message!**\n' +
        'Others can react to this message for the next 30 seconds to get a DM as well.'
      ) as Promise<Message>
      , () => ctx.message.channel.send(
        "**I couldn't DM you! Maybe your DMs are off?**\n" +
        'Others can still react to this message for the next 30 seconds to get a DM.'
      ) as Promise<Message>
    ).then((out) => {
      out.react('📬');
      return out;
    });


    const messageFilter = (reaction: MessageReaction, user: User) =>
      reaction.emoji.name === '📬' && user.id !== message.author.id;

    const sink = new ReactionCollector(message, messageFilter, { time: 30000 });

    sink.on('collect', (reaction: MessageReaction) => {
        const user = reaction.users.last();
        return dmHelp(user);
      }
    );
  }
});

export default { help };
