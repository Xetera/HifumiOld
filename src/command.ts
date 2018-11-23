import { Command } from "./types";
import { List } from "immutable";

/**
 * Used to set default values on an interface
 * @stub
 * @param createInput
 */
export const createCommand = (createInput: Command) => ({ ...createInput });
