import { Message } from "discord.js";
import { processInput } from "../../parsers/argparse";
import { ArgType } from "../../types/parser";
import { List } from "immutable";

/* tslint:disable */
test('Parsing input ', () => {

  const message = {
    content: '$word 1qwe3 123124 hello its me again'
  } as Message;

  const { commandName, output } = processInput(
    message, List([List([ArgType.Number, ArgType.Word]), ArgType.Number, ArgType.Phrase])
  );
  expect(commandName).toBe('word');
  expect(output.get(0)).toBe('1qwe3');
  expect(output.get(1)).toBe(123124);
  expect(output.get(2)).toBe('hello its me again');

});
