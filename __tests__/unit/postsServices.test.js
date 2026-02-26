import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as postsServices from '../../src/services/postsServices/indexPostsServices.js';

// Mock the database module
jest.mock('../../src/db/indexDb.js', () => ({
  query: jest.fn(),
}));

import db from '../../src/db/indexDb.js';

describe('Posts Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPostService', () => {
    it('should successfully create a post', async () => {
      const postData = {
        titulo: 'Test Post',
        descripcion: 'This is a test post with sufficient length',
        categoria_id: 1,
        ubicacion_id: 1,
        usuario_id: 1,
      };

      db.query.mockResolvedValueOnce([{ insertId: 1 }]);
      db.query.mockResolvedValueOnce([[postData]]);

      const result = await postsServices.createPostService(postData);

      expect(db.query).toHaveBeenCalledTimes(2);
      expect(result).toHaveProperty('id');
    });

    it('should throw error if titulo is too short', async () => {
      const postData = {
        titulo: 'ab',
        descripcion: 'This is a test post',
        categoria_id: 1,
        ubicacion_id: 1,
        usuario_id: 1,
      };

      await expect(postsServices.createPostService(postData)).rejects.toThrow();
    });

    it('should throw error if categoria_id is invalid', async () => {
      const postData = {
        titulo: 'Test Post',
        descripcion: 'This is a test post',
        categoria_id: -1,
        ubicacion_id: 1,
        usuario_id: 1,
      };

      await expect(postsServices.createPostService(postData)).rejects.toThrow();
    });
  });

  describe('getPostsService', () => {
    it('should retrieve all posts', async () => {
      const mockPosts = [
        { id: 1, titulo: 'Post 1', descripcion: 'Description 1' },
        { id: 2, titulo: 'Post 2', descripcion: 'Description 2' },
      ];

      db.query.mockResolvedValueOnce([mockPosts]);

      const result = await postsServices.getPostsService();

      expect(db.query).toHaveBeenCalled();
      expect(result).toEqual(mockPosts);
    });

    it('should handle empty posts list', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const result = await postsServices.getPostsService();

      expect(result).toEqual([]);
    });

    it('should throw error on database failure', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(postsServices.getPostsService()).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('updatePostService', () => {
    it('should successfully update a post', async () => {
      const postId = 1;
      const updateData = {
        titulo: 'Updated Title',
        descripcion: 'Updated description with sufficient length for validation',
      };

      db.query.mockResolvedValueOnce([[{ id: postId }]]); // Check if post exists
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // Update result

      const result = await postsServices.updatePostService(postId, updateData);

      expect(db.query).toHaveBeenCalledTimes(2);
    });

    it('should throw error if post not found', async () => {
      const postId = 999;
      const updateData = {
        titulo: 'Updated Title',
      };

      db.query.mockResolvedValueOnce([[]]);

      await expect(
        postsServices.updatePostService(postId, updateData)
      ).rejects.toThrow('Post no encontrado');
    });

    it('should throw error if no update fields provided', async () => {
      const postId = 1;
      const updateData = {};

      await expect(
        postsServices.updatePostService(postId, updateData)
      ).rejects.toThrow();
    });
  });

  describe('deletePostService', () => {
    it('should successfully delete a post', async () => {
      const postId = 1;

      db.query.mockResolvedValueOnce([[{ id: postId }]]); // Check if post exists
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // Delete result

      await postsServices.deletePostService(postId);

      expect(db.query).toHaveBeenCalledTimes(2);
    });

    it('should throw error if post not found', async () => {
      const postId = 999;

      db.query.mockResolvedValueOnce([[]]);

      await expect(postsServices.deletePostService(postId)).rejects.toThrow(
        'Post no encontrado'
      );
    });

    it('should throw error on database failure', async () => {
      const postId = 1;

      db.query.mockResolvedValueOnce([[{ id: postId }]]);
      db.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(postsServices.deletePostService(postId)).rejects.toThrow(
        'Database error'
      );
    });
  });
});
