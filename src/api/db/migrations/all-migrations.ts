/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryRunner } from "typeorm";
import { PostgresNamingStrategy } from "../PostgresNamingStrategy";
import { IDbMigration } from "./IDbMigration";

const ns = new PostgresNamingStrategy();

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
    ADD CONSTRAINT ${ns.foreignKeyName("budget", ["profile_id"])}
        FOREIGN KEY (profile_id) REFERENCES profile(id);

ALTER TABLE ONLY budget
    ADD CONSTRAINT ${ns.foreignKeyName("budget", ["category_id"])}
        FOREIGN KEY (category_id) REFERENCES category(id);



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
    ADD CONSTRAINT ${ns.foreignKeyName("transaction", ["profile_id"])}
        FOREIGN KEY (profile_id) REFERENCES profile(id);

ALTER TABLE ONLY transaction
    ADD CONSTRAINT ${ns.foreignKeyName("transaction", ["category_id"])}
        FOREIGN KEY (category_id) REFERENCES category(id);

ALTER TABLE ONLY transaction
    ADD CONSTRAINT ${ns.foreignKeyName("transaction", ["account_id"])}
        FOREIGN KEY (account_id) REFERENCES account(id);



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
];

export { allMigrations };
