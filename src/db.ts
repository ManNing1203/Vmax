import { Pool } from 'pg';
require('dotenv').config()
const pool = new Pool({
  user: process.env.PG_USER,
  password: String(process.env.PG_PASSWORD),
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  database: process.env.PG_DATABASE,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
    ssl: {
    rejectUnauthorized: false, // important for many cloud providers
  },
});
export default pool
// const pool = new Pool({
//   user: "REMOVED",
//   password: "REMOVED",
//   host: "db-x-ump.cg3qay8kcu4s.us-east-1.rds.amazonaws.com",
//   port: 5432,
//   database:"REMOVED",
//   connectionTimeoutMillis: 10000,
//   idleTimeoutMillis: 30000,
//   ssl: {
//     rejectUnauthorized: false, // important for many cloud providers
//   },
// });

