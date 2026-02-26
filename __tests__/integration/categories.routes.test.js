import request from 'supertest';
import { describe, it, expect, beforeEach } from '@jest/globals';
import app from '../../index.js';
import db from '../../src/db/indexDb.js';
import {
  createMockCategory,
  generateTestAccessToken,
  resetMocks,
} from '../setup.js';

jest.mock('../../src/db/indexDb.js');

describe('Categories Routes Integration Tests', () => {
  const accessToken = generateTestAccessToken(1);

  beforeEach(() => {
    resetMocks();
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      db.query.mockResolvedValueOnce([{ insertId: 1 }]);
      db.query.mockResolvedValueOnce([[createMockCategory()]]);

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nombre: 'New Category',
          descripcion: 'Category description',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 if nombre is missing', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          descripcion: 'Description',
        });

      expect(response.status).toBe(400);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({
          nombre: 'New Category',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/categories', () => {
    it('should retrieve all categories', async () => {
      const mockCategories = [createMockCategory(), createMockCategory({ id: 2 })];
      db.query.mockResolvedValueOnce([mockCategories]);

      const response = await request(app)
        .get('/api/categories');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should retrieve a category by id', async () => {
      const mockCategory = createMockCategory();
      db.query.mockResolvedValueOnce([[mockCategory]]);

      const response = await request(app)
        .get('/api/categories/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 404 if category not found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .get('/api/categories/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update a category', async () => {
      db.query.mockResolvedValueOnce([[createMockCategory()]]);
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .put('/api/categories/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nombre: 'Updated Category',
        });

      expect(response.status).toBe(200);
    });

    it('should return 404 if category not found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .put('/api/categories/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nombre: 'Updated',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      db.query.mockResolvedValueOnce([[createMockCategory()]]);
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .delete('/api/categories/1')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
    });

    it('should return 404 if category not found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .delete('/api/categories/999')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });
});
