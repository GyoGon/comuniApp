import db from '../../db/indexDb.js';

/**
 * Get a single post by ID with full details
 * @param {number} postId - ID of the post to retrieve
 * @returns {Promise<Object>} Post object with user, category, and location details
 * @throws {Error} If post not found or database operation fails
 */
export async function getPostById(postId) {
  const sql = `
    SELECT 
      p.id,
      p.usuario_id,
      p.titulo,
      p.descripcion,
      p.categoria_id,
      p.ubicacion_id,
      p.fecha_creacion,
      u.id as usuario_id,
      u.nombre as usuario_nombre,
      u.email as usuario_email,
      u.telefono as usuario_telefono,
      c.id as categoria_id,
      c.nombre as categoria_nombre,
      c.descripcion as categoria_descripcion,
      l.id as ubicacion_id,
      l.latitud,
      l.longitud,
      l.direccion,
      l.ciudad,
      l.provincia,
      l.pais
    FROM posts p
    LEFT JOIN usuarios u ON p.usuario_id = u.id
    LEFT JOIN categorias c ON p.categoria_id = c.id
    LEFT JOIN ubicaciones l ON p.ubicacion_id = l.id
    WHERE p.id = ? AND p.deleted_at IS NULL
  `;

  try {
    const [posts] = await db.query(sql, [postId]);

    if (posts.length === 0) {
      throw new Error('Post no encontrado');
    }

    return posts[0];
  } catch (error) {
    throw new Error(`Error al obtener post: ${error.message}`);
  }
}
