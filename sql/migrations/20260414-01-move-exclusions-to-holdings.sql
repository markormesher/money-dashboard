-- add the new columns
ALTER TABLE holding ADD COLUMN exclude_from_reports BOOLEAN NOT NULL DEFAULT FALSE, ADD COLUMN exclude_from_envelopes BOOLEAN NOT NULL DEFAULT FALSE;

-- exclude all holdings that belong to currently-excluded accounts
UPDATE holding SET exclude_from_reports = TRUE WHERE id IN (SELECT id FROM holding JOIN account ON holding.account_id = account.id WHERE account.exclude_from_reports = TRUE);
UPDATE holding SET exclude_from_envelopes = TRUE WHERE id IN (SELECT id FROM holding JOIN account ON holding.account_id = account.id WHERE account.exclude_from_envelopes = TRUE);

-- remove the old columns
ALTER TABLE account DROP COLUMN exclude_from_reports, DROP COLUMN exclude_from_envelopes;
