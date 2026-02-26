import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

/**
 * Create a new post
 * @param {Object} postData
 * @param {number} postData.usuario_id - ID of the user creating the post
 * @param {string} postData.titulo - Post title
 * @param {string} postData.descripcion - Post description
 * @param {number} postData.categoria_id - Category ID
 * @param {number} postData.ubicacion_id - Location ID
 * @returns {Promise<Object>} Created post object
 * @throws {Error} If database operation fails
 */
export async function createPost({ usuario_id, titulo, descripcion, categoria_id, ubicacion_id }) {
  logger.debug('Creating new post', { usuario_id, titulo });

  const sql = `
    INSERT INTO posts (usuario_id, titulo, descripcion, categoria_id, ubicacion_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(sql, [usuario_id, titulo, descripcion, categoria_id, ubicacion_id]);
    
    logger.info('Post created successfully', { postId: result.insertId, usuario_id, titulo });
    // Return the created post
    return {
      id: result.insertId,
      usuario_id,
      titulo,
      descripcion,
      categoria_id,
      ubicacion_id,
      fecha_creacion: new Date(),
    };
  } catch (error) {
    logger.error('Error creating post', { usuario_id, titulo, error: error.message });
    throw new Error(`Error al crear post: ${error.message}`);
  }
}
