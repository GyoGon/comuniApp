import Joi from 'joi';

/**
 * Schema for creating a new post
 */
export const createPostSchema = Joi.object({
  titulo: Joi.string().trim().min(3).max(255).required().messages({
    'string.empty': 'El título no puede estar vacío',
    'string.min': 'El título debe tener al menos 3 caracteres',
    'string.max': 'El título no puede exceder 255 caracteres',
    'any.required': 'El título es requerido',
    'string.base': 'El título debe ser texto',
  }),
  descripcion: Joi.string().trim().min(10).max(5000).required().messages({
    'string.empty': 'La descripción no puede estar vacía',
    'string.min': 'La descripción debe tener al menos 10 caracteres',
    'string.max': 'La descripción no puede exceder 5000 caracteres',
    'any.required': 'La descripción es requerida',
    'string.base': 'La descripción debe ser texto',
  }),
  categoria_id: Joi.number().integer().positive().required().messages({
    'number.base': 'categoria_id debe ser un número entero',
    'number.positive': 'categoria_id debe ser mayor a 0',
    'any.required': 'categoria_id es requerido',
  }),
  ubicacion_id: Joi.number().integer().positive().required().messages({
    'number.base': 'ubicacion_id debe ser un número entero',
    'number.positive': 'ubicacion_id debe ser mayor a 0',
    'any.required': 'ubicacion_id es requerido',
  }),
}).unknown(false);

/**
 * Schema for updating a post (all fields optional)
 */
export const updatePostSchema = Joi.object({
  titulo: Joi.string().trim().min(3).max(255).optional().messages({
    'string.min': 'El título debe tener al menos 3 caracteres',
    'string.max': 'El título no puede exceder 255 caracteres',
    'string.base': 'El título debe ser texto',
  }),
  descripcion: Joi.string().trim().min(10).max(5000).optional().messages({
    'string.min': 'La descripción debe tener al menos 10 caracteres',
    'string.max': 'La descripción no puede exceder 5000 caracteres',
    'string.base': 'La descripción debe ser texto',
  }),
  categoria_id: Joi.number().integer().positive().optional().messages({
    'number.base': 'categoria_id debe ser un número entero',
    'number.positive': 'categoria_id debe ser mayor a 0',
  }),
  ubicacion_id: Joi.number().integer().positive().optional().messages({
    'number.base': 'ubicacion_id debe ser un número entero',
    'number.positive': 'ubicacion_id debe ser mayor a 0',
  }),
}).min(1).unknown(false).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar',
});
