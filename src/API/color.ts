import Anime from "./anime";
import axios, {AxiosResponse} from 'axios'
import {ColorFractions, ColorResponse} from "./color.interface";
import {RichEmbed} from "discord.js";
export default class Color {
    private static endpoint = 'http://www.thecolorapi.com/id?hex=';
    public static async getColor(hex: string): Promise<RichEmbed | undefined> {
        const response:AxiosResponse<ColorResponse> = await axios.get(this.endpoint + hex);
        const url = response.data.image.bare;
        const cleanValue = response.data.hex.value;
        const name = response.data.name.value;
        return new RichEmbed()
            .setTitle(`${cleanValue}: ${name}`)
            .setImage(url)
            .setColor(cleanValue)
    }
}
