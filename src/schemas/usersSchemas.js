import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    }).messages({
    'string.min': 'El campo {#label} debe tener al menos {#limit} caracteres.',
    'string.email': 'El campo {#label} debe ser un correo electrónico válido.',
    'any.required': 'El campo {#label} es obligatorio.',
    'any.only': 'El campo {#label} debe coincidir con la contraseña.'
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
}).messages({
  'string.min': 'El campo {#label} debe tener al menos {#limit} caracteres.',
  'string.email': 'El campo {#label} debe ser un correo electrónico válido.',
  'any.required': 'El campo {#label} es obligatorio.'
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).optional()
}).messages({
  'string.min': 'El campo {#label} debe tener al menos {#limit} caracteres.',
  'string.email': 'El campo {#label} debe ser un correo electrónico válido.',
  'any.only': 'El campo {#label} debe coincidir con la contraseña.'
});

export const userIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'El campo {#label} no puede estar vacío.',
    'any.required': 'El campo {#label} es obligatorio.'
  })
});

