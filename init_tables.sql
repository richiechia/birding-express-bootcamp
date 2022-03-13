CREATE TABLE birding (
  id SERIAL PRIMARY KEY,
  date TEXT,
  behavior TEXT,
  flock TEXT
);

-- ALTER TABLE users
-- ADD COLUMN IF NOT EXISTS hashed_password text;


-- \l
-- \dt
-- psql -d regina -f init_tables.sql