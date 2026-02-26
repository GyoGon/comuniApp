import Joi from 'joi';

/**
 * Schema for creating a location
 */
export const createLocationSchema = Joi.object({
  nombre: Joi.string().trim().min(3).max(100).required().messages({
    'string.empty': 'El nombre de la ubicación no puede estar vacío',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres',
    'any.required': 'El nombre de la ubicación es requerido',
    'string.base': 'El nombre debe ser texto',
  }),
  latitud: Joi.number().required().min(-90).max(90).messages({
    'any.required': 'La latitud es requerida',
    'number.base': 'La latitud debe ser un número',
    'number.min': 'La latitud debe estar entre -90 y 90',
    'number.max': 'La latitud debe estar entre -90 y 90',
  }),
  longitud: Joi.number().required().min(-180).max(180).messages({
    'any.required': 'La longitud es requerida',
    'number.base': 'La longitud debe ser un número',
    'number.min': 'La longitud debe estar entre -180 y 180',
    'number.max': 'La longitud debe estar entre -180 y 180',
  }),
  direccion: Joi.string().trim().max(255).optional().messages({
    'string.max': 'La dirección no puede exceder 255 caracteres',
    'string.base': 'La dirección debe ser texto',
  }),
  ciudad: Joi.string().trim().max(100).optional().messages({
    'string.max': 'La ciudad no puede exceder 100 caracteres',
    'string.base': 'La ciudad debe ser texto',
  }),
  provincia: Joi.string().trim().max(100).optional().messages({
    'string.max': 'La provincia no puede exceder 100 caracteres',
    'string.base': 'La provincia debe ser texto',
  }),
  pais: Joi.string().trim().max(100).optional().messages({
    'string.max': 'El país no puede exceder 100 caracteres',
    'string.base': 'El país debe ser texto',
  }),
}).unknown(false);

/**
 * Schema for updating a location (all fields optional)
 */
export const updateLocationSchema = Joi.object({
  nombre: Joi.string().trim().min(3).max(100).optional().messages({
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres',
    'string.base': 'El nombre debe ser texto',
  }),
  latitud: Joi.number().min(-90).max(90).optional().messages({
    'number.base': 'La latitud debe ser un número',
    'number.min': 'La latitud debe estar entre -90 y 90',
    'number.max': 'La latitud debe estar entre -90 y 90',
  }),
  longitud: Joi.number().min(-180).max(180).optional().messages({
    'number.base': 'La longitud debe ser un número',
    'number.min': 'La longitud debe estar entre -180 y 180',
    'number.max': 'La longitud debe estar entre -180 y 180',
  }),
  direccion: Joi.string().trim().max(255).optional().messages({
    'string.max': 'La dirección no puede exceder 255 caracteres',
    'string.base': 'La dirección debe ser texto',
  }),
  ciudad: Joi.string().trim().max(100).optional().messages({
    'string.max': 'La ciudad no puede exceder 100 caracteres',
    'string.base': 'La ciudad debe ser texto',
  }),
  provincia: Joi.string().trim().max(100).optional().messages({
    'string.max': 'La provincia no puede exceder 100 caracteres',
    'string.base': 'La provincia debe ser texto',
  }),
  pais: Joi.string().trim().max(100).optional().messages({
    'string.max': 'El país no puede exceder 100 caracteres',
    'string.base': 'El país debe ser texto',
  }),
}).min(1).unknown(false).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar',
});
