import { IErrorSerialized } from "../interfaces/errors";

export default class CustomError<T> extends Error {
  statusCode: number = 0;
  errors: T | undefined;
  constructor(statusCode: number, errors: T) {
    super("errr");
    this.statusCode = statusCode;
    this.errors = errors;
  }
  serialize(): IErrorSerialized[] {
    let result: IErrorSerialized[] = [];
    for (let i in this.errors)
      result.push({ message: this.errors[i] } as IErrorSerialized);
    return result;
  }
}
