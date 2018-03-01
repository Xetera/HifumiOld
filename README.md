# Alexa 

Moderation based discord bot written in Typescript - inspired by [hotbot](https://github.com/AberrantFox/hotbot)

Currently hosted on [heroku](https://www.heroku.com/) and using [Discord.js](https://github.com/discordjs/discord.js)

<img align="middle;" src="https://cdn.discordapp.com/avatars/372615866652557312/9a96e77dd6bfe50474c39e10e3548af3.png?size=256">

## Whatcha Got:
![convo](https://image.flaticon.com/icons/png/128/99/99678.png) 

Alexa responds to everything you say if you say her name.
- Optional: She responds to every message if you make a channel called 'chat-with-alexa' unless starting your message with a dash

![ban](https://cdn.discordapp.com/emojis/230072259933503488.png?v=1) 

Detecting spammers and automatically muting them for a set amount of time. 
* This requires a role called 'muted' that has no permissions other than reading chat and history
* The muted rule must be overriding category permissions
* The channel permissions must either be synched with the category or have its own mute permission

By default she doesn't allow advertising on your server (discord invite links), you can make exceptions or completely enable it.

<img src="https://cdn.discordapp.com/emojis/414332109407387649.png?v=1"></img>


Logging join and leave times by default on channel 'logs'

Additional greeting on a channel of your choice
<br/><br/><br/>


## Currently required permissions:
* Read Messages - pretty
* Send Messages - obvious
* Manage Messages - deleting spam and invites
* Manage Roles - for adding the 'muted' role to users
* Add Reactions - Alexa reacts to messages she hears with 👀 and 👋 when greeting new members
* Ban Members - Banning users who post over 5 (later variable) invites and potentially people sitting in the mute queue
* Change Nickname(?) Shouldn't really be required unless I add a command for it later
* Manage Nicknames(?) Could add an automatic nick changer later for people whos name matches with blacklisted words or something similar

# TODO:
In order of importance per topic

## General:
- [x] Overhaul bot.js to typescript
- [x] Move hosting to heroku
- [x] Removed compiled js files from project
- [x] Rework the way commands are called
- [ ] Add exceptions for bot owner and mods for invite and spam
- [x] Split debugging on a per/module basis
- [x] Remaining files converted to typescript
- [ ] Remind Me module
- [ ] Add module that lets users give themselves roles **-Low priority**
- [x] Safe handling of actions like message deletion and PMing users
- [ ] Allow users to disable the cleverbot feature of alexa

## Database:
- [x] Implement a relational database that works for heroku as well -> Postgres
- [x] Guild specific prefix change
- [x] Save the amount of invites a user has sent invites 
- [x] Option to set default channels for welcome messages other than 'welcome'
- [ ] Add the users' mute duration to postgres along with caching
- [ ] Save the security level of guilds to postgres

## Moderation:
- [x] Muting spamming users
- [x] Removing invite links
- [x] Remove invite links
- [x] Unmuting users based on security level
- [ ] Option for mass banning muted users from a short interval
- [ ] Save autobanned (not manually) users to a global watchlist
- [ ] Option to set default moderator warnings channel
- [ ] Alert mods when users on a watchlist from another server joins
- [ ] Blacklisted / restricted words
- [ ] Blacklisted links

## Music: **-Low priority**
- [x] Play basic songs off youtube
- [ ] Adjustable volume
- [ ] Queuing up songs

## API: 
- [x] Cleverbot module rewritten - [clevertype](https://github.com/ilocereal/Clevertype) 
- [ ] Brawlhalla API rewritten for typescript
- [ ] Integrate own battlerite API **-Low priority**
- [ ] Reintroduce the weather module
- [ ] Get cleverbot to store CS per user **-Low priority**

## Way Later: **-Very Low priority** cuzitsreallyhard
- [ ] Intent analysis for communicating with Alexa
- [ ] Voice support for communicating with alexa 
