import { QueryRunner } from "typeorm";

type IDbMigration = {
  readonly migrationNumber: number;
  readonly up: (qr: QueryRunner) => Promise<void>;
  readonly down: (qr: QueryRunner) => Promise<void>;
};

export { IDbMigration };
