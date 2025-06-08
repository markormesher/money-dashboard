-- add the new column
ALTER TABLE category ADD COLUMN is_capital_event BOOLEAN NOT NULL DEFAULT FALSE;

-- update existing categories
UPDATE category SET is_capital_event = TRUE WHERE is_capital_acquisition = TRUE OR is_capital_disposal = TRUE;

-- drop the old columns
ALTER TABLE category DROP COLUMN is_capital_acquisition, DROP COLUMN is_capital_disposal;
