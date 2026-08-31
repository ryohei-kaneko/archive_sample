-- CREDGE D1 schema — Phase 1 (read-path migration only).
--
-- Mirrors the shapes already used in js/data.js 1:1 so the migration
-- script and GET /api/data can round-trip data losslessly. Array/object
-- fields (roles, portfolio_images, measurements, tags, credits) are
-- stored as JSON TEXT and decoded back into arrays/objects by the API.
--
-- claim_tokens / edit_log (the self-edit "mypage" tables) are deliberately
-- NOT created yet — they belong to Phase 2+ of the mypage plan
-- (/Users/admin/.claude/plans/splendid-chasing-hellman.md), which is not
-- being activated in this pass. Phase 1 is read-path only: the operator
-- keeps managing all data directly (via scripts/migrate-data-js-to-d1.mjs
-- re-runs, or direct SQL) exactly as they manage js/data.js today.

CREATE TABLE IF NOT EXISTS agencies (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('model', 'creative')),
  website       TEXT,
  instagram_url TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS brands (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  designer      TEXT,
  website       TEXT,
  instagram_url TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS people (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  name_en          TEXT NOT NULL,
  name_kana        TEXT,
  primary_role     TEXT NOT NULL,
  roles            TEXT,              -- JSON array, e.g. ["model","actor"]
  agency_id        TEXT REFERENCES agencies(id),
  color            TEXT,
  profile_image    TEXT,
  portfolio_images TEXT,              -- JSON array
  instagram_url    TEXT,
  composite_url    TEXT,
  measurements     TEXT,              -- JSON object {height,bust,waist,hip,shoe}
  gender           TEXT,
  direct_booking   INTEGER DEFAULT 0,
  is_verified      INTEGER DEFAULT 0,
  tags             TEXT,              -- JSON array
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_people_agency ON people(agency_id);

CREATE TABLE IF NOT EXISTS works (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  type          TEXT,
  brand_id      TEXT REFERENCES brands(id),
  brand         TEXT,                 -- display-string fallback, preserved as-is
  season        TEXT,
  year          INTEGER,
  tags          TEXT,                 -- JSON array
  is_published  INTEGER DEFAULT 1,
  featured      INTEGER DEFAULT 0,
  color         TEXT,
  accent        TEXT,
  image_url     TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_works_brand ON works(brand_id);

CREATE TABLE IF NOT EXISTS credits (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  work_id     TEXT NOT NULL REFERENCES works(id),
  credit_role TEXT NOT NULL,
  person      TEXT NOT NULL,          -- name string, unchanged linkage (pre-existing, fragile)
  order_index INTEGER DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_credits_work ON credits(work_id);
