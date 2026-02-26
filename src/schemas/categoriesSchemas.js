import Joi from 'joi';

/**
 * Schema for creating a category
 */
export const createCategorySchema = Joi.object({
  nombre: Joi.string().trim().min(3).max(100).required().messages({
    'string.empty': 'El nombre de la categoría no puede estar vacío',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres',
    'any.required': 'El nombre de la categoría es requerido',
    'string.base': 'El nombre debe ser texto',
  }),
  descripcion: Joi.string().trim().max(500).optional().messages({
    'string.max': 'La descripción no puede exceder 500 caracteres',
    'string.base': 'La descripción debe ser texto',
  }),
}).unknown(false);

/**
 * Schema for updating a category (all fields optional)
 */
export const updateCategorySchema = Joi.object({
  nombre: Joi.string().trim().min(3).max(100).optional().messages({
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres',
    'string.base': 'El nombre debe ser texto',
  }),
  descripcion: Joi.string().trim().max(500).optional().messages({
    'string.max': 'La descripción no puede exceder 500 caracteres',
    'string.base': 'La descripción debe ser texto',
  }),
}).min(1).unknown(false).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar',
});
