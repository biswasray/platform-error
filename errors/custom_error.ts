import { IErrorSerialized } from '../interfaces/errors';

export class CustomError<T extends string[] | Record<string, string>> extends Error {
  statusCode: number = 0;
  errors: T | undefined;
  constructor(statusCode: number, errors: T) {
    super(Object.values(errors).join(' ') || 'Custom error occurred');
    this.statusCode = statusCode;
    this.errors = errors;
  }
  serialize(): IErrorSerialized[] {
    const result: IErrorSerialized[] = [];
    for (const i in this.errors) result.push({ message: this.errors[i] } as IErrorSerialized);
    return result;
  }
}
