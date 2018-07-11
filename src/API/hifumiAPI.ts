import {Client} from "discord.js";
import axios from 'axios'
export namespace HifumiAPI {
    export async function postStats(bot: Client, users: number, guilds: number){
        const params = {
            guilds: guilds,
            users: users
        };

        const headers = {
            API_KEY: bot.token
        };

        axios.request({
            url:'http://api.testhifumi.io:3000/stats',
            params: params,
            headers: headers,
            method: 'post'
        })
    }
}
