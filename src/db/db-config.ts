import { join } from "path";
import { ConnectionOptions } from "typeorm";
import { isDev, isTest } from "../utils/env";
import { getEnvConfig, getFileConfig } from "../config/config-loader";
import { PostgresNamingStrategy } from "./PostgresNamingStrategy";

const typeormConf: ConnectionOptions = {
  type: "postgres",
  logging: isDev() ? "all" : false,
  namingStrategy: new PostgresNamingStrategy(),
  host: getEnvConfig("POSTGRES_HOST", "postgres_primary"),
  username: getEnvConfig("POSTGRES_USER", "money_dashboard"),
  password: getFileConfig(getEnvConfig("POSTGRES_PASSWORD_FILE")),
  database: getEnvConfig("POSTGRES_DATABASE", isTest() ? "money_dashboard_test" : "money_dashboard"),
  entities: [join(__dirname, "models", "*.js")],
};

export { typeormConf };
