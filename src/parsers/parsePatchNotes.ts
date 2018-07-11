import * as fs from "fs";

export function parsePatchNotes(file?: string): Promise<[string, string]> {
    return new Promise((resolve, reject) => {
        fs.readdir('updates', (err, files) => {
            let target: string | undefined;

            if (err){
                throw err;
            }

            if (file){
                target = files.find(fname => fname + '.txt' === file) ;
            }

            else {
                target = files.sort().pop()!;
            }

            if (!target){
                return reject(new Error(`File ${file} was not found`))
            }

            fs.readFile(`updates/${target}`, (err1, data) => {
                if (err1 || !target){
                    throw err1;
                }
                const dots = target.split('.');
                dots.pop();
                const fileName = dots.join('.');
                resolve([fileName, data.toString()]);
            });
        });
    });
}
