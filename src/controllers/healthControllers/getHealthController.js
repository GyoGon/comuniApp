import db from '../../db/indexDb.js';

/**
 * Health check endpoint - Verifica la conexión a la BD
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getHealthController = async (req, res, next) => {
    try {
        // Intentar conexión a la BD
        const connection = await db.getConnection();
        const [result] = await connection.query('SELECT 1 as status');
        connection.release();

        if (result && result[0] && result[0].status === 1) {
            return res.status(200).json({
                status: 'healthy',
                database: 'connected',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development'
            });
        }
    } catch (err) {
        return res.status(503).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: err.message,
            timestamp: new Date().toISOString()
        });
    }
};

export default getHealthController;
