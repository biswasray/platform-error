import { StatusCodes } from "../utils/status_codes";
import CustomError from "./custom_error";

export default class PlatformError extends CustomError<string[]> {
  constructor(
    status: keyof typeof StatusCodes,
    options?: { messages?: string[]; resource?: string }
  ) {
    const messages: string[] = [status, ...(options?.messages ?? [])];
    if (options?.resource) {
      messages.push(options.resource);
    }
    super(StatusCodes[status], messages);
  }
}
