import { parseMacro } from "../parsers/parseMacro";
import templateParser from "../parsers/templateParser";
import { TemplatedMessage } from "../parsers/parsers.interface";
import { CommandParameters } from "../handlers/commands/CommandHandler";
import { Message, TextChannel } from "discord.js";
import { ArgType } from "../decorators/expects";
import argParse from "../parsers/argParse";

test("Macro parser should identify urls", async () => {
    const macro = "example text https://i.imgur.com/OOuZqtz.jpg";
    const [text, links] = await parseMacro(macro);

    expect(text).toBe("example text");
    expect(links).toBeInstanceOf(Array);
    expect(links![0]).toBe("https://i.imgur.com/OOuZqtz.jpg");
});

test("Macro parser should return broken urls as text", async () => {
    const macro = "example text http://cdn.hifumi.io/totally_real_image.png";
    const [text, links] = await parseMacro(macro);

    expect(text).toBe(
        "example text http://cdn.hifumi.io/totally_real_image.png"
    );
    expect(links).toHaveLength(0);
});

test("Macro parser should return empty on empty macros with no urls", async () => {
    const macro = "";
    const x = await parseMacro(macro);
    expect(x).toEqual(["", undefined]);
});

test("Macro parser should return just urls on url macros", async () => {
    const macro = "https://i.imgur.com/OOuZqtz.jpg";
    const x = await parseMacro(macro);
    expect(x).toEqual(["", ["https://i.imgur.com/OOuZqtz.jpg"]]);
});

test("Template parser should be identifying fields", () => {
    const templates = ["testfield", "specfield"];
    const input = "%testfield% testvalue %specfield% specvalue";
    const template = <TemplatedMessage>templateParser(templates, input);

    expect(template).toBeInstanceOf(Object);
    expect(template["testfield"]).toBe("testvalue");
    expect(template["specfield"]).toBe("specvalue");
});

const params = <CommandParameters>{};
params.message = <Message>{};
params.message.channel = <TextChannel>{};
// @ts-ignore
params.message.channel.send = function() {};

test("Argparse should be returning true on no input and no expects", async () => {
    params.expect = [{ type: ArgType.None }];
    const result = await argParse(params);
    expect(result).toBeTruthy();
});

test("Argparse should parse Strings", async () => {
    const arg = "Test message for argparse";
    params.args = arg.split(" ");
    params.expect = [{ type: ArgType.String }, { type: ArgType.Message }];
    const result = await argParse(params);
    expect(result).toBeTruthy();
});
