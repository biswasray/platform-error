export interface IErrorSerialized {
  message: string;
  param?: string;
}
export interface IServerError {
  status: false;
  errors: Array<{
    message: string;
  }>;
}
