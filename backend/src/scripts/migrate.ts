import fs from 'fs';
import path from 'path';
import pool from '../config/database';

async function runMigrations() {
  console.log('🔄 Running database migrations...');

  try {
    const initSqlPath = path.join(__dirname, '../../database/init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');

    await pool.query(initSql);

    console.log('✅ Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
