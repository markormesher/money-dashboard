import { TransformableInfo } from "logform";
import { format } from "logform";
const Winston = require("winston");

const consoleLogFormat = format.combine(
		format.timestamp(),
		format.json(),
		format.align(),
		format.printf((info: TransformableInfo) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const fileLogFormat = format.combine(
		format.timestamp(),
		format.json()
);

const logger = Winston.createLogger({
	format: fileLogFormat,
	transports: [
		new Winston.transports.File({ filename: "logs/error.log", level: "error" }),
		new Winston.transports.File({ filename: "logs/all.log", level: "info" })
	]
});

if (process.env.ENV !== "prod") {
	logger.add(new Winston.transports.Console({
		format: consoleLogFormat,
		level: "debug"
	}));
}

export {
	logger
};
