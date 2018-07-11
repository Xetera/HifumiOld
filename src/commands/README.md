# Commands
## File Structure
Each file represents a type of category (although not 1:1 with
the categories that are seen on the bot). Every command _must_ be exported
specfically with the name **command** as that's what the globbing
feature in **CommandHandler** is looking for when loading commands.

## File Contents
A basic command file will look like this
```typescript
async function run(message: Message): Promise<any> {
    // command implementation here, nothing has to be returned
}

export const command: Command = new Command({
        names: [''],                     // [name, ...aliases]
        info: '',                        // information on what the command does
        usage: '',                       // how the command is structured
        examples: [''],                  // examples for all the different ways to execution
        category: '',                    // A single category for the command
        expects: [{type: ArgType.None}], // arguments expected from the command
        run: run,                        // execution command
        userPermissions: [],             // ?permissions required by the user
        clientPermissions: []            // ?permissions required by the bot
    }
);
```
Run also takes a second optional parameter based on what type of
arguments are expected from the user, for example:
```typescript
// if you set the 'expects' property of your command to this

{
    expects: [{type: ArgType.String}, {type: ArgType.Member}]
}

// Your run command would look like this

async function run(message: Message, input: [string, GuildMember]){}
```
The arguments will be passed down to the function in the order that
the user enters it in.
