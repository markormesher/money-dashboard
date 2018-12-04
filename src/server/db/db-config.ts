import { join } from "path";
import { ConnectionOptions } from "typeorm";
import { getSecret, runningInDocker } from "../helpers/config-loader";
import { PostgresNamingStrategy } from "./PostgresNamingStrategy";

const typeormConf: ConnectionOptions = {
	type: "postgres",
	host: runningInDocker() ? "postgres" : "localhost",
	username: "money_dashboard",
	password: getSecret("postgres.password"),
	database: "money_dashboard",
	namingStrategy: new PostgresNamingStrategy(),
	logging: true,
	entities: [
		join(__dirname, "../models/db/*.js"),
	],
};

export {
	typeormConf,
};
