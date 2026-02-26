import db from '../../db/indexDb.js';

/**
 * Get all posts with pagination
 * @param {Object} options
 * @param {number} options.limit - Number of posts to retrieve (default: 10)
 * @param {number} options.offset - Number of posts to skip (default: 0)
 * @returns {Promise<Object>} Object containing posts array and total count
 * @throws {Error} If database operation fails
 */
export async function getPosts({ limit = 10, offset = 0 }) {
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
    WHERE p.deleted_at IS NULL
    ORDER BY p.fecha_creacion DESC
    LIMIT ? OFFSET ?
  `;

  const countSql = 'SELECT COUNT(*) as total FROM posts WHERE deleted_at IS NULL';

  try {
    const [posts] = await db.query(sql, [limit, offset]);
    const [countResult] = await db.query(countSql);

    return {
      posts,
      total: countResult[0].total,
      limit,
      offset,
    };
  } catch (error) {
    throw new Error(`Error al obtener posts: ${error.message}`);
  }
}
