import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set.');
  console.log('Create a .env file with:');
  console.log('DATABASE_URL=postgresql://taskflow:taskflow123@localhost:5432/taskflow');
  throw new Error('DATABASE_URL must be set.');
}

console.log('🔗 Connecting to PostgreSQL...');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

const db = drizzle(pool, { schema });

export { pool, db };

pool.query('SELECT 1')
  .then(() => console.log('✅ Database connection successful'))
  .catch((err) => console.error('❌ Database connection failed:', err.message));
