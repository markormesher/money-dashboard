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
    profile_id uuid
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
];

export { allMigrations };
