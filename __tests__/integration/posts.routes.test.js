import request from 'supertest';
import { describe, it, expect, beforeEach } from '@jest/globals';
import app from '../../index.js';
import db from '../../src/db/indexDb.js';
import {
  createMockPost,
  generateTestAccessToken,
  resetMocks,
} from '../setup.js';

jest.mock('../../src/db/indexDb.js');

describe('Posts Routes Integration Tests', () => {
  const accessToken = generateTestAccessToken(1);

  beforeEach(() => {
    resetMocks();
  });

  describe('POST /api/posts', () => {
    it('should create a new post with valid data', async () => {
      db.query.mockResolvedValueOnce([{ insertId: 1 }]);
      db.query.mockResolvedValueOnce([[createMockPost()]]);

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          titulo: 'New Post Title',
          descripcion: 'This is a detailed post description with sufficient length',
          categoria_id: 1,
          ubicacion_id: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 if titulo is missing', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          descripcion: 'Description here',
          categoria_id: 1,
          ubicacion_id: 1,
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 if descripcion is too short', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          titulo: 'Title',
          descripcion: 'Short',
          categoria_id: 1,
          ubicacion_id: 1,
        });

      expect(response.status).toBe(400);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({
          titulo: 'New Post',
          descripcion: 'Description here',
          categoria_id: 1,
          ubicacion_id: 1,
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/posts', () => {
    it('should retrieve all posts', async () => {
      const mockPosts = [createMockPost(), createMockPost({ id: 2 })];
      db.query.mockResolvedValueOnce([mockPosts]);

      const response = await request(app)
        .get('/api/posts');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle pagination', async () => {
      const mockPosts = [createMockPost()];
      db.query.mockResolvedValueOnce([mockPosts]);

      const response = await request(app)
        .get('/api/posts')
        .query({ limit: 10, offset: 0 });

      expect(response.status).toBe(200);
    });

    it('should filter by categoria_id', async () => {
      const mockPosts = [createMockPost()];
      db.query.mockResolvedValueOnce([mockPosts]);

      const response = await request(app)
        .get('/api/posts')
        .query({ categoria_id: 1 });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should retrieve a post by id', async () => {
      const mockPost = createMockPost();
      db.query.mockResolvedValueOnce([[mockPost]]);

      const response = await request(app)
        .get('/api/posts/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 404 if post not found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .get('/api/posts/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should update a post with valid data', async () => {
      db.query.mockResolvedValueOnce([[createMockPost()]]);
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .put('/api/posts/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          titulo: 'Updated Title',
          descripcion: 'Updated description with sufficient length for validation',
        });

      expect(response.status).toBe(200);
    });

    it('should return 404 if post not found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .put('/api/posts/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          titulo: 'Updated Title',
        });

      expect(response.status).toBe(404);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .put('/api/posts/1')
        .send({
          titulo: 'Updated Title',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a post successfully', async () => {
      db.query.mockResolvedValueOnce([[createMockPost()]]);
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .delete('/api/posts/1')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 if post not found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .delete('/api/posts/999')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .delete('/api/posts/1');

      expect(response.status).toBe(401);
    });
  });
});
