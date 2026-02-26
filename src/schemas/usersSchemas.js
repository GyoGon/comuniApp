import Joi from 'joi';

/**
 * Schema for updating user profile
 */
export const updateProfileSchema = Joi.object({
  nombre: Joi.string().trim().min(3).max(100).optional().messages({
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres',
    'string.base': 'El nombre debe ser texto',
  }),
  email: Joi.string().trim().lowercase().email().optional().messages({
    'string.email': 'Debe ser un email válido',
    'string.base': 'El email debe ser texto',
  }),
  telefono: Joi.string().trim().min(7).max(20).optional().messages({
    'string.min': 'El teléfono debe tener al menos 7 caracteres',
    'string.max': 'El teléfono no puede exceder 20 caracteres',
    'string.base': 'El teléfono debe ser texto',
  }),
  biografia: Joi.string().trim().max(500).optional().messages({
    'string.max': 'La biografía no puede exceder 500 caracteres',
    'string.base': 'La biografía debe ser texto',
  }),
}).min(1).unknown(false).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar',
});

