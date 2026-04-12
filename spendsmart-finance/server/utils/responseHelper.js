export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const body = { success: true, message, timestamp: new Date().toISOString() };
  if (data !== null && data !== undefined) body.data = data;
  return res.status(statusCode).json(body);
};

export const sendError = (res, message = 'Something went wrong', statusCode = 400, errors = null) => {
  const body = { success: false, message, timestamp: new Date().toISOString() };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode   = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
