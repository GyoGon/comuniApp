import { getUsers } from '../../services/users.services/getUsers.service.js';
import { handleError } from '../../utils/errorHandler.js';
export const getUsersController = async (req, res, next) => {
    try {
        // Llamar al servicio para obtener todos los usuarios
        const users = await getUsers();

        // Enviar la respuesta con la lista de usuarios
        res.status(200).json(users);
    } catch (err) {
        handleError(err, res, next);
    }
};
// Exportar el controlador
export default getUsersController;