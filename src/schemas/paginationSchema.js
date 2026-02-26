import Joi from 'joi';

/**
 * Schema for pagination query parameters
 */
export const paginationSchema = Joi.object({
  limit: Joi.number().integer().positive().max(100).optional().default(10).messages({
    'number.base': 'limit debe ser un número',
    'number.positive': 'limit debe ser mayor a 0',
    'number.max': 'limit no puede exceder 100',
  }),
  offset: Joi.number().integer().min(0).optional().default(0).messages({
    'number.base': 'offset debe ser un número',
    'number.min': 'offset no puede ser negativo',
  }),
  page: Joi.number().integer().positive().optional().messages({
    'number.base': 'page debe ser un número',
    'number.positive': 'page debe ser mayor a 0',
  }),
}).unknown(true);
