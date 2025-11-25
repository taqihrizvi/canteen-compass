import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import pool from '../config/database';

async function seedDatabase() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data (in correct order due to foreign keys)
    console.log('🧹 Clearing existing data...');
    await pool.query('TRUNCATE TABLE food_suggestions CASCADE');
    await pool.query('TRUNCATE TABLE orders CASCADE');
    await pool.query('TRUNCATE TABLE menus CASCADE');
    await pool.query('TRUNCATE TABLE users CASCADE');
    console.log('✅ Existing data cleared');

    // Run the seed SQL file
    const seedSqlPath = path.join(__dirname, '../../database/seed.sql');
    const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const queries = seedSql.split(';').filter(q => q.trim() && !q.trim().startsWith('--'));
    
    for (const query of queries) {
      if (query.trim()) {
        await pool.query(query);
      }
    }

    console.log('✅ Database seeded successfully');
    console.log('');
    console.log('📧 Default credentials:');
    console.log('   Admin: admin@canteen.ai / Admin@123');
    console.log('   Manager: manager@canteen.ai / Admin@123');
    console.log('   Student: john.smith@student.edu / Admin@123');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
