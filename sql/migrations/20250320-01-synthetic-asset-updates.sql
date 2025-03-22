ALTER TABLE category ADD COLUMN is_synthetic_asset_update BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE category SET is_synthetic_asset_update = TRUE WHERE id IN (
  SELECT id FROM category_old WHERE is_asset_growth_category = TRUE
);
