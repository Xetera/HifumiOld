import { List } from "immutable";
import { Command, CommandInput } from "./types";

/**
 * Used to set default values on an interface
 * @stub
 * @param createInput
 */
export const createCommand = (createInput: CommandInput): Command => ({ ...createInput, names: List(createInput.names) });
