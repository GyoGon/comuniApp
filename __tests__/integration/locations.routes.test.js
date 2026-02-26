import request from 'supertest';
import { describe, it, expect, beforeEach } from '@jest/globals';
import app from '../../index.js';
import db from '../../src/db/indexDb.js';
import {
  createMockLocation,
  generateTestAccessToken,
  resetMocks,
} from '../setup.js';

jest.mock('../../src/db/indexDb.js');

describe('Locations Routes Integration Tests', () => {
  const accessToken = generateTestAccessToken(1);

  beforeEach(() => {
    resetMocks();
  });

  describe('POST /api/locations', () => {
    it('should create a new location', async () => {
      db.query.mockResolvedValueOnce([{ insertId: 1 }]);
      db.query.mockResolvedValueOnce([[createMockLocation()]]);

      const response = await request(app)
        .post('/api/locations')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nombre: 'New Location',
          latitud: 40.7128,
          longitud: -74.006,
          ciudad: 'Test City',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 if latitud is outside valid range', async () => {
      const response = await request(app)
        .post('/api/locations')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nombre: 'New Location',
          latitud: 91, // Invalid: > 90
          longitud: -74.006,
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 if longitud is outside valid range', async () => {
      const response = await request(app)
        .post('/api/locations')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nombre: 'New Location',
          latitud: 40.7128,
          longitud: 181, // Invalid: > 180
        });

      expect(response.status).toBe(400);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/locations')
        .send({
          nombre: 'New Location',
          latitud: 40.7128,
          longitud: -74.006,
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/locations', () => {
    it('should retrieve all locations', async () => {
      const mockLocations = [createMockLocation(), createMockLocation({ id: 2 })];
      db.query.mockResolvedValueOnce([mockLocations]);

      const response = await request(app)
        .get('/api/locations');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should support pagination', async () => {
      const mockLocations = [createMockLocation()];
      db.query.mockResolvedValueOnce([mockLocations]);

      const response = await request(app)
        .get('/api/locations')
        .query({ limit: 10, offset: 0 });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/locations/:id', () => {
    it('should retrieve a location by id', async () => {
      const mockLocation = createMockLocation();
      db.query.mockResolvedValueOnce([[mockLocation]]);

      const response = await request(app)
        .get('/api/locations/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 404 if location not found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .get('/api/locations/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/locations/:id', () => {
    it('should update a location', async () => {
      db.query.mockResolvedValueOnce([[createMockLocation()]]);
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .put('/api/locations/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nombre: 'Updated Location',
          ciudad: 'Updated City',
        });

      expect(response.status).toBe(200);
    });

    it('should return 404 if location not found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .put('/api/locations/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nombre: 'Updated',
        });

      expect(response.status).toBe(404);
    });

    it('should return 400 if latitud is invalid', async () => {
      db.query.mockResolvedValueOnce([[createMockLocation()]]);

      const response = await request(app)
        .put('/api/locations/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          latitud: 100, // Invalid
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/locations/:id', () => {
    it('should delete a location', async () => {
      db.query.mockResolvedValueOnce([[createMockLocation()]]);
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .delete('/api/locations/1')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
    });

    it('should return 404 if location not found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .delete('/api/locations/999')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });
});
