import { Message } from "discord.js";
import { processInput } from "../../parsers/argparse";
import { ArgType } from "../../types/parser";

/* tslint:disable */
test('Parsing input ', () => {

  const message = {
    content: '$word 1qwe3 123124 hello its me again'
  } as Message;

  const { commandName, output } = processInput(
    message, [[ArgType.Number, ArgType.Word], ArgType.Number, ArgType.Phrase]
  );
  expect(commandName).toBe('word');
  expect(output[0]).toBe('1qwe3');
  expect(output[1]).toBe(123124);
  expect(output[2]).toBe('hello its me again');

});
