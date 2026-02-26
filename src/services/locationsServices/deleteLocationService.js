import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

/**
 * Soft delete a location
 * @param {number} locationId - ID of the location to delete
 * @returns {Promise<Object>} Deletion confirmation
 * @throws {Error} If location not found or database operation fails
 */
export async function deleteLocation(locationId) {
  logger.debug('Deleting location', { locationId });

  // Check if location exists
  const selectSql = 'SELECT id FROM ubicaciones WHERE id = ? AND deleted_at IS NULL';

  try {
    const [locations] = await db.query(selectSql, [locationId]);

    if (locations.length === 0) {
      logger.warn('Location deletion failed - location not found', { locationId });
      throw new Error('Ubicación no encontrada');
    }

    // Soft delete: set deleted_at = NOW()
    const deleteSql = 'UPDATE ubicaciones SET deleted_at = NOW() WHERE id = ?';
    await db.query(deleteSql, [locationId]);

    logger.info('Location deleted successfully', { locationId });
    return { id: locationId, message: 'Ubicación eliminada correctamente' };
  } catch (error) {
    logger.error('Error deleting location', { locationId, error: error.message });
    throw new Error(`Error al eliminar ubicación: ${error.message}`);
  }
}
