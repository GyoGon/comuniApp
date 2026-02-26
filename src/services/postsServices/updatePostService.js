import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

/**
 * Update a post (partial update allowed)
 * @param {number} postId - ID of the post to update
 * @param {number} usuarioId - ID of the user making the update
 * @param {string} role - User role (admin or user)
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} Updated post object
 * @throws {Error} If post not found, user not authorized, or database operation fails
 */
export async function updatePost(postId, usuarioId, role, updateData) {
  logger.debug('Updating post', { postId, usuarioId, role, fields: Object.keys(updateData) });

  // Check if post exists and get owner
  const selectSql = 'SELECT usuario_id FROM posts WHERE id = ? AND deleted_at IS NULL';
  
  try {
    const [posts] = await db.query(selectSql, [postId]);

    if (posts.length === 0) {
      logger.warn('Post update failed - post not found', { postId });
      throw new Error('Post no encontrado');
    }

    // Check authorization: only owner or admin can update
    const postOwnerId = posts[0].usuario_id;
    if (postOwnerId !== usuarioId && role !== 'admin') {
      logger.warn('Post update failed - unauthorized', { postId, usuarioId, postOwnerId });
      throw new Error('No tiene permiso para actualizar este post');
    }

    // Build dynamic UPDATE query
    const allowedFields = ['titulo', 'descripcion', 'categoria_id', 'ubicacion_id'];
    const updateFields = Object.keys(updateData)
      .filter(key => allowedFields.includes(key) && updateData[key] !== undefined);

    if (updateFields.length === 0) {
      logger.warn('Post update failed - no fields to update', { postId });
      throw new Error('No hay campos para actualizar');
    }

    const setClause = updateFields.map(field => `${field} = ?`).join(', ');
    const values = updateFields.map(field => updateData[field]);
    values.push(postId);

    const updateSql = `UPDATE posts SET ${setClause} WHERE id = ?`;

    await db.query(updateSql, values);

    // Return updated post
    const [updatedPosts] = await db.query(
      'SELECT * FROM posts WHERE id = ? AND deleted_at IS NULL',
      [postId]
    );

    logger.info('Post updated successfully', { postId, usuarioId });
    return updatedPosts[0];
  } catch (error) {
    logger.error('Error updating post', { postId, usuarioId, error: error.message });
    throw new Error(`Error al actualizar post: ${error.message}`);
  }
}
