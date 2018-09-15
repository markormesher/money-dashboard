import { TransformableInfo } from "logform";
import { format } from "logform";
import Winston = require("winston");

const consoleLogFormat = format.combine(
		format.timestamp(),
		format.json(),
		format.align(),
		format.printf((info: TransformableInfo) => `${info.timestamp} ${info.level}: ${info.message}`),
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

if (process.env.NODE_ENV.indexOf("prod") === -1) {
	logger.add(new Winston.transports.Console({
		format: consoleLogFormat,
		level: "info",
	}));
}

export {
	logger,
};
