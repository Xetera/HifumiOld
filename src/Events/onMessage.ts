import * as Discord from'discord.js'
import * as dbg from 'debug'
import {Alexa} from '../API/Alexa'
import {MessageQueue} from "../Moderation/MessageQueue";
const log = dbg('Bot: Ready');

function middleWare(){

}


export default function onMessage
(message : Discord.Message, alexa : Alexa, messageQueue : MessageQueue){

}