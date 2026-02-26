import db from '../../db/indexDb.js';

/**
 * Update a location
 * @param {number} locationId - ID of the location to update
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} Updated location object
 * @throws {Error} If location not found or database operation fails
 */
export async function updateLocation(locationId, updateData) {
  // Check if location exists
  const selectSql = 'SELECT id FROM ubicaciones WHERE id = ? AND deleted_at IS NULL';

  try {
    const [locations] = await db.query(selectSql, [locationId]);

    if (locations.length === 0) {
      throw new Error('Ubicación no encontrada');
    }

    // Build dynamic UPDATE query
    const allowedFields = ['latitud', 'longitud', 'direccion', 'ciudad', 'provincia', 'pais'];
    const updateFields = Object.keys(updateData)
      .filter(key => allowedFields.includes(key) && updateData[key] !== undefined);

    if (updateFields.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    const setClause = updateFields.map(field => `${field} = ?`).join(', ');
    const values = updateFields.map(field => updateData[field]);
    values.push(locationId);

    const updateSql = `UPDATE ubicaciones SET ${setClause} WHERE id = ?`;

    await db.query(updateSql, values);

    // Return updated location
    const [updatedLocations] = await db.query(
      'SELECT id, latitud, longitud, direccion, ciudad, provincia, pais FROM ubicaciones WHERE id = ? AND deleted_at IS NULL',
      [locationId]
    );

    return updatedLocations[0];
  } catch (error) {
    throw new Error(`Error al actualizar ubicación: ${error.message}`);
  }
}
