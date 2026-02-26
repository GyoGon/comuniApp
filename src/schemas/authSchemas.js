import Joi from 'joi';

/**
 * Schema for user registration
 */
export const registerSchema = Joi.object({
  nombre: Joi.string().trim().min(3).max(100).required().messages({
    'string.empty': 'El nombre no puede estar vacío',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres',
    'any.required': 'El nombre es requerido',
    'string.base': 'El nombre debe ser texto',
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.email': 'Debe ser un email válido',
    'any.required': 'El email es requerido',
    'string.base': 'El email debe ser texto',
  }),
  password: Joi.string().min(8).max(128).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'string.max': 'La contraseña no puede exceder 128 caracteres',
    'any.required': 'La contraseña es requerida',
    'string.base': 'La contraseña debe ser texto',
  }),
  passwordConfirm: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Las contraseñas no coinciden',
    'any.required': 'La confirmación de contraseña es requerida',
  }),
  telefono: Joi.string().trim().optional().min(7).max(20).messages({
    'string.base': 'El teléfono debe ser texto',
    'string.min': 'El teléfono debe tener al menos 7 caracteres',
    'string.max': 'El teléfono no puede exceder 20 caracteres',
  }),
}).unknown(false);

/**
 * Schema for user login
 */
export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.email': 'Debe ser un email válido',
    'any.required': 'El email es requerido',
    'string.base': 'El email debe ser texto',
  }),
  password: Joi.string().required().messages({
    'any.required': 'La contraseña es requerida',
    'string.base': 'La contraseña debe ser texto',
  }),
}).unknown(false);

/**
 * Schema for token refresh
 */
export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'El refreshToken es requerido',
    'string.base': 'El refreshToken debe ser texto',
  }),
}).unknown(false);
