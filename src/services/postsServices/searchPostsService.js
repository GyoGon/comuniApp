import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

/**
 * Search posts by query string in titulo and descripcion
 * @param {string} query - Search query string
 * @param {Object} filters - Filter options
 * @param {number} filters.categoria_id - Category ID (optional)
 * @param {number} filters.ubicacion_id - Location ID (optional)
 * @param {string} filters.fecha_desde - Start date (optional)
 * @param {string} filters.fecha_hasta - End date (optional)
 * @param {number} filters.usuario_id - User ID (optional)
 * @param {Object} pagination - Pagination options
 * @param {number} pagination.limit - Number of results (default: 10)
 * @param {number} pagination.offset - Number of results to skip (default: 0)
 * @returns {Promise<Object>} Object with posts array, total count, limit, offset
 * @throws {Error} If database operation fails
 */
export async function searchPosts(query, filters = {}, pagination = {}) {
  const { limit = 10, offset = 0 } = pagination;
  const { categoria_id, ubicacion_id, fecha_desde, fecha_hasta, usuario_id } = filters;

  logger.debug('Searching posts', { query, filters: Object.keys(filters), limit, offset });

  try {
    // Build WHERE conditions
    let whereConditions = ['p.deleted_at IS NULL'];
    let params = [];

    // Add search query condition (case-insensitive)
    if (query && query.trim()) {
      whereConditions.push('(LOWER(p.titulo) LIKE LOWER(?) OR LOWER(p.descripcion) LIKE LOWER(?))');
      const searchPattern = `%${query.trim()}%`;
      params.push(searchPattern, searchPattern);
    }

    // Add filter conditions
    if (categoria_id) {
      whereConditions.push('p.categoria_id = ?');
      params.push(categoria_id);
    }

    if (ubicacion_id) {
      whereConditions.push('p.ubicacion_id = ?');
      params.push(ubicacion_id);
    }

    if (usuario_id) {
      whereConditions.push('p.usuario_id = ?');
      params.push(usuario_id);
    }

    if (fecha_desde) {
      whereConditions.push('p.fecha_creacion >= ?');
      params.push(fecha_desde);
    }

    if (fecha_hasta) {
      whereConditions.push('p.fecha_creacion <= ?');
      params.push(fecha_hasta);
    }

    const whereClause = whereConditions.join(' AND ');

    // Main query with JOIN to get usuario info
    const sql = `
      SELECT 
        p.id,
        p.usuario_id,
        p.titulo,
        p.descripcion,
        p.categoria_id,
        p.ubicacion_id,
        p.fecha_creacion,
        u.nombre as usuario_nombre,
        u.email as usuario_email,
        c.nombre as categoria_nombre,
        l.latitud,
        l.longitud,
        l.direccion,
        l.ciudad
      FROM posts p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN ubicaciones l ON p.ubicacion_id = l.id
      WHERE ${whereClause}
      ORDER BY p.fecha_creacion DESC
      LIMIT ? OFFSET ?
    `;

    // Count total results
    const countSql = `SELECT COUNT(*) as total FROM posts p WHERE ${whereClause}`;

    const [posts] = await db.query(sql, [...params, limit, offset]);
    const [countResult] = await db.query(countSql, params);

    logger.info('Posts search completed', { query, count: posts.length, total: countResult[0].total });
    return {
      posts,
      total: countResult[0].total,
      limit,
      offset,
    };
  } catch (error) {
    logger.error('Error searching posts', { query, error: error.message });
    throw new Error(`Error en búsqueda de posts: ${error.message}`);
  }
}
