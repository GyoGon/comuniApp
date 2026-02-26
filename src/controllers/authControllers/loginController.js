import { loginSchema } from '../../schemas/authSchemas.js';
import { loginService } from '../../services/authServices/indexAuthServices.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Login user and return tokens
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const loginController = async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }

    // Call loginService
    const result = await loginService(value);

    // Return user + tokens (200)
    return res.status(200).json(result);
  } catch (err) {
    next(createError(err.message, 401));
  }
};

export default loginController;
