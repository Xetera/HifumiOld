import {discordInviteRegex, hexRegex} from '../listeners/Regex'

test('Catching invite regex', () => {
    const invites = [
        'https://discord.gg/nZFVvTW',
        'discord.gg/nZFVvTW',
        'discord.gg/programming',
        'discord.gg/nZFVvTW discord.gg/programming'
    ];
    invites.forEach(invite => {
        expect(invite).toMatch(discordInviteRegex);
    });
});

test('Not matching non-invites', () => {
    expect('discord gg dFgGVW').not.toMatch(discordInviteRegex);
    expect('https://images-ext-1.discordapp.net/external/s/' +
        'https/cdn.discordapp.com/attachments/247/4192/cdk.gif').not.toMatch(discordInviteRegex);
});

test('Matching hex regex', () => {
    expect('0x00ff00').toMatch(hexRegex);
    expect('#ffffff').toMatch(hexRegex);
});

test('Not matching invalid hex regex', () => {
    expect('gfffff').not.toMatch(hexRegex);
    expect('#asdjlh').not.toMatch(hexRegex);
});
