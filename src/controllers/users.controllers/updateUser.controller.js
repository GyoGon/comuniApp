import updateUser from "../../services/users.services/updateUser.service.js";
import { handleError } from "../../utils/errorHandler.js";

export const updateUserController = async (req, res, next) => {
    try {
        // Extraer el ID del usuario de los parámetros de la solicitud
        const { id } = req.params;

        // Extraer los datos del usuario del cuerpo de la solicitud
        const userData = req.body;

        // Llamar al servicio para actualizar el usuario
        const updatedUser = await updateUser(id, userData);

        // Si no se encuentra el usuario, lanzar un error 404
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Enviar la respuesta con el usuario actualizado
        res.status(200).json(updatedUser);
    } catch (err) {
        handleError(err, res, next);
    }
}
// Exportar el controlador
export default updateUserController;