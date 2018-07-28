import {StringUtils} from "../utility/Util";
import axios, {AxiosResponse} from 'axios'
import {isMedia} from "../API/imageChecker";
import {Macro} from "../database/models/macro";
import {debug} from "../utility/Logging";
import gb from "../misc/Globals";
import {AnimeUtils} from "../utility/animeUtils";
import isPicture = AnimeUtils.isPicture;

/**
 * Used before adding a macro to the database, extracts links and returns them in the following order:
 * [Text message to be sent, Attachments]
 * Either of these parameters can be undefined
 * @param {string} content
 * @returns {Promise<[(string | undefined) , (string[] | undefined)]>}
 */
export async function parseMacro(content: string): Promise<[(string | undefined), (string[] | undefined)]> {
    const words = content.split(' ');
    // only the first url should be counted
    const urls: string[] = words.filter(word => StringUtils.isUrl(word));
    if (!urls.length) {
        return [words.join(' ').trim(), undefined];
    }
    let requests;

        requests = urls.map(url => axios.head(url));
    const responses: AxiosResponse[] = [];
    for (let url of requests){
        try {
            const res = await url;
            responses.push(res);
        }
        catch (err){
            debug.error(err);
        }
    }

    const images = responses.reduce((arr, image) => {
        if (isMedia(image)) {

            const url = image.request.res.responseUrl;
            arr.push(url);
            content = content.replace(url, '');
        }
        return arr;
    }, <string[]> []);
    if (content && images.length) {
        return [content.trim(), images]
    }
    else if (content && !images.length){
        return [content.trim(), []];
    }
    else if (!content && images.length){
        return ['', images]
    }
    else {
        throw new Error(`Macro with content ${content} has no images or text`);
    }
}

export function buildMacro(macro: Macro) {
    if (macro.macro_content && macro.macro_links && macro.macro_links.length) {
        const files = macro.macro_links.map(link => {
            if (isPicture(link, true)){
                return {attachment: link}
            }
        });
        const out: any = [macro.macro_content.trim()];
        const hasValidLinks = files.filter(file => file !== undefined).length;
        if (hasValidLinks){
            out.push({files: files})
        } else {

            out[0] += '\n' + macro.macro_links.join('\n')
        }
        return out;
    }
    else if (macro.macro_content && (!macro.macro_links || !macro.macro_links.length)) {
        return [macro.macro_content.trim()];
    }
    else if (!macro.macro_content && macro.macro_links && macro.macro_links.length) {
        const files = macro.macro_links.map(link => {
            if (isPicture(link, true)){
                return {attachment: link}
            }
        });
        const out = [];
        const hasValidLinks = files.filter(file => file !== undefined).length;
        if (hasValidLinks){
            out.push({files: files})
        } else { // found links but they're not valid images, just send as text instead
            out.push('\n', macro.macro_links.join(' '))
        }
        return out;
    }
    else {
        const guild = gb.instance.bot.guilds.get(macro.guild_id);
        debug.error(
            `A macro from guild ${guild ? guild.name : 'unknown guild'} ` +
            `tried to send a macro with no content or links, this should never happen!`);

        return ["Uh oh, this macro came out completely blank. Please report this in the support server."]
    }
}
