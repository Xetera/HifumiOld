import { List } from "immutable";
import { Command, CommandInput, Commands } from "./types/types";


/**
 * Used to set default values on an interface
 * @stub
 * @param createInput
 */
export const createCommand = (createInput: CommandInput): Command => ({
  ...createInput,
  names: List(createInput.names),
  canRun: createInput.canRun || (() => true)
});

export const getVisible = (commands: Commands) =>
  commands.filter(command => !command.hidden);

