import {Client, RichEmbed} from "discord.js";
import {Container} from "typescript-ioc";

export default function pingEmbed(){
    const ping: number = (<Client> Container.get(Client)).ping;
    let color;
    if (ping < 100){
        color = '#91ff67'
    }
    else if (ping < 150){
        color = '#ebff8b'
    }
    else if (ping < 200){
        color = '#ffc879'
    }
    else if (ping < 250){
        color = '#ff855f'
    }
    else {
        color = '#ff363d'
    }
    return new RichEmbed()
        .setTitle(`Pong! 🏓`)
        .setDescription(`Latency: **${ping.toFixed(1)}** ms`)
        .setColor(color);
}
