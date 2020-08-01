import { join } from "path";
import { ConnectionOptions } from "typeorm";
import { isDev, isTest } from "../../commons/utils/env";
import { getSecret } from "../config/config-loader";
import { PostgresNamingStrategy } from "./PostgresNamingStrategy";

const typeormConf: ConnectionOptions = {
  type: "postgres",
  logging: isDev() ? "all" : false,
  namingStrategy: new PostgresNamingStrategy(),
  replication: {
    master: {
      host: "postgres_primary",
      username: "money_dashboard",
      password: getSecret("postgres.password"),
      database: isTest() ? "money_dashboard_test" : "money_dashboard",
    },
    slaves: [
      {
        host: "postgres_replica_1",
        username: "money_dashboard",
        password: getSecret("postgres.password"),
        database: isTest() ? "money_dashboard_test" : "money_dashboard",
      },
      {
        host: "postgres_replica_2",
        username: "money_dashboard",
        password: getSecret("postgres.password"),
        database: isTest() ? "money_dashboard_test" : "money_dashboard",
      },
    ],
  },
  entities: [join(__dirname, "models", "*.js")],
};

export { typeormConf };
