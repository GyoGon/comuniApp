import db from '../../db/indexDb.js';

/**
 * Filter posts by multiple criteria with pagination
 * @param {Object} filters - Filter criteria
 * @param {number} filters.categoria_id - Category ID (required)
 * @param {number} filters.ubicacion_id - Location ID (required)
 * @param {string} filters.fecha_desde - Start date (optional)
 * @param {string} filters.fecha_hasta - End date (optional)
 * @param {number} filters.usuario_id - User ID (optional)
 * @param {string} filters.search - Text search (optional)
 * @param {Object} pagination - Pagination options
 * @param {number} pagination.limit - Number of results (default: 10)
 * @param {number} pagination.offset - Number of results to skip (default: 0)
 * @returns {Promise<Object>} Object with posts array, total count, limit, offset
 * @throws {Error} If database operation fails or required filters missing
 */
export async function filterPosts(filters = {}, pagination = {}) {
  const { limit = 10, offset = 0 } = pagination;
  const { categoria_id, ubicacion_id, fecha_desde, fecha_hasta, usuario_id, search } = filters;

  // Validate required filters
  if (!categoria_id || !ubicacion_id) {
    throw new Error('categoria_id y ubicacion_id son requeridos para filtrar');
  }

  try {
    // Build WHERE conditions - start with required filters and soft delete check
    let whereConditions = [
      'p.deleted_at IS NULL',
      'p.categoria_id = ?',
      'p.ubicacion_id = ?',
    ];
    let params = [categoria_id, ubicacion_id];

    // Add optional filters
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

    if (search && search.trim()) {
      whereConditions.push('(LOWER(p.titulo) LIKE LOWER(?) OR LOWER(p.descripcion) LIKE LOWER(?))');
      const searchPattern = `%${search.trim()}%`;
      params.push(searchPattern, searchPattern);
    }

    const whereClause = whereConditions.join(' AND ');

    // Main query with usuario info
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

    return {
      posts,
      total: countResult[0].total,
      limit,
      offset,
    };
  } catch (error) {
    throw new Error(`Error al filtrar posts: ${error.message}`);
  }
}
