import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

/**
 * Get all active categories
 * @returns {Promise<Array>} Array of category objects
 * @throws {Error} If database operation fails
 */
export async function getCategories() {
  logger.debug('Fetching all categories');

  const sql = `
    SELECT id, nombre, descripcion
    FROM categorias
    WHERE deleted_at IS NULL
    ORDER BY nombre ASC
  `;

  try {
    const [categories] = await db.query(sql);
    logger.info('Categories fetched successfully', { count: categories.length });
    return categories;
  } catch (error) {
    logger.error('Error fetching categories', { error: error.message });
    throw new Error(`Error al obtener categorías: ${error.message}`);
  }
}
