import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

@Injectable()
export class CategoryService {
  constructor(private db: DatabaseService) {}

  private get pool() {
    return this.db.getPool();
  }

  // CREATE (POST)
  async createCategory(name: string, description?: string) {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'INSERT INTO categories (category_name, description) VALUES (?, ?)',
      [name, description || null]
    );
    return { id: result.insertId, name, description };
  }

  // READ ALL (GET)
  async getAll() {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT category_id AS id, category_name AS name, description FROM categories'
    );
    return rows;
  }

  // READ ONE (GET /:id)
  async findById(id: number) {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT category_id AS id, category_name AS name, description FROM categories WHERE category_id = ?',
      [id]
    );
    if (!rows[0]) throw new NotFoundException('Category not found');
    return rows[0];
  }

  // UPDATE (PUT /:id)
  async updateCategory(id: number, name?: string, description?: string) {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'UPDATE categories SET category_name = COALESCE(?, category_name), description = COALESCE(?, description) WHERE category_id = ?',
      [name || null, description || null, id]
    );
    if (result.affectedRows === 0) throw new NotFoundException('Category not found');
    return { message: 'Category updated successfully' };
  }

  // DELETE (DELETE /:id)
  async deleteCategory(id: number) {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'DELETE FROM categories WHERE category_id = ?',
      [id]
    );
    if (result.affectedRows === 0) throw new NotFoundException('Category not found');
    return { message: 'Category deleted successfully' };
  }
}