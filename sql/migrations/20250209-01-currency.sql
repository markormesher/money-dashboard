ALTER TABLE currency RENAME COLUMN decimal_places TO display_precision;
ALTER TABLE currency ADD COLUMN calculation_precision INT NOT NULL DEFAULT 4;
