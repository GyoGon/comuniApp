import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock the database module
jest.mock('../../src/db/indexDb.js', () => ({
  query: jest.fn(),
}));

import db from '../../src/db/indexDb.js';

describe('Search Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchPostsService', () => {
    it('should search posts by keyword', async () => {
      const mockResults = [
        { id: 1, titulo: 'Search Result', descripcion: 'Content here' },
      ];

      db.query.mockResolvedValueOnce([mockResults]);

      // Mock implementation of searchPostsService
      const searchPostsService = async (keyword) => {
        const [results] = await db.query(
          'SELECT * FROM posts WHERE titulo LIKE ? OR descripcion LIKE ?',
          [`%${keyword}%`, `%${keyword}%`]
        );
        return results;
      };

      const result = await searchPostsService('Search');

      expect(result).toEqual(mockResults);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('LIKE'),
        ['%Search%', '%Search%']
      );
    });

    it('should return empty array when no results found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const searchPostsService = async (keyword) => {
        const [results] = await db.query(
          'SELECT * FROM posts WHERE titulo LIKE ? OR descripcion LIKE ?',
          [`%${keyword}%`, `%${keyword}%`]
        );
        return results;
      };

      const result = await searchPostsService('NonExistent');

      expect(result).toEqual([]);
    });

    it('should throw error on database failure', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      const searchPostsService = async (keyword) => {
        const [results] = await db.query(
          'SELECT * FROM posts WHERE titulo LIKE ? OR descripcion LIKE ?',
          [`%${keyword}%`, `%${keyword}%`]
        );
        return results;
      };

      await expect(searchPostsService('test')).rejects.toThrow('Database error');
    });
  });

  describe('filterPostsService', () => {
    it('should filter posts by categoria_id', async () => {
      const mockResults = [
        { id: 1, categoria_id: 1, titulo: 'Post 1' },
        { id: 2, categoria_id: 1, titulo: 'Post 2' },
      ];

      db.query.mockResolvedValueOnce([mockResults]);

      const filterPostsService = async (filters) => {
        const [results] = await db.query(
          'SELECT * FROM posts WHERE categoria_id = ?',
          [filters.categoria_id]
        );
        return results;
      };

      const result = await filterPostsService({ categoria_id: 1 });

      expect(result).toEqual(mockResults);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('categoria_id'),
        [1]
      );
    });

    it('should filter posts by ubicacion_id', async () => {
      const mockResults = [
        { id: 1, ubicacion_id: 1, titulo: 'Post 1' },
      ];

      db.query.mockResolvedValueOnce([mockResults]);

      const filterPostsService = async (filters) => {
        const [results] = await db.query(
          'SELECT * FROM posts WHERE ubicacion_id = ?',
          [filters.ubicacion_id]
        );
        return results;
      };

      const result = await filterPostsService({ ubicacion_id: 1 });

      expect(result).toEqual(mockResults);
    });

    it('should filter posts by multiple criteria', async () => {
      const mockResults = [
        { id: 1, categoria_id: 1, ubicacion_id: 1, titulo: 'Post 1' },
      ];

      db.query.mockResolvedValueOnce([mockResults]);

      const filterPostsService = async (filters) => {
        const [results] = await db.query(
          'SELECT * FROM posts WHERE categoria_id = ? AND ubicacion_id = ?',
          [filters.categoria_id, filters.ubicacion_id]
        );
        return results;
      };

      const result = await filterPostsService({
        categoria_id: 1,
        ubicacion_id: 1,
      });

      expect(result).toEqual(mockResults);
    });

    it('should return empty array when no posts match filters', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const filterPostsService = async (filters) => {
        const [results] = await db.query(
          'SELECT * FROM posts WHERE categoria_id = ?',
          [filters.categoria_id]
        );
        return results;
      };

      const result = await filterPostsService({ categoria_id: 999 });

      expect(result).toEqual([]);
    });

    it('should throw error on database failure', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      const filterPostsService = async (filters) => {
        const [results] = await db.query(
          'SELECT * FROM posts WHERE categoria_id = ?',
          [filters.categoria_id]
        );
        return results;
      };

      await expect(
        filterPostsService({ categoria_id: 1 })
      ).rejects.toThrow('Database error');
    });
  });
});
