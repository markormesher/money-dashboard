DELETE fROM rate WHERE id NOT IN (select MIN(id::TEXT)::UUID AS rid FROM rate GROUP BY asset_id, currency_id, date);
