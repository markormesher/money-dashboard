import { join } from "path";
import { Sequelize } from "sequelize-typescript";
import { ConnectionOptions } from "typeorm";
import { getSecret, runningInDocker } from "./config-loader";
import { logger } from "./logging";

const sequelizeConf = {
	host: runningInDocker() ? "postgres" : "localhost",
	username: "money_dashboard",
	password: getSecret("postgres.password"),
	database: "money_dashboard",
	dialect: "postgres",
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
	operatorsAliases: false,
	modelPaths: [join(__dirname, "../models")],
	define: {
		freezeTableName: true,
		timestamps: true,
		paranoid: true,
		version: true,
	},
	logging: (query: string) => logger.verbose(query),
};

const typeormConf: ConnectionOptions = {
	type: "postgres",
	host: runningInDocker() ? "postgres" : "localhost",
	username: "money_dashboard",
	password: getSecret("postgres.password"),
	database: "money_dashboard",
	entities: [join(__dirname, "../new-models/*.js")],
};

const SequelizeDb = new Sequelize(sequelizeConf);

export {
	SequelizeDb,
	typeormConf,
};
