ALTER TABLE usr ADD COLUMN active_profile_id UUID REFERENCES profile (id);
