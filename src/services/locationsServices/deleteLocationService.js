import db from '../../db/indexDb.js';

/**
 * Soft delete a location
 * @param {number} locationId - ID of the location to delete
 * @returns {Promise<Object>} Deletion confirmation
 * @throws {Error} If location not found or database operation fails
 */
export async function deleteLocation(locationId) {
  // Check if location exists
  const selectSql = 'SELECT id FROM ubicaciones WHERE id = ? AND deleted_at IS NULL';

  try {
    const [locations] = await db.query(selectSql, [locationId]);

    if (locations.length === 0) {
      throw new Error('Ubicación no encontrada');
    }

    // Soft delete: set deleted_at = NOW()
    const deleteSql = 'UPDATE ubicaciones SET deleted_at = NOW() WHERE id = ?';
    await db.query(deleteSql, [locationId]);

    return { id: locationId, message: 'Ubicación eliminada correctamente' };
  } catch (error) {
    throw new Error(`Error al eliminar ubicación: ${error.message}`);
  }
}
