import { CustomError } from './errors/custom_error';
import { PlatformError } from './errors/platform_error';
import { IErrorLoggerFunction } from './interfaces/errors';

export type { IErrorLoggerFunction, IErrorSerialized, IServerError } from './interfaces/errors';
export { StatusCodes } from './utils/status_codes';

export { CustomError };
export default PlatformError;

/**
 * @description ExpressErrorHandler is express middleware handler factory function to serialize `PlatformError`.
 * - Example: `app.use(ExpressErrorHandler(true));`.
 * - Note: Use `express-async-errors` package before use this handler.
 * - Note: Use this handler at last of Express application routing.
 * @param logger {Boolean} Print error on console if `logger` is `true`
 * @default logger = false
 * @returns {Object} express middleware handler.
 */
export const ExpressErrorHandler =
  (logger: boolean | IErrorLoggerFunction = false) =>
  (error: Error, _request: any, response: any, _next: (route?: any) => void) => {
    if (logger) {
      if (typeof logger === 'function') {
        logger(error);
      } else {
        console.log(error);
      }
    }
    _next();
    if (error instanceof CustomError) {
      return response.status(error.statusCode).json({
        status: false,
        errors: error.serialize(),
      });
    }
    return response.status(500).json({
      status: false,
      errors: [
        {
          message: error.message || 'Something unexpected happened!',
        },
      ],
    });
  };
