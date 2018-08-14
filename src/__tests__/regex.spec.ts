import {expect} from 'chai'
import {discordInviteRegex} from '../listeners/Regex'

test('Catching invite regex', () => {
    const invites = [
        'https://discord.gg/nZFVvTW',
        'discord.gg/nZFVvTW',
        'discord.gg/programming',
        'discord.gg/nZFVvTW discord.gg/programming'
    ];
    invites.forEach(invite => {
        expect(discordInviteRegex.test(invite)).to.match;
    });
});

test('Not matching non-invites', () => {
    expect('discord gg dFgGVW').to.not.match(discordInviteRegex);
    expect('https://images-ext-1.discordapp.net/external/s/' +
        'https/cdn.discordapp.com/attachments/247/4192/cdk.gif').not.match(discordInviteRegex);
});
