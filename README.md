<a href="https://discordapp.com/oauth2/authorize?client_id=372615866652557312&scope=bot&permissions=268463300">
    <img src="assets/banners/hifumi_new.png">
</a>
<hr>

<table style="width:100%">
  <tr>
    <td><strong>Prefix:</strong> $</td>
      <td><strong>Language:</strong> Typescript</td>
      <td><strong>Library:</strong> Discord.js</td>
      <td><a href="https://www.hifumi.io">Hifumi's Website</a></td>
      <td><a href="https://discordapp.com/oauth2/authorize?client_id=372615866652557312&scope=bot&permissions=268463300">Invite Me!</a>       </td> 
      <td><a href="https://discord.gg/RM6KUrf">Join the Support Server</a></td>
  </tr>
</table>


## Features:

* Moderation: 🚫 Get all your moderators on the same page 
    * _**Anti-Spam**_ Hifumi automatically removes messages and mutes people when she detects spamming.
    * _**Invite Filtering**_ Invites are automatically removed and added to a users history, offenders are banned after 5 invites by default or a custom value if needed.
    * _**New Member Tracking**_ To combat raiders, she has an option to track people who have joined in the past 5 minutes more closely. Banning on 2 invites instead of the custom limit (if invites are not allowed) and banning on detecting first spam instead of muting.
    * `$history`- Pull up a user's history with information on their previous strikes, notes, invites, mutes and join dates.
    * `$strike` - Warn members when they break rules anonymously, adding to their total strikes (or not with `$warn`), strikes are automatically expire after 2 weeks, users who go past the strike limit of the server are banned automatically
    * `$note` - Note something about a specific user for a later time, saving it in the members history
    * `$mute` - Mute a user for a specific time with a given reason
    * `$cleanse` - Remove messages sent by bots in a channel
    * `$nuke` - Clean all previous messages in a channel of a given amount
    * `$snipe` - Remove messages in a channel from a specific user
    * `$ignore` - Stop listening for commands and conversations from a specific user or channel
    
* Management: 🛠️ Tools to make server management easier
    * `$suggest`- Suggest something that you would like to see get added in the server
    * `$suggestions` - Look through suggestions that are waiting approval, approve the serious ones, deny the jokes by clicking on reactions
    * `$accept` - Accept someone's suggestion with a reason. Accepting suggestions DMs the user to let them know they contributed
    * `$reject` - Reject someone's suggestion with a reason. Rejecting suggestions also DMs the user to let them know they contributed
    * `$addmacro` - Add a new custom command for Hifumi to reply to with a response of your choosing
    * `$macros` - List all the macros in the server
    * `$deletemacro` - Deletes one of the previous saved macros
* Customization: ⚙ Change Hifumi to fit your server
    * `$setgreeting` - Customize the message you want Hifumi to greet new members with
    * `$log` - Change logging settings by assigning a channel for a specific category of logs or turning it off entirely
        * Logging options: **joins**, **leaves**, **mutes**, **bans**, **unbans**, **channel management**, **suggestions**, **commands**, **invites**, **ping spam** 
    * `$settings` - Changes bot settings
        * `$settings prefix` - Changes the prefix I reply to
        * `$settings hints` - Hifumi tries to guess what you meant when you enter incorrect commands
        * `$settings reactions` - Reactions are added to certain messages, or not, if you find that annoying
        * `$settings tracking` - Enable/disable tracking of new members
        * `$settings invites` - Are invites ok to send in this server?
        * `$settings invitewarn` - Threshold for warning members for sending invites
        * `$settings inviteban` - Threshold for banning members for sending invites
        * `$settings strikelimit` - Max number of strikes a user can have before getting banned (3 by default)
        
* Fun: 🎉 Time to relax
    * `$anime` - Sends details about a specific anime and the date the next ep comes out on (if still airing)
    * `$doggo` - Sends a cute 🐶 and its breed
    * `$randomquote` - A quote... that is random
    * `$ch` - Random cyanide and happiness comic
#### Inspired by [HotBot](https://github.com/AberrantFox/hotbot) in [The Programmer's Hangout](https://discord.gg/programming)
