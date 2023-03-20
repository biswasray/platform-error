import { StatusCodes } from '../utils/status_codes';
import { CustomError } from './custom_error';

/**
 * PlatformError
 *
 * @alias PlatformError
 */
export class PlatformError extends CustomError<string[]> {
  /**
   * @summary create PlatformError object to throw.
   * - Example: `throw new PlatformError("Not Found", { messages: "Page not found", resource: "/user" });`
   * @param status {String} type of HTTP response status
   * @param options {Object} extra meassages or resource related to error
   */
  constructor(status: keyof typeof StatusCodes, options?: { messages?: string[]; resource?: string }) {
    const messages: string[] = [status, ...(options?.messages ?? [])];
    if (options?.resource) {
      messages.push(options.resource);
    }
    super(StatusCodes[status], messages);
  }
}
