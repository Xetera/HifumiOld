# Patch Note Templates
### Purpose
The template is designed to keep track of changes but also offer an easy way
for Hifumi to send it as an announcement in the form of an embed.

### Style Guideline
The patch notes will work relatively similar to how embed templating
works and will be sent in the form of a TemplatedMessage which
looks for the following keywords when parsing descriptions:

    1. %title%
    2. %description%
    3. %thumbnail%
    4. %field1%
    5. %value1%
    6. %footer%
    7. %image%
    8. %color%

The keywords **%title%**, **%thumbnail%**, **%footer%**,
**%image%** and **%color%** will be omitted and set automatically in the
patch note embeds to ensure consistency.

The values that will be used for the fields will be some of
the following:

* New Commands
* Bug Fixes
* Changes

The description most likely doesn't need to be set for
any purpose that's currently needed.

## Example
%field1% New Commands

%value1%

**$help** Sends you help

%field2% Bug Fixes

%value2%

No longer responds to empty messages

