ALTER TABLE currency RENAME COLUMN deleted TO active;
ALTER TABLE currency ALTER COLUMN active SET DEFAULT TRUE;
UPDATE currency SET active = NOT active;
