class CustomError extends Error {
  statusCode: number;
  isOperational: boolean;
  cause?: Error;

  constructor(message: string, statusCode: number, cause?: Error) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.cause = cause;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
