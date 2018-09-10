import { join } from "path";
import { Sequelize } from "sequelize-typescript";
import { getSecret, isProd } from "./config-loader";
import { logger } from "./logging";

const sequelize = new Sequelize({
	// TODO: be smarter about choosing host depending on environment (dev, docker-dev, docker-prod)
	host: isProd() ? "postgres" : "localhost",
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
});

export = sequelize;
