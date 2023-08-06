import PlatformError from '../index';
import { ERROR_STATUS_CODES } from '../utils/status_codes';

function getError(errorType: any, options: any) {
  try {
    throw new PlatformError(errorType, options);
  } catch (error) {
    return error as PlatformError;
  }
}

function callAllPlatformError() {
  for (const status in ERROR_STATUS_CODES) {
    test(`${status} error ${ERROR_STATUS_CODES[status as keyof typeof ERROR_STATUS_CODES]}`, () => {
      const messages: string[] = [];
      for (let i = 0; i < Math.round(10 * Math.random()); i++) {
        messages.push(`${Math.random()}`);
      }
      const resource = `${Math.random()}`;
      const error = getError(status, { messages, resource });

      // check that the returned error was PlatformError
      expect(error).toBeInstanceOf(PlatformError);
      expect(error).toHaveProperty('statusCode', ERROR_STATUS_CODES[status as keyof typeof ERROR_STATUS_CODES]);

      const combineErrors = [status, ...messages, resource];
      expect(error).toHaveProperty('errors', combineErrors);
      // check the Serialize results
      expect(error.serialize()).toEqual(combineErrors.map((v) => ({ message: v })));
    });
  }
}

describe('Platform Error', () => {
  callAllPlatformError();
});
