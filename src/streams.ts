import { Subject } from "rxjs";
import { SemiContext } from "./types/types";

export const contextStream$ = new Subject<SemiContext>();
