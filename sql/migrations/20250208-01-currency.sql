ALTER TABLE currency RENAME COLUMN deleted TO active;
ALTER TABLE currency ALTER COLUMN active SET DEFAULT TRUE;
UPDATE currency SET active = NOT active;

ALTER TABLE currency_value RENAME COLUMN value TO rate;
ALTER TABLE currency_value RENAME TO currency_rates;
