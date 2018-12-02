import { List } from "immutable";
import { Command, CommandInput, Commands } from "./types/types";
import { liftP } from "./utils";


/**
 * Used to set default values on an interface
 * @stub
 * @param createInput
 */
export const createCommand = (createInput: CommandInput): Command => ({
  ...createInput,
  names: List(createInput.names),
  expects: createInput.expects && List(createInput.expects),
  canRun: createInput.canRun || (() => true),
  /**
   * Lifting to promise to be able to await it
   * consistently in the command handler
   */
  // @ts-ignore
  run: liftP(createInput.run)
});

export const filterVisible = (commands: Commands) =>
  commands.filter(command => !command.hidden);

