// No idea how this works, copy pasted from somewhere, god bless
import {gb} from "../misc/Globals";

function getEditDistance(a: string, b: string): number {
    const an = a ? a.length : 0;
    const bn = b ? b.length : 0;
    if (an === 0)
    {
        return bn;
    }
    if (bn === 0)
    {
        return an;
    }
    const matrix = new Array<number[]>(bn + 1);
    for (let i = 0; i <= bn; ++i)
    {
        let row = matrix[i] = new Array<number>(an + 1);
        row[0] = i;
    }
    const firstRow = matrix[0];
    for (let j = 1; j <= an; ++j)
    {
        firstRow[j] = j;
    }
    for (let i = 1; i <= bn; ++i)
    {
        for (let j = 1; j <= an; ++j)
        {
            if (b.charAt(i - 1) === a.charAt(j - 1))
            {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else
            {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1], // substitution
                    matrix[i][j - 1], // insertion
                    matrix[i - 1][j] // deletion
                ) + 1;
            }
        }
    }
    return matrix[bn][an];
}

interface DistanceType {
    name: string;
    distance: number;
}


export default function lavenshteinDistance(input: string, pool: string[] = gb.commandHandler.commands.map(c => c.names[0])): string {
    if (input.length > 20 && input.split( ' ')[0] !== 'settings')
        return 'to spam me like some kind of dummy';

    const commands: string[] = pool;
    let editDistances = commands.reduce((obj: DistanceType[], name: string) => {
        let commandEditDistance = getEditDistance(input, name);
        obj.push({
            name: name,
            distance: commandEditDistance
        });
        return obj;
    }, []);
    const newDist = editDistances.sort((prev: DistanceType, curr: DistanceType) => prev.distance - curr.distance);
    return newDist[0].name;
}
