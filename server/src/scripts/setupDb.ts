// Creates the tables (db/schema.sql) and, with --seed, loads demo data (db/seed.sql).
// Usage: npm run db:setup   |   npm run db:seed
import fs from 'fs';
import path from 'path';
import pool from '../db';

async function run(file: string) {
  const sql = fs.readFileSync(path.join(__dirname, '..', '..', 'db', file), 'utf8');
  await pool.query(sql);
  console.log(`Applied db/${file}`);
}

(async () => {
  try {
    await run('schema.sql');
    if (process.argv.includes('--seed')) await run('seed.sql');
  } catch (err) {
    console.error('Database setup failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
