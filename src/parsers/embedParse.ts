import { execFile } from "child_process";
import { promisify } from "util";

const execAsync = promisify(execFile);

export const parseDSLInput = (content: string) =>
  execAsync('./src/parsers/embed', content.split(' '))
    .then(({ stdout }) => JSON.parse(stdout));
