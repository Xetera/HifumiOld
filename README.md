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

### [To Features](#features)
### [To Program Structure and Architecture](#program-structure-and-architecture)
### [To Setup](#setting-up-hifumi)

## Features

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
    * `$character` - Sends information about an anime character
    * `$whatanime` - Tries to find the name and the episode of an anime from a screenshot or a gif
    * `$doggo` - Sends a cute 🐶 and its breed
    * `$randomquote` - A quote... that is random
    * `$ch` - Random cyanide and happiness comic
    
## Program Structure and Architecture

<div align="center">
    <img height="64" src="https://rynop.files.wordpress.com/2016/09/ts.png?w=816" title="Typescript">
    <img height="64" src="https://dashboard.snapcraft.io/site_media/appmedia/2016/11/postgresql-icon-256x256.jpg.png" title="Postgres">
    <img height="64" src="https://cdn.iconscout.com/public/images/icon/free/png-256/redis-open-source-logo-data-structure-399889f24f4505b1-256x256.png" title="Redis">
    <img height="64" src="https://camo.githubusercontent.com/e8293376c6ea1d2181eb2fa6f878acd806cf0114/68747470733a2f2f64317136663061656c7830706f722e636c6f756466726f6e742e6e65742f70726f647563742d6c6f676f732f36343464326631352d633564622d343733312d613335332d6163653632333538343166612d72656769737472792e706e67" title="Docker">
    <img height="64" src="https://cdn.iconscout.com/public/images/icon/free/png-128/travis-ci-company-brand-logo-3ea4b6108b6d19db-128x128.png" title="Travis CI">
    <img height="64" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/2000px-GraphQL_Logo.svg.png" title="GraphQL">
</div>

### Commands
#### Declaration
Commands are all declared under `src/commands/**/*.ts` and are globbed in `src/handlers/commands/CommandHandler.ts`.

The addition of a new command _only_ requires that a variable called `command` is exported somewhere inside `src/commands` 

#### Parsing
Before commands are called, information is parsed in `src/parsers/argParse.ts`. 

All command requirements like arguments and user/client permissions are declared in the **Command** object that is exported and parsed before calling the command.

A command is only called if these requirements are met.

All necessary arguments are passed into the `run` function's second parameter as a tuple. 

[More info...](https://github.com/Xetera/Hifumi/blob/master/src/commands/README.md)

### Database
[TypeORM](https://github.com/typeorm/typeorm) is used for all database transactions.

A Redis cache layer is used to speed up common actions like fetching guild prefixes. 

Database information is stored in `src/database` including
* Models
* Functions
* Migrations

For now, migrations are created manually for production are handled by TypeORM's CLI.

#### Backups
For database backups, python scripts are used to dump the current production db into Amazon S3 bucket.

This script is set on a cron job of regular intervals, and an X amount of backups are rotated inside the bucket, deleting the oldest version on every backup once X is reached to preserve limited bucket space.

A backup-restoration script is available to restore the latest backup if necessary.

### Inversion of Control
All objects that are required in the global scope or inside other classes are handled by [typescript-ioc](https://github.com/thiagobustamante/typescript-ioc) to avoid the usage of global singletons.

Classes that depend on other classes, such as `Cleverbot -> TokenBucket` get their dependencies declared as such
```ts
@Singleton
export class Cleverbot extends ICleverbot {
    readonly identifier : RegExp = /hifumi/i;
    cleverbot : Clevertype;
    @Inject tokenBucket: ITokenBucket;
    // implementation...
}
```

In order to not depend on classes themselves but rather an "interface" are declared as `abstract` classes instead inside `src/interfaces/injectables`.

These classes are extended to provide functionality and are injected as necessary or fetched from the container. The abstract class itself is relied upon for type inference rather than the class implementation which prevents circular dependencies.
```ts
export abstract class ICleverbot {
    identifier: RegExp;
    cleverbot: Clevertype;
    tokenBucket: ITokenBucket;
    abstract isRateLimited(id: string, message: Message): boolean;
}
```
## Setting Up Hifumi
Coming soon...

#### Inspired by [HotBot](https://gitlab.com/Aberrantfox/hotbot) in [The Programmer's Hangout](https://discord.gg/programming)

#### This repo was not originally meant to be self-hosted or contributed to, so there's quite a significant chunk of code that's either hardcoded or made to be very convenient for Hifumi in specific. Although it will be made easier in the future, you're probably going to have a hard time trying to fork or self-host this repo as of now.
