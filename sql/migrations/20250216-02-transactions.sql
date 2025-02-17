ALTER TABLE transaction RENAME TO transaction_old;

CREATE TABLE transaction (
  id UUID NOT NULL PRIMARY KEY,
  "date" DATE NOT NULL,
  budget_date DATE NOT NULL,
  creation_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  payee VARCHAR NOT NULL,
  notes VARCHAR NOT NULL,
  amount NUMERIC(19, 4) NOT NULL,
  unit_value NUMERIC(19, 4) NOT NULL DEFAULT 0,
  holding_id UUID NOT NULL REFERENCES holding (id),
  category_id UUID NOT NULL REFERENCES category (id),
  profile_id UUID NOT NULL REFERENCES profile (id),
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO transaction (
  SELECT
    id,
    to_timestamp(transaction_date / 1000)::DATE,
    to_timestamp(effective_date / 1000)::DATE,
    creation_date,
    payee,
    COALESCE(note, ''),
    amount,
    0,
    account_id,
    category_id,
    profile_id,
    deleted
  FROM transaction_old
);
