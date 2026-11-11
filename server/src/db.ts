import { Pool } from 'pg';
require('dotenv').config()

// PG_SSL=false for a local PostgreSQL; leave unset/true for cloud databases (e.g. AWS RDS).
const useSsl = (process.env.PG_SSL ?? 'true').toLowerCase() !== 'false';

const pool = new Pool({
  user: process.env.PG_USER,
  password: String(process.env.PG_PASSWORD),
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  database: process.env.PG_DATABASE,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});
export default pool
