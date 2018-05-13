import {IAnilistDate} from "./anilist";

export default function formatAnilistDate(date: IAnilistDate){
    if (date.day && date.month && date.year){
        return `${date.month}/${date.day}/${date.year}`;
    }
    else if (!date.day && date.month && date.year){
        return `${date.month}/${date.year}`;
    }
    else if (!date.day && !date.month && date.year){
        return `${date.year}`;
    }
    return `Unknown date`;
}
