import { Message } from "discord.js";
import { createLogger, format, transports } from "winston";

// @ts-ignore
const fileTransport = new (transports.File)({
  format: format.combine(
    format.label({ label: "worker" }),
    format.timestamp({
      format: "HH-MM:ss YYYY-MM-DD"
    }),
  ),
  filename: "log/%DATE%.log",
  zippedArchive: true,
  maxFiles: "14d"
});

const logFormat = format.combine(
  format.label({ label: "Hifumi" }),
  format.timestamp({
    format: 'HH-MM:ss YYYY-MM-DD'
  }),
  format.prettyPrint(),
  format.colorize(),
  format.align(),
  format.printf(info => {
    return `[${info.timestamp}] [${info.label}]@[${info.level}]: ${info.message}`;
  })
);

const consoleTransport = new transports.Console({
  format: logFormat,
  // level: process.env.LOG_LEVEL || "info"
  level: "info"
});

export const logger = createLogger({
  // format: logFormat,
  transports: [
    consoleTransport,
    fileTransport
  ],

});

export const logMessage = (message: Message) =>
  logger.info(`${message.author.username}: ${message.content}`);
