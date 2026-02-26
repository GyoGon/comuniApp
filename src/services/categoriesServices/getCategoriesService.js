import db from '../../db/indexDb.js';

/**
 * Get all active categories
 * @returns {Promise<Array>} Array of category objects
 * @throws {Error} If database operation fails
 */
export async function getCategories() {
  const sql = `
    SELECT id, nombre, descripcion
    FROM categorias
    WHERE deleted_at IS NULL
    ORDER BY nombre ASC
  `;

  try {
    const [categories] = await db.query(sql);
    return categories;
  } catch (error) {
    throw new Error(`Error al obtener categorías: ${error.message}`);
  }
}
