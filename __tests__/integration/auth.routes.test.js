import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import app from '../../index.js';
import db from '../../src/db/indexDb.js';
import {
  createMockUser,
  generateTestAccessToken,
  resetMocks,
} from '../setup.js';

jest.mock('../../src/db/indexDb.js');

describe('Auth Routes Integration Tests', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user', async () => {
      db.query.mockResolvedValueOnce([[]]); // No existing user
      db.query.mockResolvedValueOnce([{ insertId: 1 }]); // Insert result

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'New User',
          email: 'newuser@example.com',
          password: 'SecurePassword123',
          passwordConfirm: 'SecurePassword123',
          telefono: '1234567890',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Test User',
          email: 'invalid-email',
          password: 'SecurePassword123',
          passwordConfirm: 'SecurePassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if passwords do not match', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Test User',
          email: 'test@example.com',
          password: 'SecurePassword123',
          passwordConfirm: 'DifferentPassword',
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 if password is too short', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Test User',
          email: 'test@example.com',
          password: 'short',
          passwordConfirm: 'short',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully login a user', async () => {
      const mockUser = createMockUser();

      db.query.mockResolvedValueOnce([[mockUser]]);
      // bcrypt.compare is mocked to return true

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'SecurePassword123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'SecurePassword123',
        });

      expect(response.status).toBe(400);
    });

    it('should return 401 if user not found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notfound@example.com',
          password: 'SecurePassword123',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 if password is incorrect', async () => {
      const mockUser = createMockUser();

      db.query.mockResolvedValueOnce([[mockUser]]);
      // bcrypt.compare would return false

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const refreshToken = generateTestAccessToken();

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });

    it('should return 400 if refresh token is missing', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 401 if refresh token is invalid', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid-token',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should successfully logout a user', async () => {
      const accessToken = generateTestAccessToken();

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 if no token provided', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(401);
    });
  });
});
