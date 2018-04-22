![travis](https://travis-ci.org/ilocereal/Hifumi.svg?branch=master)
![alexa](https://cdn.discordapp.com/attachments/418699380833648644/420917081131712512/alexanoinvite.png)

Moderation based discord bot written in Typescript using [Discord.js](https://github.com/discordjs/discord.js)

Currently hosted on [heroku](https://www.heroku.com/)

[Invite Me](https://discordapp.com/oauth2/authorize?client_id=372615866652557312&permissions=0&scope=bot) - Prefix: $


## Whatcha Got:

### Interaction: 🗣️

![](https://cdn.discordapp.com/emojis/414332109407387649.png?v=1)

Hifumi talks to you when she hears you say her name.
- Optional: She responds to every message if you make a channel called 'chat-with-alexa' unless starting your message with a dash
#### Note: This might become very expensive as (if) more people start using her which could eventually make it a donator feature.

She will greet new users in a channel of your choice

### Bans and moderation: 🚫

Detecting spammers and automatically muting them for a set amount of time.
* This requires a role called 'muted' that has no permissions other than reading chat and history
* The muted rule must be overriding category permissions
* The channel permissions must either be synched with the category or have its own mute permission

By default she doesn't allow advertising on your server (discord invite links), you can make exceptions or completely enable it.

Locking down guilds on demand, muting everyone for 10 minutes or longer, allowing Admins to sanely take care of situations. **PLANNED:**

### Bookkeeping: 📚

* Logging join and leave times
* Logging user mutes and duration
* Optionally logging deleted and edited messages **PLANNED**
* Warning mods on detecting potential raids **PLANNED:**


## Currently required permissions: ❓
* Read Messages - I mean,
* Send Messages - yeah...
* Manage Messages - deleting spam and invites
* Manage Roles - for adding the 'muted' role to users
* Add Reactions - Hifumi reacts to messages she hears with 👀 and 👋 when greeting new members
* Ban Members - Banning users who post over 5 (later variable) invites, spammers and potentially people sitting in the mute queue
* Change Nickname(?) Could implement a self-name change at some point but I'd ideally like to keep the Hifumi theme
* Manage Nicknames(?) Potential automatic nicknaming of users with offensive names

# TODO:
In order of importance per topic

## General: 📖
- [x] Overhaul bot.js to typescript
- [x] Move hosting to heroku
- [x] Removed compiled js files from project
- [x] Rework the way commands are called
- [x] Add exceptions for bot owner and mods for invite and spam
- [x] Split debugging on a per/module basis
- [x] Remaining files converted to typescript
- [ ] Remind Me module
- [ ] Add module that lets users give themselves roles **-Low priority**
- [x] Safe handling of actions like message deletion and PMing users
- [ ] Allow users to disable the cleverbot feature

## Database: 🖥️
- [x] Implement a relational Database that works for heroku as well -> Postgres
- [x] Guild specific prefix change
- [x] Save the amount of invites a user has sent invites
- [x] Option to set default channels for welcome messages other than 'welcome'
- [ ] Add the users' mute duration to postgres along with caching
- [ ] Save the security level of guilds to postgres

## Moderation: 🛠️
- [x] Muting spamming users
- [x] Removing invite links
- [x] Remove invite links
- [x] Unmuting users based on security level
- [ ] Option for mass banning muted users from a short interval
- [ ] Save autobanned (not manually) users to a global trackList
- [ ] Option to set default moderator warnings channel
- [ ] Alert mods when users on a trackList from another server joins
- [ ] Blacklisted / restricted words
- [ ] Blacklisted links

## Music: 🎼 **-Low priority**
- [x] Play basic songs off youtube
- [ ] Adjustable volume
- [ ] Queuing up songs

## API: 📡
- [x] Cleverbot module rewritten - [clevertype](https://github.com/ilocereal/Clevertype)
- [ ] Brawlhalla API rewritten for typescript **-Low priority**
- [ ] Integrate own battlerite API **-Low priority**
- [ ] Reintroduce the weather module
- [ ] Get cleverbot to store CS per user **-Low priority**


## Way Later: 🧠 **-Very Low priority** cuzitsreallyhard
- [ ] Intent analysis for communicating with Hifumi
- [ ] Voice support for communicating with Hifumi

#### Inspired by [HotBot](https://github.com/AberrantFox/hotbot) in [The Programmer's Hangout](https://discord.gg/programming) on discord
