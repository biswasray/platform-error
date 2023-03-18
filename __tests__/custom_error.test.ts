import { CustomError } from "../errors/custom_error";

function getError<T extends string[] | Record<string, string>>(statusCode: any, errors: T) {
    try {
        throw new CustomError(statusCode, errors);
    }
    catch (error) {
        return error as CustomError<T>;
    }
}
function callCustomError() {
    const codes: number[] = [];
    for (let i = 0; i < (10 * Math.random()); i++) {
        codes.push(Math.round(1000 * Math.random()));
    }
    for (const code of codes) {
        test(`Custom Error ${code}`, () => {
            const errors: string[] = [];
            for (let i = 0; i < Math.round(10 * Math.random()); i++) {
                errors.push(`${Math.random()}`);
            }
            const error = getError(code, errors);

            // check that the returned error was CustomError
            expect(error).toBeInstanceOf(CustomError);
            expect(error).toHaveProperty('statusCode', code);
            expect(error).toHaveProperty('errors', errors);
            //check the Serialize results
            expect(error.serialize()).toEqual(Object.values(errors).map(v => ({ message: v })));
        });
    }
    for (const code of codes) {
        test(`Custom Error ${code}`, () => {
            const errors: Record<string, string> = {};
            for (let i = 0; i < Math.round(10 * Math.random()); i++) {
                errors[i] = (`${Math.random()}`);
            }
            const error = getError(code, errors);

            // check that the returned error was CustomError
            expect(error).toBeInstanceOf(CustomError);
            expect(error).toHaveProperty('statusCode', code);
            expect(error).toHaveProperty('errors', errors);
        });
    }
}
describe('Custom Error', () => {
    callCustomError();
});