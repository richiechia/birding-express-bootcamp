import pg from 'pg';

// const { Client } = pg;
const { Pool } = pg;

// set the way we will connect to the server
const pgConnectionConfigs = {
  user: 'richiechia',
  host: 'localhost',
  database: 'birdings',
  password: 'richiechia',
  port: 5432, // Postgres server always runs on this port
};

// create the var we'll use
const pool = new Pool(pgConnectionConfigs);

export default pool;
