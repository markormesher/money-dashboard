/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryRunner } from "typeorm";
import { PostgresNamingStrategy } from "../PostgresNamingStrategy";
import { getTransactionQueryBuilder } from "../../managers/transaction-manager";
import { DbTransaction } from "../models/DbTransaction";
import { IDbMigration } from "./IDbMigration";

const ns = new PostgresNamingStrategy();

function dateIsInBst(input: number): boolean {
  const date = new Date(input);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  switch (y) {
    case 2017:
      return (m > 3 || (m === 3 && d >= 26)) && (m < 10 || (m === 10 && d < 29));
    case 2018:
      return (m > 3 || (m === 3 && d >= 25)) && (m < 10 || (m === 10 && d < 28));
    case 2019:
      return (m > 3 || (m === 3 && d >= 31)) && (m < 10 || (m === 10 && d < 27));
    case 2020:
      return (m > 3 || (m === 3 && d >= 29)) && (m < 10 || (m === 10 && d < 25));
  }
  throw new Error("dateIsInBst() only accepts dates between 2017 and 2020 inclusive.");
}

const allMigrations: IDbMigration[] = [
  // create initial tables
  {
    migrationNumber: 1,
    up: (qr: QueryRunner): Promise<any> => {
      return qr.query(`
CREATE TABLE account (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    name character varying NOT NULL,
    type character varying DEFAULT 'current'::character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    profile_id uuid NOT NULL
);

ALTER TABLE account OWNER TO money_dashboard;

ALTER TABLE ONLY account
    ADD CONSTRAINT ${ns.primaryKeyName("account", ["id"])}
        PRIMARY KEY (id);

ALTER TABLE ONLY account
    ADD CONSTRAINT ${ns.foreignKeyName("account", ["profile_id"])}
        FOREIGN KEY (profile_id) REFERENCES profile(id);



CREATE TABLE budget (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    type character varying DEFAULT 'budget'::character varying NOT NULL,
    amount double precision NOT NULL,
    start_date integer NOT NULL,
    end_date integer NOT NULL,
    category_id uuid,
    profile_id uuid
);

ALTER TABLE budget OWNER TO money_dashboard;

ALTER TABLE ONLY budget
    ADD CONSTRAINT ${ns.primaryKeyName("budget", ["id"])}
        PRIMARY KEY (id);

ALTER TABLE ONLY budget
    ADD CONSTRAINT ${ns.foreignKeyName("budget", ["category_id"])}
        FOREIGN KEY (category_id) REFERENCES category(id);

ALTER TABLE ONLY budget
    ADD CONSTRAINT ${ns.foreignKeyName("budget", ["profile_id"])}
        FOREIGN KEY (profile_id) REFERENCES profile(id);



CREATE TABLE category (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    is_memo_category boolean DEFAULT false NOT NULL,
    is_income_category boolean DEFAULT false NOT NULL,
    is_expense_category boolean DEFAULT false NOT NULL,
    is_asset_growth_category boolean DEFAULT false NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    profile_id uuid
);

ALTER TABLE category OWNER TO money_dashboard;

ALTER TABLE ONLY category
    ADD CONSTRAINT ${ns.primaryKeyName("category", ["id"])}
        PRIMARY KEY (id);

ALTER TABLE ONLY category
    ADD CONSTRAINT ${ns.foreignKeyName("category", ["profile_id"])}
        FOREIGN KEY (profile_id) REFERENCES profile(id);



CREATE TABLE profile (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE profile OWNER TO money_dashboard;

ALTER TABLE ONLY profile
    ADD CONSTRAINT ${ns.primaryKeyName("profile", ["id"])}
        PRIMARY KEY (id);



CREATE TABLE transaction (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    transaction_date integer NOT NULL,
    effective_date integer NOT NULL,
    amount double precision NOT NULL,
    payee character varying NOT NULL,
    note character varying,
    deleted boolean DEFAULT false NOT NULL,
    account_id uuid,
    category_id uuid,
    profile_id uuid,
    creation_date timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE transaction OWNER TO money_dashboard;

ALTER TABLE ONLY transaction
    ADD CONSTRAINT ${ns.primaryKeyName("transaction", ["id"])}
        PRIMARY KEY (id);

ALTER TABLE ONLY transaction
    ADD CONSTRAINT ${ns.foreignKeyName("transaction", ["account_id"])}
        FOREIGN KEY (account_id) REFERENCES account(id);

ALTER TABLE ONLY transaction
    ADD CONSTRAINT ${ns.foreignKeyName("transaction", ["category_id"])}
        FOREIGN KEY (category_id) REFERENCES category(id);

ALTER TABLE ONLY transaction
    ADD CONSTRAINT ${ns.foreignKeyName("transaction", ["profile_id"])}
        FOREIGN KEY (profile_id) REFERENCES profile(id);



CREATE TABLE "user" (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    google_id character varying NOT NULL,
    display_name character varying NOT NULL,
    image character varying NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    active_profile_id uuid
);

ALTER TABLE "user" OWNER TO money_dashboard;

ALTER TABLE ONLY "user"
    ADD CONSTRAINT ${ns.primaryKeyName("user", ["id"])}
        PRIMARY KEY (id);

ALTER TABLE ONLY "user"
    ADD CONSTRAINT ${ns.foreignKeyName("user", ["active_profile_id"])}
        FOREIGN KEY (active_profile_id) REFERENCES profile(id);



CREATE TABLE user_profiles_profile (
    user_id uuid NOT NULL,
    profile_id uuid NOT NULL
);

ALTER TABLE user_profiles_profile OWNER TO money_dashboard;

ALTER TABLE ONLY user_profiles_profile
    ADD CONSTRAINT ${ns.primaryKeyName("user_profiles_profile", ["user_id", "profile_id"])}
        PRIMARY KEY (user_id, profile_id);

ALTER TABLE ONLY user_profiles_profile
    ADD CONSTRAINT ${ns.foreignKeyName("user_profiles_profile", ["user_id"])}
        FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;

ALTER TABLE ONLY user_profiles_profile
    ADD CONSTRAINT ${ns.foreignKeyName("user_profiles_profile", ["profile_id"])}
        FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE;
            `);
    },
    down: (qr: QueryRunner): Promise<any> => {
      return qr.query(`
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS budget;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS profile;
DROP TABLE IF EXISTS transaction;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS user_profiles_profile;
            `);
    },
  },

  // convert dates to MS timestamps
  {
    migrationNumber: 2,
    up: (qr: QueryRunner): Promise<any> => {
      return qr.query(`
ALTER TABLE budget
    ALTER COLUMN start_date TYPE bigint,
    ALTER COLUMN end_date TYPE bigint;

ALTER TABLE transaction
    ALTER COLUMN transaction_date TYPE bigint,
    ALTER COLUMN effective_date TYPE bigint;

UPDATE budget SET
    start_date = start_date * 1000,
    end_date = end_date * 1000;

UPDATE transaction SET
    transaction_date = transaction_date * 1000,
    effective_date = effective_date * 1000;
        `);
    },
    down: (qr: QueryRunner): Promise<any> => {
      return qr.query(`
UPDATE budget SET
    start_date = ROUND(start_date / 1000),
    end_date = ROUND(end_date / 1000);

UPDATE transaction SET
    transaction_date = ROUND(transaction_date / 1000),
    effective_date = ROUND(effective_date / 1000);

ALTER TABLE budget
    ALTER COLUMN start_date TYPE integer,
    ALTER COLUMN end_date TYPE integer;

ALTER TABLE transaction
    ALTER COLUMN transaction_date TYPE integer,
    ALTER COLUMN effective_date TYPE integer;
        `);
    },
  },

  {
    migrationNumber: 3,
    up: async (): Promise<any> => {
      const oneHourInMs = 60 * 60 * 1000;
      const transactions = await getTransactionQueryBuilder().getMany();
      const editPromises: Array<Promise<DbTransaction>> = [];
      transactions.forEach((t) => {
        let edited = false;
        if (dateIsInBst(t.transactionDate)) {
          t.transactionDate += oneHourInMs;
          edited = true;
        }
        if (dateIsInBst(t.effectiveDate)) {
          t.effectiveDate += oneHourInMs;
          edited = true;
        }
        if (edited) {
          editPromises.push(t.save());
        }
      });
      return Promise.all(editPromises);
    },
    down: async (): Promise<any> => {
      const oneHourInMs = 60 * 60 * 1000;
      const transactions = await getTransactionQueryBuilder().getMany();
      const editPromises: Array<Promise<DbTransaction>> = [];
      transactions.forEach((t) => {
        let edited = false;
        if (dateIsInBst(t.transactionDate - oneHourInMs)) {
          t.transactionDate -= oneHourInMs;
          edited = true;
        }
        if (dateIsInBst(t.effectiveDate - oneHourInMs)) {
          t.effectiveDate -= oneHourInMs;
          edited = true;
        }
        if (edited) {
          editPromises.push(t.save());
        }
      });
      return Promise.all(editPromises);
    },
  },

  {
    migrationNumber: 4,
    up: async (qr): Promise<any> => {
      return qr.query(`ALTER TABLE account ADD COLUMN note character varying;`);
    },
    down: async (qr): Promise<any> => {
      return qr.query(`ALTER TABLE account DROP COLUMN note;`);
    },
  },

  {
    migrationNumber: 5,
    up: async (qr): Promise<any> => {
      // correct all dates to start-of-day
      return qr.query(
        `UPDATE transaction SET effective_date = floor(effective_date / 86400000) * 86400000, transaction_date = floor(transaction_date / 86400000) * 86400000;`,
      );
    },
    down: async (): Promise<any> => {
      // we can't undo this
      return Promise.resolve();
    },
  },

  {
    migrationNumber: 6,
    up: async (qr): Promise<any> => {
      return qr.query(`ALTER TABLE account ADD COLUMN tags character varying[] DEFAULT '{}';`);
    },
    down: async (qr): Promise<any> => {
      return qr.query(`ALTER TABLE account DROP COLUMN tags;`);
    },
  },

  {
    migrationNumber: 7,
    up: async (qr): Promise<any> => {
      return qr.query(`ALTER TABLE account ADD COLUMN currency character varying DEFAULT 'GBP';`);
    },
    down: async (qr): Promise<any> => {
      return qr.query(`ALTER TABLE account DROP COLUMN currency;`);
    },
  },

  {
    migrationNumber: 8,
    up: async (qr): Promise<any> => {
      return qr.query(`ALTER TABLE account RENAME currency TO currency_code;`);
    },
    down: async (qr): Promise<any> => {
      return qr.query(`ALTER TABLE account RENAME currency_code TO currency;`);
    },
  },

  {
    migrationNumber: 9,
    up: (qr: QueryRunner): Promise<any> => {
      return qr.query(`
CREATE TABLE exchange_rate (
    currency_code character varying NOT NULL,
    date bigint NOT NULL,
    rate_per_gbp double precision NOT NULL
);

ALTER TABLE exchange_rate OWNER TO money_dashboard;

ALTER TABLE ONLY exchange_rate
    ADD CONSTRAINT ${ns.primaryKeyName("account", ["currency_code", "date"])}
        PRIMARY KEY (currency_code, date);
            `);
    },
    down: (qr: QueryRunner): Promise<any> => {
      return qr.query(`DROP TABLE IF EXISTS exchange_rate;`);
    },
  },

  {
    migrationNumber: 10,
    up: async (qr): Promise<any> => {
      return qr.query(`ALTER TABLE exchange_rate ADD COLUMN update_time bigint NOT NULL default -1;`);
    },
    down: async (qr): Promise<any> => {
      return qr.query(`ALTER TABLE exchange_rate DROP COLUMN update_time;`);
    },
  },

  // disconnect users from google
  {
    migrationNumber: 19,
    up: (qr: QueryRunner): Promise<any> => {
      return qr.query(`
                ALTER TABLE "user"
                    DROP COLUMN google_id;
                ALTER TABLE "user"
                    ADD COLUMN external_username CHARACTER VARYING DEFAULT NULL;
            `);
    },
    down: (qr: QueryRunner): Promise<any> => {
      return qr.query(`
                ALTER TABLE "user"
                    DROP COLUMN external_username;
                ALTER TABLE "user"
                    ADD COLUMN google_id CHARACTER VARYING DEFAULT NULL;
            `);
    },
  },

  // create stock prices storage
  {
    migrationNumber: 20,
    up: (qr: QueryRunner): Promise<any> => {
      return qr.query(`
CREATE TABLE stock_price (
    ticker character varying NOT NULL,
    date bigint NOT NULL,
    rate_per_base_currency double precision
);

ALTER TABLE stock_price OWNER TO money_dashboard;

ALTER TABLE ONLY stock_price
    ADD CONSTRAINT ${ns.primaryKeyName("stock_price", ["ticker", "date"])}
        PRIMARY KEY (ticker, date);
            `);
    },
    down: (qr: QueryRunner): Promise<any> => {
      return qr.query(`DROP TABLE IF EXISTS stock_price;`);
    },
  },

  {
    migrationNumber: 21,
    up: async (qr): Promise<any> => {
      return qr.query(`ALTER TABLE account ADD COLUMN stock_ticker character varying DEFAULT NULL;`);
    },
    down: async (qr): Promise<any> => {
      return qr.query(`ALTER TABLE account DROP COLUMN stock_ticker;`);
    },
  },

  {
    migrationNumber: 22,
    up: (qr: QueryRunner): Promise<any> => {
      return qr.query(`
CREATE TABLE envelope (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    name character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    profile_id uuid NOT NULL
);

ALTER TABLE envelope OWNER TO money_dashboard;

ALTER TABLE ONLY envelope
    ADD CONSTRAINT ${ns.primaryKeyName("envelope", ["id"])}
        PRIMARY KEY (id);


CREATE TABLE category_to_envelope_allocation (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    start_date integer NOT NULL,
    category_id uuid NOT NULL,
    envelope_id uuid NOT NULL,
    profile_id uuid NOT NULL
);

ALTER TABLE category_to_envelope_allocation OWNER TO money_dashboard;

ALTER TABLE ONLY category_to_envelope_allocation
    ADD CONSTRAINT ${ns.primaryKeyName("category_to_envelope_allocation", ["id"])}
        PRIMARY KEY (id);
            `);
    },
    down: (qr: QueryRunner): Promise<any> => {
      return qr.query(`DROP TABLE IF EXISTS envelope;`);
      return qr.query(`DROP TABLE IF EXISTS category_to_envelope_allocation;`);
    },
  },
];

export { allMigrations };
