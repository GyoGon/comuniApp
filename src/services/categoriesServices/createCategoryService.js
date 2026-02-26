import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

/**
 * Create a new category
 * @param {Object} categoryData
 * @param {string} categoryData.nombre - Category name
 * @param {string} [categoryData.descripcion] - Category description
 * @returns {Promise<Object>} Created category object
 * @throws {Error} If category already exists or database operation fails
 */
export async function createCategory({ nombre, descripcion = null }) {
  logger.debug('Creating new category', { nombre });

  // Check if category already exists
  const checkSql = 'SELECT id FROM categorias WHERE nombre = ? AND deleted_at IS NULL';
  
  try {
    const [existing] = await db.query(checkSql, [nombre]);
    
    if (existing.length > 0) {
      logger.warn('Category creation failed - category already exists', { nombre });
      throw new Error('La categoría ya existe');
    }

    // Insert new category
    const sql = 'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)';
    const [result] = await db.query(sql, [nombre, descripcion]);

    logger.info('Category created successfully', { categoryId: result.insertId, nombre });
    return {
      id: result.insertId,
      nombre,
      descripcion,
    };
  } catch (error) {
    logger.error('Error creating category', { nombre, error: error.message });
    throw new Error(`Error al crear categoría: ${error.message}`);
  }
}
