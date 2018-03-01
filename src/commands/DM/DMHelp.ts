const help = require('../dmHelp.json');

export default function getDMHelp() : string {
    let commands : string[] = [];
    let lines : string = "";
    for (let i in help){
        commands.push(help[i].name);
    }
    for (let i in help){
        lines += `.${help[i].name}: ${help[i].info}\n`
    }
    lines += "\n[No prefix is needed when talking to me in private]";

    return('\`\`\`css\n' + lines + '\n\`\`\`');
}