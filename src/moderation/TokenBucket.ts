import moment = require("moment");
import {BucketCommand, ITokenBucket, Ticket} from "../interfaces/injectables/tokenBucket.interface";

import 'reflect-metadata'
import {injectable} from "inversify";

@injectable()
export default class TokenBucket implements ITokenBucket {
    cleverbotBucket: BucketCommand = {
        tokenRefillRate: 95,
        tokenCap: 400,
        cost: 235
    };
    registry: {[command: string]: BucketCommand} = {};
    cleverbot: {[user: string]: Ticket} = {};
    commands: {[user: string]: Ticket} = {};
    // tokens increase every 0.2 seconds
    private static _createTicket(){
        return <Ticket> {
            tokens: 500,
            lastRequest: new Date()
        }
    }

    private _calculateCleverbotRateLimit(user: string): boolean {
        const command = this.cleverbotBucket;
        const target = this.cleverbot[user];
        const diff = moment(new Date()).diff(target.lastRequest);
        const seconds = diff / 1000;

        if (seconds * command.tokenRefillRate + target.tokens > command.tokenCap){
            target.tokens = command.tokenCap;
        }
        else {
            target.tokens += seconds * command.tokenRefillRate;
        }
        target.tokens -= command.cost;

        if (target.tokens < 0){
            // in case the user freaks out and sends another message right after
            target.tokens = command.tokenCap / 2;
            target.tokens += seconds * command.tokenRefillRate;
            return true;
        }

        target.lastRequest = new Date();
        return false;
    }

    public registerCommand(commandName: string, tokenFlow: number, err: (msg: string) => any){
        if (this.registry[commandName]){
            return err(`Command already exists`);
        }
        this.registry[commandName] = {
            tokenCap: 500,
            tokenRefillRate: tokenFlow,
            cost: 10
        };
    }

    public isCleverbotRateLimited(user: string){
        const target = this.cleverbot[user];
        if (!target){
            this.cleverbot[user] = TokenBucket._createTicket();
            return this._calculateCleverbotRateLimit(user);
        }
        return this._calculateCleverbotRateLimit(user)
    }
}
