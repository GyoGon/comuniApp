import db from '../../db/indexDb.js';

/**
 * Get a single category by ID
 * @param {number} categoryId - ID of the category
 * @returns {Promise<Object>} Category object
 * @throws {Error} If category not found or database operation fails
 */
export async function getCategoryById(categoryId) {
  const sql = `
    SELECT id, nombre, descripcion
    FROM categorias
    WHERE id = ? AND deleted_at IS NULL
  `;

  try {
    const [categories] = await db.query(sql, [categoryId]);

    if (categories.length === 0) {
      throw new Error('Categoría no encontrada');
    }

    return categories[0];
  } catch (error) {
    throw new Error(`Error al obtener categoría: ${error.message}`);
  }
}
