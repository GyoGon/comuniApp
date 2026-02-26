import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

/**
 * Get a single category by ID
 * @param {number} categoryId - ID of the category
 * @returns {Promise<Object>} Category object
 * @throws {Error} If category not found or database operation fails
 */
export async function getCategoryById(categoryId) {
  logger.debug('Fetching category by ID', { categoryId });

  const sql = `
    SELECT id, nombre, descripcion
    FROM categorias
    WHERE id = ? AND deleted_at IS NULL
  `;

  try {
    const [categories] = await db.query(sql, [categoryId]);

    if (categories.length === 0) {
      logger.warn('Category not found', { categoryId });
      throw new Error('Categoría no encontrada');
    }

    logger.debug('Category found successfully', { categoryId });
    return categories[0];
  } catch (error) {
    logger.error('Error fetching category', { categoryId, error: error.message });
    throw new Error(`Error al obtener categoría: ${error.message}`);
  }
}
