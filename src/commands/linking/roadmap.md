# Server Links
Server linking is an experimental feature that's designed
to link two servers together moderation-wise. It's a great
idea on paper but it comes with a lot of challenges that will
make it hard to implement properly.

### General Idea
Links will import bans and moderator action from one server to another
in the form of warnings. When new members who have been banned from a linked
server join, moderators will be notified via a log.

This won't include things like a server owner banning someone in one
server and that being duplicated in another server he owns. It's not
meant to sync two servers together, that can be a feature for another bot.

### Implementation Details
* Linking / importing must always be opt-in but exporting and server
visibility should be enabled by default.
* Linking should never result in any automatic-moderation by Hifumi.
This _only_ serves as a way to get information about new members.
* An importee should be able to see (if set) the exportee's current rules.
Likewise, all servers should be able to set rules for their server if they like.
This should ideally be in the form of embeds that make it easier for
moderators to reference their own rules by doing something like **$rule 1**
or searching for their previous rule embeds.
* Warnings of users should show up in their history and on join but
they should also be easy to get rid of.
* Bans or moderation with no given info should not be exported.
* Exportee servers should be notified when other servers decide to
import from them and cross-bans should be kept track in the tracklist
(not yet implemented).
* Before importing bans, the importing server should be able to see
how many bans / notifications they will be importing before confirming.
This should also give stats on how many members in the server are already
marked by the exporting server (if any) and who they are (paginated).
* There should be an option to only import automatic bans made by Hifumi
(perhaps by ban category) and none of the manual moderator bans if needed.
