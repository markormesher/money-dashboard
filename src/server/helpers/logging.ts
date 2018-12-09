import { format } from "logform";
import * as Winston from "winston";
import { isDev, isTest } from "./config-loader";

const consoleLogFormat = format.combine(
		format.colorize(),
		format.timestamp(),
		format.simple(),
);

const fileLogFormat = format.combine(
		format.timestamp(),
		format.json(),
);

const logger = Winston.createLogger({
	format: fileLogFormat,
	transports: [
		new Winston.transports.File({ filename: "logs/error.log", level: "error" }),
		new Winston.transports.File({ filename: "logs/all.log", level: "info" }),
	],
});

if (isDev() || isTest()) {
	logger.add(new Winston.transports.Console({
		format: consoleLogFormat,
		level: "info",
	}));
}

export {
	logger,
};
