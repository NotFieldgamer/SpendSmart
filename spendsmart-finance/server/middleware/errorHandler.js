import { sendError } from '../utils/responseHelper.js';

export default (err, _req, res, _next) => {
  console.error(`[${err.name}] ${err.message}`);

  if (err.name === 'ValidationError') {
    return sendError(res, Object.values(err.errors)[0].message, 400);
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(res, `${field.charAt(0).toUpperCase() + field.slice(1)} is already in use`, 409);
  }
  if (err.name === 'CastError') {
    return sendError(res, `Invalid value for "${err.path}"`, 400);
  }
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired. Please log in again.', 401);
  }
  if (err.type === 'entity.too.large') {
    return sendError(res, 'Request body too large', 413);
  }
  if (err.isOperational) {
    return sendError(res, err.message, err.statusCode || 500);
  }

  const message = process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred'
    : err.message;

  return sendError(res, message, err.statusCode || 500);
};
