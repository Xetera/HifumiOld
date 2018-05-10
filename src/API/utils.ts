import {IAnilistDate} from "./anilist";

export default function formatAnilistDate(date: IAnilistDate){
    return `${date.month}/${date.day}/${date.year}`;
}
