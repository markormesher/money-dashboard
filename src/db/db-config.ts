import { join } from "path";
import { ConnectionOptions } from "typeorm";
import { isDev, isTest } from "../utils/env";
import { getSecret } from "../config/config-loader";
import { PostgresNamingStrategy } from "./PostgresNamingStrategy";

const typeormConf: ConnectionOptions = {
  type: "postgres",
  logging: isDev() ? "all" : false,
  namingStrategy: new PostgresNamingStrategy(),
  host: "postgres_primary",
  username: "money_dashboard",
  password: getSecret("postgres.password"),
  database: isTest() ? "money_dashboard_test" : "money_dashboard",
  entities: [join(__dirname, "models", "*.js")],
};

export { typeormConf };
