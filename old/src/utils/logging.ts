import { existsSync, mkdirSync } from "fs";
import { format } from "logform";
import * as Winston from "winston";
import { runningInDocker } from "./env";

const LOG_DIR = runningInDocker() ? "/logs" : "./logs";

const consoleLogFormat = format.combine(
  format.colorize({
    colors: {
      error: "red",
      warning: "yellow",
      warn: "yellow",
      info: "green",
      verbose: "cyan",
      debug: "magenta",
    },
  }),
  format.padLevels(),
  format.timestamp(),
  format.simple(),
);

const fileLogFormat = format.combine(format.timestamp(), format.json());

const logger = Winston.createLogger({
  format: fileLogFormat,
  transports: [
    new Winston.transports.File({ filename: `${LOG_DIR}/error.log`, level: "error" }),
    new Winston.transports.File({ filename: `${LOG_DIR}/all.log`, level: "debug" }),
  ],
});

logger.add(
  new Winston.transports.Console({
    format: consoleLogFormat,
    level: "debug",
  }),
);

function ensureLogFilesAreCreated(): void {
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR);

    logger.debug(`Created ${LOG_DIR} for logs`);
  }
}

export { logger, ensureLogFilesAreCreated };
