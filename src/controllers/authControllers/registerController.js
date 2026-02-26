import { registerSchema } from '../../schemas/authSchemas.js';
import { registerService } from '../../services/authServices/indexAuthServices.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Register a new user
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const registerController = async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }

    // Call registerService
    const newUser = await registerService(value);

    // Generate tokens using the same approach as login
    const { loginService } = await import('../../services/authServices/indexAuthServices.js');
    const result = await loginService({
      email: value.email,
      password: value.password,
    });

    // Return user + tokens (201)
    return res.status(201).json({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

export default registerController;
