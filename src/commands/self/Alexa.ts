import {Alexa} from "../../API/Alexa";
import {Instance} from "../../misc/Globals";
import onlyMod from "../../handlers/permissions/decorators/onlyMod";
import {CommandParameters} from "../../handlers/commands/CommandHandler";


export default function alexaSettings(params : CommandParameters){
    const args = params.args;
    const command = args.shift()!.toLowerCase();
    switch(command){
        case "mood":
            mood(params);
            break;
    }
}

const mood = (params : CommandParameters) => {
    const args = params.args;
    const command = args.shift()!.toLowerCase();

    switch(command){
        case "emotion":
            //params.alexa.setEmotion(args);
    }
};


function setEmotion(params : CommandParameters){
    if (params.args.length > 1){
        return params.message.channel.send(`❌️  `)
    }

}