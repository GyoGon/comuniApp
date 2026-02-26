import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

/**
 * Update a category
 * @param {number} categoryId - ID of the category to update
 * @param {Object} updateData - Fields to update
 * @param {string} [updateData.nombre] - New category name
 * @param {string} [updateData.descripcion] - New description
 * @returns {Promise<Object>} Updated category object
 * @throws {Error} If category not found or database operation fails
 */
export async function updateCategory(categoryId, updateData) {
  logger.debug('Updating category', { categoryId, fields: Object.keys(updateData) });

  // Check if category exists
  const selectSql = 'SELECT id FROM categorias WHERE id = ? AND deleted_at IS NULL';

  try {
    const [categories] = await db.query(selectSql, [categoryId]);

    if (categories.length === 0) {
      logger.warn('Category update failed - category not found', { categoryId });
      throw new Error('Categoría no encontrada');
    }

    // Build dynamic UPDATE query
    const allowedFields = ['nombre', 'descripcion'];
    const updateFields = Object.keys(updateData)
      .filter(key => allowedFields.includes(key) && updateData[key] !== undefined);

    if (updateFields.length === 0) {
      logger.warn('Category update failed - no fields to update', { categoryId });
      throw new Error('No hay campos para actualizar');
    }

    // Check if new nombre is unique (if being updated)
    if (updateData.nombre) {
      const [existing] = await db.query(
        'SELECT id FROM categorias WHERE nombre = ? AND id != ? AND deleted_at IS NULL',
        [updateData.nombre, categoryId]
      );
      if (existing.length > 0) {
        logger.warn('Category update failed - name already exists', { categoryId, nombre: updateData.nombre });
        throw new Error('El nombre de la categoría ya existe');
      }
    }

    const setClause = updateFields.map(field => `${field} = ?`).join(', ');
    const values = updateFields.map(field => updateData[field]);
    values.push(categoryId);

    const updateSql = `UPDATE categorias SET ${setClause} WHERE id = ?`;

    await db.query(updateSql, values);

    // Return updated category
    const [updatedCategories] = await db.query(
      'SELECT id, nombre, descripcion FROM categorias WHERE id = ? AND deleted_at IS NULL',
      [categoryId]
    );

    logger.info('Category updated successfully', { categoryId });
    return updatedCategories[0];
  } catch (error) {
    logger.error('Error updating category', { categoryId, error: error.message });
    throw new Error(`Error al actualizar categoría: ${error.message}`);
  }
}
