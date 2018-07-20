# RaidFilter [Class Brainstorm]
This class should have all the tools necessary to deal with raiders.
The necessary checks for raiding should be happening here even if the
actions that are carried out aren't.

### Raider Checklist
* **Is the user spamming?**
    * This should already be covered by other
    listeners, the logic for classifying a raider should be happening
    here though, as this class will has all the resources to do the checks.

* **Message similarity | Raid phrases**
    * How closely does the user's message resemble the recent
    messages sent in the channel? Most raiders send the same message
    from all the bots they control.

    * Even though most raiders tend to be pretty dumb,
    it might be good to use a fuzzy matching algorithm here
    to make sure we're catching for all cases where a large message
    might have a small placeholder and what not.

    * When catching for message similarity, multiple raid phrases
    should be able to take place, where sending a matching message
    will get you muted and put on a raid list. The server admins
    should then have the ability to view the currently active
    raid phrases and see which (or how many, depending on the size)
    people have been muted by which phrase.

    * Once a raid phrase is automatically registered after detection,
    MessageQueue should be checked again and those with previously
    matching messages should be muted retroactively.

    * These will be checked using the cached messages inside
    MessageQueue class and not discord requests to make sure there's
    a really fast response time.

* **Join date**
    * Checking for join date is not a perfect solution but it will
    be enough to deal with an overwhelming majority of raiders.
    Slow raids are incredibly rare, I've yet to see one being a
    moderator of a 17k people server.

* **Name similarity?**
    * Not sure if this would ever be useful, there's a big chance
    this might result in false positives. However, it might be a
    good idea to check for previous raiders that have shared the
    same name.

    * This might again come with its own problems just because names
    generally tend to be quite similar to one another. If we were to
    implement this it would **have** to be working only on cache and
    not a database, it would also have to have options to forget raider
    names to prevent annoyances to mods.

### Functionality
* **Suspend welcomes and join/leave logging**
    * This tends to be the big contributor to bots locking up,
    we shouldn't be logging or welcoming raiders once

* **Persistent raider database**
    * This could be implemented in the form of a global watchlist,
    but if not, the raid history of a server should be available to
    mods regardless. This would most likely be an addition to
    [Issue 55](https://github.com/ilocereal/Hifumi/issues/55) with
    additional columns like **is_raid_ban** and **raid_phrase**
    to account for automatic raid bans in addition to regular bans.

    * To do this, we would mark raid bans with an identifier the way
    tracked bans are marked with **\<Tracked\>** for when we check ban events.
    However, in order to not lose context of things like the muting
    raid phrase, it would have to be marked with something along the
    lines of **\<RaidBan\>**, or something of similiar and familiar
    syntax to be able to re-fetch the user data from the RaidFilter class.

### Schema

Since we're already using redis to cache things from the databse, we
could just do that on here but for now objects should be enough.

#### Basic overview [WIP]

```typescript
interface IRaider extends MutedMember {
    raidPhrase: string;


}
interface IRaidedGuild {
    guildId: string;
    members: {
       [userId]: IRaider;
    }

}
interface IRaids {
    [guildId]: IRaidedGuild
}
```


