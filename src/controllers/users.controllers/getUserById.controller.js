import getUserById from "../../services/users.services/getUserById.service.js";
import { handleError } from "../../utils/errorHandler.js";

export const getUserByIdController = async (req, res, next) => {
    try {
        // Extraer el ID del usuario de los parámetros de la solicitud
        const { id } = req.params;

        // Llamar al servicio para obtener el usuario por ID
        const user = await getUserById(id);

        // Si no se encuentra el usuario, lanzar un error 404
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Enviar la respuesta con el usuario encontrado
        res.status(200).json(user);
    } catch (err) {
        handleError(err, res, next);
    }
}

// Exportar el controlador
export default getUserByIdController;