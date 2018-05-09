# Command Handler
So this is a little bit of a spaghetti class but it makes life so much easier.
It aims to accomplish a bit of what Commando for Discord.js does but
with decorators

## Decorators
Everything about the implementation of commands are declared in decorators.

### Types

    1. @expect - The argument that is expected on the command. This is
    parsed top down meaning the first argument is the one on top,
    then the one below etc...

    2. @owner - Commands reserved for the owner

    3. @admin - Admin only commands

    3. @mod   - Mod only commands

    4. @throttle - Hard time limits between individual command calls.
    For now this is the only way to limit command calls however this
    will likely be replaced for the token bucket method that the
    cleverbot module uses in the future

`@expect` declares the expected arguments and saves it to the registry.
Commands that are called through `commandHandler._run` get their
decorators checked for the required parameters in `argParse.ts` and "throw" errors
before each function implementation is even entered.
