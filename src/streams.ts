import { Subject } from "rxjs";
import { SemiContext } from "./types";

export const contextStream$ = new Subject<SemiContext>();
