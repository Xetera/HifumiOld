import {IClient} from "../interfaces/injectables/client.interface";

export default async function updatePresence(bot : IClient) : Promise<void> {
    let allMembers = 0;
    const guilds = bot.guilds.array();
    for (let guild of guilds){
        // don't want to show Discord Bots server count on there
        if(guild.id !== '110373943822540800'){
            const g = await guild.fetchMembers();
            allMembers += g.members.size;
        }
    }
    // HifumiAPI.postStats(bot, gb.allMembers, guilds.length);
    bot.user.setActivity(`out for ${allMembers} users | $help`, {
        type: 'WATCHING'
    });
}
