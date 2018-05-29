import {EntitySubscriberInterface, EventSubscriber, InsertEvent} from "typeorm";
import {MutedUser} from "../models/mutedUser";

@EventSubscriber()
export class MutedUserSubscriber implements EntitySubscriberInterface<MutedUser> {

    /**
     * Called before entity insertion.
     */
    beforeInsert(event: InsertEvent<any>) {
        console.log(`BEFORE ENTITY INSERTED: `, event.entity);
    }

}
