import 'mocha'
import {expect} from 'chai'
import {discordInviteRegex} from '../listeners/Regex'

describe('Catching invite regex', () => {
    it('Matching all invite types', () => {
        expect('https://discord.gg/nZFVvTW').to.match(discordInviteRegex);
        expect('discord.gg/nZFVvTW').to.match(discordInviteRegex);
        expect('discord.gg/programming').to.match(discordInviteRegex);
        expect('discord.gg/nZFVvTW discord.gg/programming').to.match(discordInviteRegex);
    });
    it('Not matching non-invites', () => {
        expect('discord gg dFgGVW').to.not.match(discordInviteRegex);
        expect('https://images-ext-1.discordapp.net/external/s/' +
            'https/cdn.discordapp.com/attachments/247/4192/cdk.gif').not.match(discordInviteRegex);
    })
});

