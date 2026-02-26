import Joi from 'joi';

/**
 * Schema for full-text search of posts
 */
export const searchSchema = Joi.object({
  q: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'El query de búsqueda es requerido',
    'string.min': 'El query debe tener al menos 1 carácter',
  }),
  categoria_id: Joi.number().integer().positive().optional(),
  ubicacion_id: Joi.number().integer().positive().optional(),
  fecha_desde: Joi.date().iso().optional(),
  fecha_hasta: Joi.date().iso().optional(),
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
});

/**
 * Schema for advanced filtering of posts
 * Requires categoria_id and ubicacion_id
 */
export const filterSchema = Joi.object({
  categoria_id: Joi.number().integer().positive().required().messages({
    'number.base': 'categoria_id debe ser un número',
    'any.required': 'categoria_id es requerido',
  }),
  ubicacion_id: Joi.number().integer().positive().required().messages({
    'number.base': 'ubicacion_id debe ser un número',
    'any.required': 'ubicacion_id es requerido',
  }),
  fecha_desde: Joi.date().iso().optional(),
  fecha_hasta: Joi.date().iso().optional(),
  usuario_id: Joi.number().integer().positive().optional(),
  search: Joi.string().min(1).max(255).optional(),
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
});

/**
 * Schema for distance-based location search (GPS)
 */
export const distanceSearchSchema = Joi.object({
  latitud: Joi.number().min(-90).max(90).required().messages({
    'number.base': 'latitud debe ser un número',
    'number.min': 'latitud debe estar entre -90 y 90',
    'number.max': 'latitud debe estar entre -90 y 90',
    'any.required': 'latitud es requerida',
  }),
  longitud: Joi.number().min(-180).max(180).required().messages({
    'number.base': 'longitud debe ser un número',
    'number.min': 'longitud debe estar entre -180 y 180',
    'number.max': 'longitud debe estar entre -180 y 180',
    'any.required': 'longitud es requerida',
  }),
  radiusKm: Joi.number().positive().default(10).messages({
    'number.base': 'radiusKm debe ser un número',
    'number.positive': 'radiusKm debe ser mayor a 0',
  }),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
});
