import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool!: mysql.Pool;

  async onModuleInit() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '27164'),
      user: process.env.DB_USER || 'avnadmin',
      password: process.env.DB_PASSWORD || 'AVNS_iwyLLKN9u1VmBKUOAyo',
      database: process.env.DB_NAME || 'defaultdb',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });

    console.log('MySQL pool connection established successfully.');

    try {
      // Step 1: Ensure users table exists with the baseline configuration
      // Added: refresh_token column (nullable, as users won't have one until they log in)
      await this.pool.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          role ENUM('user', 'admin') DEFAULT 'user',
          refresh_token VARCHAR(255) NULL
        )
      `);

      // Step 2: Safely add the missing hashed_password column if it doesn't exist
      try {
        await this.pool.execute(`
          ALTER TABLE users ADD COLUMN hashed_password VARCHAR(255) NOT NULL AFTER username
        `);
        console.log('Column hashed_password verification completed.');
      } catch (alterError: any) {
        if (alterError.code === 'ER_DUP_FIELDNAME') {
          console.log('hashed_password column already exists. Ready to go!');
        } else {
          throw alterError;
        }
      }

      // Step 3: Safely add the missing refresh_token column to existing databases
      try {
        await this.pool.execute(`
          ALTER TABLE users ADD COLUMN refresh_token VARCHAR(255) NULL AFTER role
        `);
        console.log('Column refresh_token verification completed.');
      } catch (alterError: any) {
        if (alterError.code === 'ER_DUP_FIELDNAME') {
          console.log('refresh_token column already exists. Ready to go!');
        } else {
          throw alterError;
        }
      }

      console.log('Database initialization completed safely.');
    } catch (error) {
      console.error('Failed to initialize database table:', error);
    }
  }

  getPool() {
    return this.pool;
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}