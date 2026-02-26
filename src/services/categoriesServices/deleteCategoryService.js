import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

/**
 * Soft delete a category
 * @param {number} categoryId - ID of the category to delete
 * @returns {Promise<Object>} Deletion confirmation
 * @throws {Error} If category not found or database operation fails
 */
export async function deleteCategory(categoryId) {
  logger.debug('Deleting category', { categoryId });

  // Check if category exists
  const selectSql = 'SELECT id FROM categorias WHERE id = ? AND deleted_at IS NULL';

  try {
    const [categories] = await db.query(selectSql, [categoryId]);

    if (categories.length === 0) {
      logger.warn('Category deletion failed - category not found', { categoryId });
      throw new Error('Categoría no encontrada');
    }

    // Soft delete: set deleted_at = NOW()
    const deleteSql = 'UPDATE categorias SET deleted_at = NOW() WHERE id = ?';
    await db.query(deleteSql, [categoryId]);

    logger.info('Category deleted successfully', { categoryId });
    return { id: categoryId, message: 'Categoría eliminada correctamente' };
  } catch (error) {
    logger.error('Error deleting category', { categoryId, error: error.message });
    throw new Error(`Error al eliminar categoría: ${error.message}`);
  }
}
