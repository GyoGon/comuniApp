import db from '../../db/indexDb.js';

/**
 * Soft delete a post (set deleted_at timestamp)
 * @param {number} postId - ID of the post to delete
 * @param {number} usuarioId - ID of the user making the deletion
 * @param {string} role - User role (admin or user)
 * @returns {Promise<Object>} Deleted post object
 * @throws {Error} If post not found, user not authorized, or database operation fails
 */
export async function deletePost(postId, usuarioId, role) {
  // Check if post exists and get owner
  const selectSql = 'SELECT usuario_id FROM posts WHERE id = ? AND deleted_at IS NULL';
  
  try {
    const [posts] = await db.query(selectSql, [postId]);

    if (posts.length === 0) {
      throw new Error('Post no encontrado');
    }

    // Check authorization: only owner or admin can delete
    const postOwnerId = posts[0].usuario_id;
    if (postOwnerId !== usuarioId && role !== 'admin') {
      throw new Error('No tiene permiso para eliminar este post');
    }

    // Soft delete: set deleted_at = NOW()
    const deleteSql = 'UPDATE posts SET deleted_at = NOW() WHERE id = ?';
    await db.query(deleteSql, [postId]);

    return { id: postId, message: 'Post eliminado correctamente' };
  } catch (error) {
    throw new Error(`Error al eliminar post: ${error.message}`);
  }
}
