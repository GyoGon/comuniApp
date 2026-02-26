import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as authServices from '../../src/services/authServices/indexAuthServices.js';

// Mock the database module
jest.mock('../../src/db/indexDb.js', () => ({
  query: jest.fn(),
}));

import db from '../../src/db/indexDb.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerService', () => {
    it('should successfully register a new user', async () => {
      const userData = {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'securePassword123',
      };

      db.query.mockResolvedValueOnce([[]]); // No existing user
      bcrypt.hash.mockResolvedValueOnce('hashedPassword');
      db.query.mockResolvedValueOnce([{ insertId: 1 }]); // Insert result

      const result = await authServices.registerService(userData);

      expect(db.query).toHaveBeenCalledTimes(2);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(result).toHaveProperty('id');
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        nombre: 'Test User',
        email: 'existing@example.com',
        password: 'securePassword123',
      };

      db.query.mockResolvedValueOnce([[{ id: 1 }]]); // User exists

      await expect(authServices.registerService(userData)).rejects.toThrow(
        'El email ya está registrado'
      );
    });

    it('should throw error on database failure', async () => {
      const userData = {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'securePassword123',
      };

      db.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(authServices.registerService(userData)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('loginService', () => {
    it('should successfully login a user', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'securePassword123',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        nombre: 'Test User',
      };

      db.query.mockResolvedValueOnce([[mockUser]]);
      bcrypt.compare.mockResolvedValueOnce(true);
      jwt.sign.mockReturnValueOnce('accessToken');
      jwt.sign.mockReturnValueOnce('refreshToken');

      const result = await authServices.loginService(loginData);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [loginData.email]
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        mockUser.password
      );
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error if user not found', async () => {
      const loginData = {
        email: 'notfound@example.com',
        password: 'securePassword123',
      };

      db.query.mockResolvedValueOnce([[]]);

      await expect(authServices.loginService(loginData)).rejects.toThrow(
        'Usuario no encontrado'
      );
    });

    it('should throw error if password is incorrect', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      db.query.mockResolvedValueOnce([[mockUser]]);
      bcrypt.compare.mockResolvedValueOnce(false);

      await expect(authServices.loginService(loginData)).rejects.toThrow(
        'Contraseña incorrecta'
      );
    });
  });

  describe('refreshService', () => {
    it('should successfully refresh tokens', async () => {
      const refreshToken = 'validRefreshToken';
      const decoded = { userId: 1 };

      jwt.verify.mockReturnValueOnce(decoded);
      jwt.sign.mockReturnValueOnce('newAccessToken');

      const result = await authServices.refreshService(refreshToken);

      expect(jwt.verify).toHaveBeenCalledWith(
        refreshToken,
        expect.any(String)
      );
      expect(result).toHaveProperty('accessToken');
    });

    it('should throw error if refresh token is invalid', async () => {
      const refreshToken = 'invalidRefreshToken';

      jwt.verify.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      await expect(authServices.refreshService(refreshToken)).rejects.toThrow(
        'Token inválido'
      );
    });
  });
});
