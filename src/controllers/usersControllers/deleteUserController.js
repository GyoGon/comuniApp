import { deleteUser } from "../../services/usersServices/indexUsersServices.js";
import { handleError } from "../../utils/errorHandler.js";
export const deleteUserController = async (req, res, next) => {
    try {
        // Extraer el ID del usuario de los parámetros de la solicitud
        const { id } = req.params;

        // Llamar al servicio para eliminar el usuario
        await deleteUser(id);

        // Enviar una respuesta de éxito
        res.status(204).send();
    } catch (err) {
        handleError(err, res, next);
    }
};

// Exportar el controlador
export default deleteUserController;