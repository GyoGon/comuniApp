import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

/**
 * Soft delete a post (set deleted_at timestamp)
 * @param {number} postId - ID of the post to delete
 * @param {number} usuarioId - ID of the user making the deletion
 * @param {string} role - User role (admin or user)
 * @returns {Promise<Object>} Deleted post object
 * @throws {Error} If post not found, user not authorized, or database operation fails
 */
export async function deletePost(postId, usuarioId, role) {
  logger.debug('Deleting post', { postId, usuarioId, role });

  // Check if post exists and get owner
  const selectSql = 'SELECT usuario_id FROM posts WHERE id = ? AND deleted_at IS NULL';
  
  try {
    const [posts] = await db.query(selectSql, [postId]);

    if (posts.length === 0) {
      logger.warn('Post deletion failed - post not found', { postId });
      throw new Error('Post no encontrado');
    }

    // Check authorization: only owner or admin can delete
    const postOwnerId = posts[0].usuario_id;
    if (postOwnerId !== usuarioId && role !== 'admin') {
      logger.warn('Post deletion failed - unauthorized', { postId, usuarioId, postOwnerId });
      throw new Error('No tiene permiso para eliminar este post');
    }

    // Soft delete: set deleted_at = NOW()
    const deleteSql = 'UPDATE posts SET deleted_at = NOW() WHERE id = ?';
    await db.query(deleteSql, [postId]);

    logger.info('Post deleted successfully', { postId, usuarioId });
    return { id: postId, message: 'Post eliminado correctamente' };
  } catch (error) {
    logger.error('Error deleting post', { postId, usuarioId, error: error.message });
    throw new Error(`Error al eliminar post: ${error.message}`);
  }
}
