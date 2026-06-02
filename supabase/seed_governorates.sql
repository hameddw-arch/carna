-- Seed governorates table with Syrian provinces
INSERT INTO governorates (name, is_active) VALUES
  ('دمشق', true),           -- Damascus
  ('ريف دمشق', true),       -- Rural Damascus
  ('حلب', true),            -- Aleppo
  ('اللاذقية', true),       -- Latakia
  ('طرطوس', true),          -- Tartus
  ('حمص', true),            -- Homs
  ('حماة', true),           -- Hama
  ('إدلب', true),           -- Idlib
  ('دير الزور', true),      -- Deir ez-Zor
  ('الرقة', true),          -- Raqqa
  ('الحسكة', true),         -- Al-Hasaka
  ('درعا', true),           -- Daraa
  ('السويداء', true),       -- Suwayda
  ('القنيطرة', true)        -- Quneitra
ON CONFLICT (name) DO NOTHING;
