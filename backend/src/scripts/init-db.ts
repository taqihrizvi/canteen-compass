import fs from 'fs';
import path from 'path';
import pool from '../config/database';

async function initDatabase() {
  console.log('🔧 Initializing database schema...');

  try {
    const initSqlPath = path.join(__dirname, '../../database/init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');
    
    // Execute the initialization SQL
    await pool.query(initSql);

    console.log('✅ Database schema initialized successfully');
    console.log('');
    console.log('Next step: Run "npm run seed" to populate with sample data');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();
