ALTER TABLE envelope_transfer RENAME TO envelope_transfer_old;

CREATE TABLE envelope_transfer (
  id UUID NOT NULL PRIMARY KEY,
  date DATE NOT NULL,
  amount NUMERIC(19, 4) NOT NULL,
  from_envelope_id UUID REFERENCES envelope (id),
  to_envelope_id UUID REFERENCES envelope (id),
  notes VARCHAR NOT NULL,
  profile_id UUID NOT NULL REFERENCES profile (id),
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE VIEW nullable_envelope_tranfer_to_envelope AS (
  SELECT
    envelope_transfer.id AS envelope_transfer_id,
    envelope.*
  FROM
    envelope_transfer
      LEFT JOIN envelope ON envelope_transfer.to_envelope_id = envelope.id
);

CREATE VIEW nullable_envelope_tranfer_from_envelope AS (
  SELECT
    envelope_transfer.id AS envelope_transfer_id,
    envelope.*
  FROM
    envelope_transfer
      LEFT JOIN envelope ON envelope_transfer.from_envelope_id = envelope.id
);

INSERT INTO envelope_transfer (
  SELECT
    id,
    to_timestamp(date / 1000)::DATE,
    amount,
    from_envelope_id,
    to_envelope_id,
    COALESCE(note, ''),
    profile_id,
    deleted
  FROM
    envelope_transfer_old
  WHERE
    (from_envelope_id IS NULL OR from_envelope_id IN (SELECT id FROM envelope))
    AND (to_envelope_id IS NULL OR to_envelope_id IN (SELECT id FROM envelope))
);
