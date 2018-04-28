import {Command} from "./help.interface";

const help = require('../../help.json');

export default function findCommand(name: string): Command | undefined {
    for (let i in help.commands){
        if (help.commands[i].name === name) return help.commands[i];
    }
}
