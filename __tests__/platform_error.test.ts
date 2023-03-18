import PlatformError from "../index";
import { StatusCodes } from "../utils/status_codes";

function getError(errorType: any, options: any) {
    try {
        throw new PlatformError(errorType, options);
    }
    catch (error) {
        return error as PlatformError;
    }
}

function callAllPlatformError() {
    for (const status in StatusCodes) {
        test(`${status} error ${StatusCodes[status as keyof typeof StatusCodes]}`, () => {
            const messages: string[] = [];
            for (let i = 0; i < Math.round(10 * Math.random()); i++) {
                messages.push(`${Math.random()}`);
            }
            const resource = `${Math.random()}`;
            const error = getError(status, { messages, resource })

            // check that the returned error was PlatformError
            expect(error).toBeInstanceOf(PlatformError);
            expect(error).toHaveProperty('statusCode', StatusCodes[status as keyof typeof StatusCodes]);

            const combineErrors = [status, ...messages, resource];
            expect(error).toHaveProperty('errors', combineErrors);
            //check the Serialize results
            expect(error.serialize()).toEqual(combineErrors.map(v => ({ message: v })));
        });
    }
}

describe('Platform Error', () => {
    callAllPlatformError();
});