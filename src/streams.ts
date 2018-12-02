import { Subject } from "rxjs";
import { SemiContext } from "./types/types";

export const contextStream$ = new Subject<SemiContext>();
export const editStream$ = new Subject<SemiContext>();
// export const musicStream$ = new Subject<Map<string, >>();
