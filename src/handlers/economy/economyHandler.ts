import gb from "../../misc/Globals";
import {debug} from "../../utility/Logging";

export interface ICurrency {
    g: number;
    s: number;
    c: number;
}

export default class EconomyHandler {
    private static _instance: EconomyHandler;
    private static denominations = [1, 100, 10000];
    private constructor(){}

    public static get instance(): EconomyHandler{
        if (!EconomyHandler._instance){
            EconomyHandler._instance = new this();
        }
        return EconomyHandler._instance;
    }

    public static formatMoney(money: number, stringify?: true, concise?: boolean) : string;
    public static formatMoney(money: number, stringify?: false, concise?: boolean) : ICurrency;
    public static formatMoney(money: number, stringify?: boolean, concise?: boolean): string | ICurrency{
        const deno = EconomyHandler.denominations;
        const curr: ICurrency = {
            g: 0,
            s: 0,
            c: 0
        };

        for (let i=deno.length - 1; i >= 0; --i){
            while (money >= deno[i]){
                money -= deno[i];
                if (deno[i] === 10000){
                    curr['g']++;
                }
                else if (deno[i] === 100){
                    curr['s']++;
                }
                else if (deno[i] === 1){
                    curr['c']++;
                }
            }
        }
        if (!stringify)
            return curr;
        return EconomyHandler.stringFormatMoney(curr, concise);
    }

    public static calculateStreak(streak: number, baseAmount: number){
        return Math.floor(baseAmount * (2 * (Math.log2(streak + 1)) + 1));
    }

    public static get moneyEmojis(){
        return [gb.emojis.get('hifumi_gold'), gb.emojis.get('hifumi_silver'), gb.emojis.get('hifumi_copper')]
    }

    public static stringFormatMoney(curr: ICurrency, concise?: boolean){
        const [gold, silver, copper] = EconomyHandler.moneyEmojis;
        if (concise)
            return `${curr.g ? `${gold} **${curr.g}** ` : ''}${curr.s ? `${silver} **${curr.s}** ` : ''}${curr.c ? `${copper} **${curr.c}**` : ''}`;
        return `${gold} **${curr.g}** ${silver} **${curr.s}** ${copper} **${curr.c}**`
    }

    public daily(){

    }
}
