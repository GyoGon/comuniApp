import { createUser } from '../../services/users.services/index.users.services.js';
import { registerSchema } from '../../schemas/users.schemas.js';
import { createError } from '../../utils/errorHandler.js';

export const createUserController = async (req, res, next) => {
    try {
        // Validar el cuerpo de la solicitud
        const { error } = registerSchema.validate(req.body);
        if (error) {
        return next(createError(400, error.details[0].message));
        }
    
        // Extraer los datos del usuario del cuerpo de la solicitud
        const { name, email, password } = req.body;
    
        // Llamar al servicio para crear el usuario
        const newUser = await createUser({ name, email, password });
    
        // Enviar la respuesta con el nuevo usuario creado
        res.status(201).json(newUser);
    } catch (err) {
        next(err);
    }
}
// Exportar el controlador
export default createUserController;