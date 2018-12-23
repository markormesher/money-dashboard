import { join } from "path";
import { ConnectionOptions } from "typeorm";
import { getSecret } from "../helpers/config-loader";
import { PostgresNamingStrategy } from "./PostgresNamingStrategy";

const typeormConf: ConnectionOptions = {
	type: "postgres",
	namingStrategy: new PostgresNamingStrategy(),
	replication: {
		master: {
			host: "postgres_master",
			username: "money_dashboard",
			password: getSecret("postgres.password"),
			database: "money_dashboard",
		},
		slaves: [
			{
				host: "postgres_slave_1",
				username: "money_dashboard",
				password: getSecret("postgres.password"),
				database: "money_dashboard",
			},
			{
				host: "postgres_slave_2",
				username: "money_dashboard",
				password: getSecret("postgres.password"),
				database: "money_dashboard",
			},
		],
	},
	entities: [
		join(__dirname, "../models/db/*.js"),
	],
};

export {
	typeormConf,
};
